import axios from 'axios'
import * as cheerio from 'cheerio'
import { URL } from 'url'

interface IsearchResults {
  filetype: string
  href: string
  title: string
  size: string
  seeders: number
  leechers: number
  magnet: string
  hash: string
}

interface IsearchResponse {
  searchResults: IsearchResults[]
  search: string
  pageSize: number
  total: number
}

interface IshowEpisodes {
  episodeNumber: string
  episodeTitle: string
  dataHref: string
}

interface IshowSeasons {
  season: string
  date: string
  episodes: IshowEpisodes[]
}

interface IshowResponse {
  title: string
  from: string
  to: string
  summary: string
  seasons: IshowSeasons[]
}

interface Iresponse {
  type: string
  searchResponse?: IsearchResponse
  showResponse?: IshowResponse
  movieResponse?: ImovieResponse
  torrentResponse?: Itorrent
}

interface Idata {
  title: string
  metaUrl: string
  sound: string
  language: string
  quality: string
  magnet: string
  hash: string
  size: string
  seeders: number
  leechers: number
}

interface ImovieResults {
  title: string
  torrentUrl: string
  sound: string
  language: string
  quality: string
  size: string
  seeders: number
  leechers: number
}

interface ImovieResponse {
  title: string
  summary: string
  release: string
  results: ImovieResults[]
}

interface Itorrent {
  source?: string
  sourceUrl?: string
  magnet: string
  hash: string
  size: string
  date: string
}

interface Iload {
  $: CheerioStatic
  url: string
}

interface Isort {
  seeders: string
  date: string
  size: string
}

interface IsortType {
  descending: string
  ascending: string
}

class Enums {
  public SORT: Isort = {
    seeders: 's=ns',
    date: 's=dt',
    size: 's=sz'
  }
  public SORT_TYPE: IsortType = {
    descending: 'sd=d',
    ascending: 'sd=a'
  }
}

class Common {
  public static async load (url: string): Promise<Iload> {
    console.log(url)
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

      const typeElement = $('.zqf.text-muted2.zqf-small.pad-r2').eq(i)

      let filetype = ''
      switch (true) {
        case typeElement.hasClass('zqf-movies'):
          filetype = 'movie'
          break

        case typeElement.hasClass('zqf-tv'):
          filetype = 'show'
          break

        case typeElement.hasClass('zqf-anime'):
          filetype = 'anime'
          break

        case typeElement.hasClass('zqf-game'):
          filetype = 'game'
          break

        case typeElement.hasClass('zqf-app'):
          filetype = 'app'
          break

        case typeElement.hasClass('zqf-music'):
          filetype = 'music'
          break

        case typeElement.hasClass('zqf-book'):
          filetype = 'book'
          break

        case typeElement.hasClass('zqf-files'):
          filetype = 'other'
          break

        default:
          filetype = 'unknown'
          break
      }

      searchResults.push({
        filetype,
        href: e.attr('href'),
        title: e.text(),
        size,
        seeders,
        leechers,
        magnet,
        hash: Common.magnetToHash(magnet)
      })
    })

    const searchResponse: IsearchResponse = {
      searchResults,
      search,
      pageSize,
      total
    }

    const response: Iresponse = {
      type: 'search',
      searchResponse
    }

    return response
  }

  public static parseShow ($: CheerioStatic, loadData?: boolean) {
    const title = $('td.h4.sh1').text()
    const [from, to] = $('.sh2 i').text().split('→').map(x => x.trim())
    const summary = $('td.small.text-muted.sh2').text()

    let seasons: IshowSeasons[] = []
    const seasonsElement = $('.panel.panel-default.eplist')
    seasonsElement.each(i => {
      const seasonTitleElement = seasonsElement.eq(i).find('.panel-heading.text-nowrap').children()

      const season = seasonTitleElement.eq(0).text()
      const date = seasonTitleElement.eq(1).text()

      const episodes: IshowEpisodes[] = []
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

    const showResponse: IshowResponse = {
      title,
      from,
      to,
      summary,
      seasons
    }

    const response: Iresponse = {
      type: 'show',
      showResponse
    }

    return response
  }

  public static parseMovie ($: CheerioStatic) {
    const moviesElement = $('td.text-nowrap.text-trunc')

    const title = $('h4.margin-top-10').text().trim()
    const summary = $('h4.margin-top-10').parent().find('p.small.text-muted').text().trim()
    const release = $('h4.margin-top-10').parent().find('h5.small.text-muted').text().trim().replace('Released • ', '')

    let results: ImovieResults[] = []

    moviesElement.each(i => {
      const title = moviesElement.eq(i).find('a').text()
      const torrentUrl = moviesElement.eq(i).find('a').attr('href')
      const sound = moviesElement.eq(i).find('span').eq(0).text()
      const language = moviesElement.eq(i).find('span').eq(1).text()
      const [quality] = title.match(/\d{3,4}p/) || ['Str']
      const size = moviesElement.eq(i).parent().find('.progress-bar.prog-blue').text()
      const [seeders, leechers] = moviesElement.eq(i).parent()
        .find('.progress-bar.prog-green').parent().attr('title')
        .match(/\d+/g).map(x => parseInt(x, 10))

      results.push({
        title,
        torrentUrl,
        sound,
        language,
        quality,
        size,
        seeders,
        leechers
      })
    })

    const movieResponse: ImovieResponse = {
      title,
      summary,
      release,
      results
    }

    const response: Iresponse = {
      type: 'movie',
      movieResponse
    }

    return response
  }

  public static parseData ($: CheerioStatic) {
    const data: Idata[] = []
    const titleLinks = $('td.text-nowrap.text-trunc a')

    titleLinks.each(i => {
      const title = titleLinks.eq(i).text()
      const metaUrl = titleLinks.eq(i).attr('href')

      let sound = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(0).text()
      let language = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(1).text().trim()
      let quality = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(2).text().trim()

      if (sound === '') sound = 'Str'
      if (language === '') language = 'Str'
      if (quality === '') [quality] = title.match(/\d{3,4}p/) || ['Str']

      const magnet = $('.spr.dl-magnet').eq(i).parent().attr('href')
      const hash = Common.magnetToHash(magnet)
      const size = $('.progress-bar.prog-blue.prog-l').eq(i).text()
      const [seeders, leechers] = $('.progress-bar.smaller.prog-l').eq(i).parent().attr('title')
        .match(/\d+/g).map(x => parseInt(x, 10))

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
      })
    })

    return data
  }

  public static parseTorrent ($: CheerioStatic) {
    const sourceElement = $(':contains("– Indexed from –")').last().next()

    const source = sourceElement.text().trim()
    const sourceUrl = sourceElement.attr('href')

    const magnet = $('.dl-magnet').parent().attr('href')
    const hash = Common.magnetToHash(magnet)

    const [size, date] = $('.zqf-files').last().parent()
      .contents().toArray().filter((x: any) => x.type === 'text')
      .map(x => x.data.trim())

    const torrent: Itorrent = {
      source,
      sourceUrl,
      magnet,
      hash,
      size,
      date
    }

    return torrent
  }
}

export class Zooqle {
  public endPoint = 'https://zooqle.com'
  public enums = new Enums()

  public async search (query: string, parameters: string[] = []) {
    return new Promise<Iresponse>((resolve, reject) => {
      const url = new URL(`${this.endPoint}/search`)
      url.searchParams.append('q', query)

      parameters.forEach(param => {
        const [key, val] = param.split('=')
        url.searchParams.append(key, val)
      })

      Common.load(`${this.endPoint}/search?q=${query}`)
        .then(res => {
          switch (true) {
            case /\/tv\//.test(res.url):
              return resolve(Parser.parseShow(res.$)) // handle tv
            case /\/movie\//.test(res.url):
              return resolve(Parser.parseMovie(res.$)) // handle movie
            case /\/search/.test(res.url):
              return resolve(Parser.parseSearch(res.$)) // handle search
            default:
              const torrentResponse = Parser.parseTorrent(res.$) // handle direct torrent
              const response: Iresponse = {
                type: 'torrent',
                torrentResponse
              }

              return resolve(response)
          }
        })
        .catch(reject)
    })
  }

  public async getHrefData (dataHref: string) {
    return new Promise<Idata[]>((resolve, reject) => {
      Common.load(`${this.endPoint}${dataHref}`).then(res => {
        resolve(Parser.parseData(res.$))
      })
    })
  }

  public async getTorrentData (torrentUrl: string) {
    return new Promise<Itorrent>((resolve, reject) => {
      Common.load(`${this.endPoint}${torrentUrl}`).then(res => {
        resolve(Parser.parseTorrent(res.$))
      })
    })
  }
}

export const zooqle = new Zooqle()
