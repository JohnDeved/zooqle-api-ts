# Zooqle Search

**Parameters:**
- query: **string**
- params _(optimal)_: **string array**

**return**: Promise<[returns](#returns)>

```js
// (query: string, params?: string[]): Promise
zooqle.search()
```

## Search by Query

**return:** [search](#search)

**example:**
```js
zooqle.search('silicon valley').then(response => {
  // code
})
```

## Search by IMDB Id

**return:** [show](#show) | [movie](#movie)

**example:**
```js
zooqle.search('tt2575988').then(response => {
  // code
})
```

## Search by Magnet hash

**return:** [torrent](#torrent)

**example:**
```js
zooqle.search('115E8B3596DE77BF6A463B2654697F47F4064DB6').then(response => {
  // code
})
```

## Returns

### search
example return:
```json
{
    "type": "search",
    "searchResponse": {
        "searchResults": [
            {
                "filetype": "show",
                "href": "/silicon-valley-s04e07-hdtv-x264-sva-rartv-w8suk.html",
                "title": "Silicon Valley S04E07 HDTV x264-SVA[rartv]",
                "size": "150 MB",
                "seeders": 570,
                "leechers": 17,
                "magnet": "magnet:?xt=urn:btih:115E8B3596DE77BF6A463B2654697F47F4064DB6&dn=%5Bzooqle.com%5D%20Silicon%20Valley%20S04E07%20HDTV%20x264-SVA%5Brartv%5D&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=http://explodie.org:6969/announce&tr=http://tracker.mg64.net:6881/announce&tr=http://mgtracker.org:2710/announce",
                "hash": "115E8B3596DE77BF6A463B2654697F47F4064DB6"
            },
            ...
        ],
        "search": "silicon valley",
        "pageSize": 30,
        "total": 931
    }
}
```

### show
example return:
```json
{
    "type": "show",
    "showResponse": {
        "title": "Silicon Valley",
        "from": "April 6, 2014",
        "to": "May 27, 2018",
        "summary": "Follows the struggle of Richard Hendricks, a silicon valley engineer trying to build his own company called Pied Piper",
        "seasons": [
            {
                "season": "Season 5",
                "date": "March 25, 2018",
                "episodes": [
                    {
                        "episodeNumber": "*",
                        "episodeTitle": "Compilations & Specials",
                        "dataHref": "/misc/tveps.php?show=60573&se=5&ep=-1"
                    },
                    {
                        "episodeNumber": "1",
                        "episodeTitle": "Grow Fast or Die Slow",
                        "dataHref": "/misc/tveps.php?show=60573&se=5&ep=1"
                    },
                    ...
                ]
            },
            ...
        ]
    }
}
```

### movie
example return:
```json
{
    "type": "movie",
    "movieResponse": {
        "title": "The Dark Knight (2008)",
        "summary": "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham, the Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "release": "July 16, 2008",
        "results": [
            {
                "title": "The Dark Knight 2008 IMAX BluRay 2160p x265 HDR DD 5 1[En Hi]-DT",
                "torrentUrl": "/the-dark-knight-2008-imax-bluray-2160p-x265-hdr-dd-5-1-en-hi-dt-wyu0g.html",
                "sound": "5.1",
                "language": "en,hi",
                "quality": "2160p",
                "size": "22.9 GB",
                "seeders": 15,
                "leechers": 15
            },
            ...
        ]
    }
}
```

### torrent
example return:
```json
{
    "type": "torrent",
    "torrentResponse": {
        "source": "The Pirate Bay",
        "magnet": "magnet:?xt=urn:btih:115E8B3596DE77BF6A463B2654697F47F4064DB6&dn=%5Bzooqle.com%5D%20Silicon%20Valley%20S04E07%20HDTV%20x264-SVA%5Brartv%5D&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=http://explodie.org:6969/announce&tr=http://tracker.mg64.net:6881/announce&tr=http://mgtracker.org:2710/announce&xl=157947942&tr=udp%3A%2F%2Feddie4.nl%3A6969&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fmgtracker.org%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337",
        "hash": "115E8B3596DE77BF6A463B2654697F47F4064DB6",
        "size": "150 MB",
        "date": "Jun 5, 2017"
    }
}
```

