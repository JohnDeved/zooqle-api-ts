import axios from 'axios'
import * as cheerio from 'cheerio'
import { request } from 'https'

class Common {
  public static async request (url) {
    const result = await axios.get(url)
    return cheerio.load(result.data)
  }
}

export class Zooqle {
  public search (query: string) {
    Common.request(`https://zooqle.com/search?q=${query}`).then($ => {

      const [, search, pageSize, total] = $('.panel.zq-panel.zq-small .panel-heading')
        .text().trim()
        .match(/"(.+)"\n{2}.+-\n(\d+)\nof (\d+)/)

      const htmlResults = $('td.text-trunc.text-nowrap a')
      const results = []
      htmlResults.each((i) => {
        const e = htmlResults.eq(i)
        const progress = e.parent().parent().find('.progress')
        const size = progress.eq(0).text()
        const [seeders, leechers] = progress.eq(1).attr('title').match(/\d+/g).map(x => parseInt(x, 10))
        results.push({
          href: e.attr('href'),
          title: e.text(),
          size,
          seeders,
          leechers
        })
      })
      console.log(results)
    })
  }
}

export const zooqle = new Zooqle()
