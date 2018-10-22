/* tslint:disable:no-unused-expression */
import { zooqle } from '.'

import * as chai from 'chai'

describe('zooqle scraper tests', function () {
  it('search', async function () {
    const result = await zooqle.search('silicon valley')
    chai.expect(result).to.exist
    chai.expect(result.showResponse).to.not.exist
    chai.expect(result.searchResponse).to.exist
    chai.expect(result.type).to.exist
    chai.expect(result.type).to.be.equal('search')
  })

  it('get data', async function () {
    const result = await zooqle.getData('/misc/tveps.php?show=60573&se=5&ep=1')
    chai.expect(result).to.exist
    chai.expect(result.length).to.exist
    chai.expect(result).to.be.an('array')
  })

  it('get torrent data', async function () {
    const result = await zooqle.getTorrentData('/batman-the-dark-knight-2008-2160p-x265-10bit-s90-joy-wqipm.html')
    chai.expect(result).to.exist
    chai.expect(result.filetype).to.be.equal('movie')
    chai.expect(result.hash).to.exist
    chai.expect(result.hash).not.to.be.equal(null)
  })

  describe('search imdb', function () {
    it('show', async function () {
      const result = await zooqle.search('tt2575988')
      chai.expect(result).to.exist
      chai.expect(result.showResponse).to.exist
      chai.expect(result.searchResponse).to.not.exist
      chai.expect(result.movieResponse).to.not.exist
      chai.expect(result.type).to.exist
      chai.expect(result.type).to.be.equal('show')
    })
    it('movie', async function () {
      const result = await zooqle.search('tt0468569')
      chai.expect(result).to.exist
      chai.expect(result.movieResponse).to.exist
      chai.expect(result.showResponse).to.not.exist
      chai.expect(result.searchResponse).to.not.exist
      chai.expect(result.type).to.exist
      chai.expect(result.type).to.be.equal('movie')
    })
    it('hash', async function () {
      const result = await zooqle.search('115E8B3596DE77BF6A463B2654697F47F4064DB6')
      chai.expect(result).to.exist
      chai.expect(result.torrentResponse).to.exist
      chai.expect(result.movieResponse).to.not.exist
      chai.expect(result.searchResponse).to.not.exist
      chai.expect(result.showResponse).to.not.exist
      chai.expect(result.type).to.exist
      chai.expect(result.type).to.be.equal('torrent')
    })
  })
})
