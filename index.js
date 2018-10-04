"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio = require("cheerio");
class Common {
    static load(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get(url);
            return {
                $: cheerio.load(result.data),
                url: result.request.path
            };
        });
    }
    static magnetToHash(magnet) {
        return magnet.match(/:([\w\d]{40})/)[1];
    }
}
class Parser {
    static parseSearch($) {
        let [, search, pageSize, total] = $('.panel.zq-panel.zq-small .panel-heading')
            .text().trim().match(/"(.+)"\n{2}.+-\n(\d+)\nof (\d+)/);
        pageSize = parseInt(pageSize, 10);
        total = parseInt(total, 10);
        const htmlResults = $('td.text-trunc.text-nowrap a');
        const searchResults = [];
        htmlResults.each((i) => {
            const e = htmlResults.eq(i);
            const progress = e.parent().parent().find('.progress');
            const magnet = e.parent().parent().find('.spr.dl-magnet')
                .first().parent().attr('href');
            const size = progress.eq(0).text();
            const [seeders, leechers] = progress.eq(1).attr('title')
                .match(/\d+/g).map(x => parseInt(x, 10));
            searchResults.push({
                href: e.attr('href'),
                title: e.text(),
                size,
                seeders,
                leechers,
                magnet,
                hash: Common.magnetToHash(magnet)
            });
        });
        const searchResponse = {
            searchResults,
            search,
            pageSize,
            total
        };
        const response = {
            type: 'search',
            searchResponse
        };
        return response;
    }
    static parseShow($) {
        const title = $('td.h4.sh1').text();
        const [from, to] = $('.sh2 i').text().split('→').map(x => x.trim());
        const summary = $('td.small.text-muted.sh2').text();
        let seasons = [];
        const seasonsElement = $('.panel.panel-default.eplist');
        seasonsElement.each(i => {
            const seasonTitleElement = seasonsElement.eq(i).find('.panel-heading.text-nowrap').children();
            const season = seasonTitleElement.eq(0).text();
            const date = seasonTitleElement.eq(1).text();
            const episodes = [];
            const episodesListElement = seasonsElement.eq(i).find('ul.list-group.eplist').find('.list-group-item');
            episodesListElement.each(ei => {
                const episodeNumber = episodesListElement.eq(ei).find('span.smaller.text-muted.epnum').text();
                const episodeTitle = episodesListElement.eq(ei).find('a.pad-r2').text();
                const dataHref = episodesListElement.eq(ei).find('.collapse.epdiv').attr('data-href');
                episodes.push({
                    episodeNumber,
                    episodeTitle,
                    dataHref
                });
            });
            seasons.push({
                season,
                date,
                episodes
            });
        });
        const showResponse = {
            title,
            from,
            to,
            summary,
            seasons
        };
        const response = {
            type: 'show',
            showResponse
        };
        return response;
    }
    static parseData($) {
        const data = [];
        const titleLinks = $('td.text-nowrap.text-trunc a');
        titleLinks.each(i => {
            const title = titleLinks.eq(i).text();
            const metaUrl = titleLinks.eq(i).attr('href');
            let sound = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(0).text();
            let language = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(1).text().trim();
            let quality = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(2).text().trim();
            if (sound === '')
                sound = 'Str';
            if (language === '')
                language = 'Str';
            if (quality === '')
                [quality] = title.match(/\d{3,4}p/) || ['Str'];
            const magnet = $('.spr.dl-magnet').eq(i).parent().attr('href');
            const hash = Common.magnetToHash(magnet);
            const size = $('.progress-bar.prog-blue.prog-l').eq(i).text();
            const [seeders, leechers] = $('.progress-bar.smaller.prog-l').eq(i).parent().attr('title')
                .match(/\d+/g).map(x => parseInt(x, 10));
            data.push({
                title,
                metaUrl,
                sound,
                language,
                quality,
                magnet,
                hash,
                size,
                seeders,
                leechers
            });
        });
        return data;
    }
}
class Zooqle {
    constructor() {
        this.endPoint = 'https://zooqle.com';
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Common.load(`${this.endPoint}/search?q=${query}`)
                    .then(res => {
                    switch (true) {
                        case /\/tv\//.test(res.url):
                            return resolve(Parser.parseShow(res.$)); // handle tv
                        case /\/movie\//.test(res.url):
                            return resolve(); // handle movie
                        default:
                            return resolve(Parser.parseSearch(res.$));
                    }
                })
                    .catch(reject);
            });
        });
    }
    getHrefData(dataHref) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Common.load(`${this.endPoint}${dataHref}`).then(res => {
                    resolve(Parser.parseData(res.$));
                });
            });
        });
    }
}
exports.Zooqle = Zooqle;
exports.zooqle = new Zooqle();
