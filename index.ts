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

class Common {
  public static async request (url: string) {
    const result = await axios.get(url)
    return cheerio.load(result.data)
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
}

export class Zooqle {

  public async search (query: string) {
    return new Promise<IsearchResponse>((resolve, reject) => {
      Common.request(`https://zooqle.com/search?q=${query}`)
        .then($ => resolve(Parser.parseSearch($)))
        .catch(reject)
    })
  }
}

export const zooqle = new Zooqle()
