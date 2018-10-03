import axios from 'axios'
import * as cheerio from 'cheerio'

interface IsearchResults {
  href: string,
  title: string,
  size: string,
  seeders: number,
  leechers: number,
  magnet: string,
  hash: string
}

interface IsearchResponse {
  searchResults: IsearchResults[],
  search: string,
  pageSize: number,
  total: number
}

interface Iload {
  $: CheerioStatic,
  url: string
}

class Common {
  public static async load (url: string): Promise<Iload> {
    const result = await axios.get(url)

    return {
      $: cheerio.load(result.data),
      url: result.request.path
    }
  }

  public static magnetToHash (magnet: string) {
    return magnet.match(/:([\w\d]{40})/)[1]
  }
}

class Parser {
  public static parseSearch ($: CheerioStatic) {
    let [, search, pageSize, total]: string[] | number[] = $('.panel.zq-panel.zq-small .panel-heading')
      .text().trim().match(/"(.+)"\n{2}.+-\n(\d+)\nof (\d+)/)

    pageSize = parseInt(pageSize, 10)
    total = parseInt(total, 10)

    const htmlResults = $('td.text-trunc.text-nowrap a')
    const searchResults: IsearchResults[] = []
    htmlResults.each((i) => {
      const e = htmlResults.eq(i)

      const progress = e.parent().parent().find('.progress')
      const magnet = e.parent().parent().find('.spr.dl-magnet')
      .first().parent().attr('href')

      const size = progress.eq(0).text()
      const [seeders, leechers] = progress.eq(1).attr('title')
      .match(/\d+/g).map(x => parseInt(x, 10))

      searchResults.push({
        href: e.attr('href'),
        title: e.text(),
        size,
        seeders,
        leechers,
        magnet,
        hash: Common.magnetToHash(magnet)
      })
    })

    const response: IsearchResponse = {
      searchResults,
      search,
      pageSize,
      total
    }

    return response
  }

  public static parseShow ($: CheerioStatic) {
    const title = $('td.h4.sh1').text()
    const [from, to] = $('.sh2 i').text().split('→').map(x => x.trim())
    const summary = $('td.small.text-muted.sh2').text()

    let seasons = []
    const seasonsElement = $('.panel.panel-default.eplist')
    seasonsElement.each(i => {
      const seasonTitleElement = seasonsElement.eq(i).find('.panel-heading.text-nowrap').children()

      const season = seasonTitleElement.eq(0).text()
      const date = seasonTitleElement.eq(1).text()

      const episodes = []
      const episodesListElement = seasonsElement.eq(i).find('ul.list-group.eplist').find('.list-group-item')

      episodesListElement.each(ei => {
        const episodeNumber = episodesListElement.eq(ei).find('span.smaller.text-muted.epnum').text()
        const episodeTitle = episodesListElement.eq(ei).find('a.pad-r2').text()
        const dataHref = episodesListElement.eq(ei).find('.collapse.epdiv').attr('data-href')

        episodes.push({
          episodeNumber,
          episodeTitle,
          dataHref
        })
      })

      seasons.push({
        season,
        date,
        episodes
      })
    })

    console.log(seasons)
    debugger
  }
}

export class Zooqle {
  public endPoint = 'https://zooqle.com'

  public async search (query: string) {
    return new Promise<any>((resolve, reject) => {
      Common.load(`${this.endPoint}/search?q=${query}`)
        .then(res => {
          switch (true) {
            case /\/tv\//.test(res.url):
              return resolve(Parser.parseShow(res.$)) // handle tv
            case /\/movie\//.test(res.url):
              return resolve() // handle movie
            default:
              return resolve(Parser.parseSearch(res.$))
          }
        })
        .catch(reject)
    })
  }

  public async getHrefData (dataHred: string) {
    // return new Promise
  }
}

export const zooqle = new Zooqle()
