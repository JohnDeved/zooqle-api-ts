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
/* tslint:disable:no-unused-expression */
const _1 = require(".");
const chai = require("chai");
describe('zooqle scraper tests', function () {
    it('search', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _1.zooqle.search('silicon valley');
            chai.expect(result).to.exist;
            chai.expect(result.showResponse).to.not.exist;
            chai.expect(result.searchResponse).to.exist;
            chai.expect(result.type).to.exist;
            chai.expect(result.type).to.be.equal('search');
        });
    });
    it('get data', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _1.zooqle.getData('/misc/tveps.php?show=60573&se=5&ep=1');
            chai.expect(result).to.exist;
            chai.expect(result.length).to.exist;
            chai.expect(result).to.be.an('array');
        });
    });
    it('get torrent data', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _1.zooqle.getTorrentData('/batman-the-dark-knight-2008-2160p-x265-10bit-s90-joy-wqipm.html');
            chai.expect(result).to.exist;
            chai.expect(result.filetype).to.be.equal('movie');
            chai.expect(result.hash).to.exist;
            chai.expect(result.hash).not.to.be.equal(null);
        });
    });
    describe('search imdb', function () {
        it('show', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield _1.zooqle.search('tt2575988');
                chai.expect(result).to.exist;
                chai.expect(result.showResponse).to.exist;
                chai.expect(result.searchResponse).to.not.exist;
                chai.expect(result.movieResponse).to.not.exist;
                chai.expect(result.type).to.exist;
                chai.expect(result.type).to.be.equal('show');
            });
        });
        it('movie', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield _1.zooqle.search('tt0468569');
                chai.expect(result).to.exist;
                chai.expect(result.movieResponse).to.exist;
                chai.expect(result.showResponse).to.not.exist;
                chai.expect(result.searchResponse).to.not.exist;
                chai.expect(result.type).to.exist;
                chai.expect(result.type).to.be.equal('movie');
            });
        });
        it('hash', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield _1.zooqle.search('115E8B3596DE77BF6A463B2654697F47F4064DB6');
                chai.expect(result).to.exist;
                chai.expect(result.torrentResponse).to.exist;
                chai.expect(result.movieResponse).to.not.exist;
                chai.expect(result.searchResponse).to.not.exist;
                chai.expect(result.showResponse).to.not.exist;
                chai.expect(result.type).to.exist;
                chai.expect(result.type).to.be.equal('torrent');
            });
        });
    });
});
