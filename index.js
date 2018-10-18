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
const url_1 = require("url");
class Enums {
    constructor() {
        this.SORT = {
            seeders: 's=ns',
            date: 's=dt',
            size: 's=sz'
        };
        this.SORT_TYPE = {
            descending: 'sd=d',
            ascending: 'sd=a'
        };
    }
}
class Common {
    static load(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(url);
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
    static assignUrl(endpoint, source) {
        const url = new url_1.URL(endpoint);
        const href = url_1.parse(source);
        url.pathname = href.pathname;
        url.search = href.search;
        return url.href;
    }
    static iconToType(icon) {
        switch (true) {
            case icon.hasClass('zqf-movies'):
                return 'movie';
            case icon.hasClass('zqf-tv'):
                return 'show';
            case icon.hasClass('zqf-anime'):
                return 'anime';
            case icon.hasClass('zqf-game'):
                return 'game';
            case icon.hasClass('zqf-app'):
                return 'app';
            case icon.hasClass('zqf-music'):
                return 'music';
            case icon.hasClass('zqf-book'):
                return 'book';
            case icon.hasClass('zqf-files'):
                return 'other';
            default:
                return 'unknown';
        }
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
            const iconElement = $('.zqf.text-muted2.zqf-small.pad-r2').eq(i);
            const filetype = Common.iconToType(iconElement);
            searchResults.push({
                filetype,
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
    static parseShow($, loadData) {
        const title = $('td.h4.sh1').text();
        const [from, to] = $('.sh2 i').text().split('→').map(x => x.trim());
        const summary = $('td.small.text-muted.sh2').text();
        const imdb = $('.imdb_stars').attr('href');
        const [imdbId] = imdb.match(/\btt\d{7}\b/) || [null];
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
            imdb,
            imdbId,
            seasons
        };
        const response = {
            type: 'show',
            showResponse
        };
        return response;
    }
    static parseMovie($) {
        const moviesElement = $('td.text-nowrap.text-trunc');
        const title = $('h4.margin-top-10').text().trim();
        const summary = $('h4.margin-top-10').parent().find('p.small.text-muted').text().trim();
        const release = $('h4.margin-top-10').parent().find('h5.small.text-muted').text().trim().replace('Released • ', '');
        const imdb = $('.imdb_stars').attr('href');
        const [imdbId] = imdb.match(/\btt\d{7}\b/) || [null];
        let results = [];
        moviesElement.each(i => {
            const title = moviesElement.eq(i).find('a').text();
            const torrentHref = moviesElement.eq(i).find('a').attr('href');
            const sound = moviesElement.eq(i).find('span').eq(0).text();
            const language = moviesElement.eq(i).find('span').eq(1).text();
            const [quality] = title.match(/\d{3,4}p/) || ['Str'];
            const size = moviesElement.eq(i).parent().find('.progress-bar.prog-blue').text();
            const [seeders, leechers] = moviesElement.eq(i).parent()
                .find('.progress-bar.prog-green').parent().attr('title')
                .match(/\d+/g).map(x => parseInt(x, 10));
            results.push({
                title,
                torrentHref,
                sound,
                language,
                quality,
                size,
                seeders,
                leechers
            });
        });
        const movieResponse = {
            title,
            summary,
            imdb,
            imdbId,
            release,
            results
        };
        const response = {
            type: 'movie',
            movieResponse
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
    static parseTorrent($) {
        const title = $('#torname').text().replace(/ /g, '.');
        const sourceElement = $(':contains("– Indexed from –")').last().next();
        const iconElement = $('.tor-icon');
        const filetype = Common.iconToType(iconElement);
        const imdb = $('.imdb_stars').attr('href');
        const [imdbId] = imdb.match(/\btt\d{7}\b/) || [null];
        let source = sourceElement.text().trim();
        if (source === '') {
            source = null;
        }
        const sourceUrl = sourceElement.attr('href') || null;
        const magnet = $('.dl-magnet').parent().attr('href');
        const hash = Common.magnetToHash(magnet);
        const [size, date] = $('.zqf-files').last().parent()
            .contents().toArray().filter((x) => x.type === 'text')
            .map(x => x.data.trim());
        const torrent = {
            filetype,
            title,
            imdb,
            imdbId,
            source,
            sourceUrl,
            magnet,
            hash,
            size,
            date
        };
        return torrent;
    }
}
class Zooqle {
    constructor() {
        this._endpoint = new url_1.URL('https://zooqle.com');
        this.enums = new Enums();
        this._assignUrl = Common.assignUrl.bind(null, this.endPoint);
    }
    get endPoint() {
        return this._endpoint.href;
    }
    set endPoint(url) {
        this._endpoint.host = url;
    }
    search(query, parameters = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const url = this._endpoint;
                url.pathname = '/search';
                url.searchParams.append('q', query);
                parameters.forEach(param => {
                    const [key, val] = param.split('=');
                    url.searchParams.append(key, val);
                });
                Common.load(url.href)
                    .then(res => {
                    switch (true) {
                        case /\/tv\//.test(res.url):
                            return resolve(Parser.parseShow(res.$)); // handle tv
                        case /\/movie\//.test(res.url):
                            return resolve(Parser.parseMovie(res.$)); // handle movie
                        case /\/search/.test(res.url):
                            return resolve(Parser.parseSearch(res.$)); // handle search
                        default:
                            const torrentResponse = Parser.parseTorrent(res.$); // handle direct torrent
                            const response = {
                                type: 'torrent',
                                torrentResponse
                            };
                            return resolve(response);
                    }
                })
                    .catch(reject);
            });
        });
    }
    getData(dataHref) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const url = this._assignUrl(dataHref);
                Common.load(url).then(res => {
                    resolve(Parser.parseData(res.$));
                });
            });
        });
    }
    getTorrentData(torrentHref) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const url = this._assignUrl(torrentHref);
                Common.load(url).then(res => {
                    resolve(Parser.parseTorrent(res.$));
                });
            });
        });
    }
}
exports.Zooqle = Zooqle;
exports.zooqle = new Zooqle();
