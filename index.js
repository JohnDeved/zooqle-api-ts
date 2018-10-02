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
    static request(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get(url);
            return cheerio.load(result.data);
        });
    }
}
class Zooqle {
    search(query) {
        Common.request(`https://zooqle.com/search?q=${query}`).then($ => {
            const [, search, pageSize, total] = $('.panel.zq-panel.zq-small .panel-heading')
                .text().trim()
                .match(/"(.+)"\n{2}.+-\n(\d+)\nof (\d+)/);
            const htmlResults = $('td.text-trunc.text-nowrap a');
            const results = [];
            htmlResults.each((i) => {
                const e = htmlResults.eq(i);
                const progress = e.parent().parent().find('.progress');
                const magnet = e.parent().parent().find('.spr.dl-magnet')
                    .first().parent().attr('href');
                const size = progress.eq(0).text();
                const [seeders, leechers] = progress.eq(1).attr('title').match(/\d+/g).map(x => parseInt(x, 10));
                results.push({
                    href: e.attr('href'),
                    title: e.text(),
                    size,
                    seeders,
                    leechers,
                    magnet
                });
            });
            console.log(results);
        });
    }
}
exports.Zooqle = Zooqle;
exports.zooqle = new Zooqle();
