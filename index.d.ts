interface IsearchResults {
    type: string;
    href: string;
    title: string;
    size: string;
    seeders: number;
    leechers: number;
    magnet: string;
    hash: string;
}
interface IsearchResponse {
    searchResults: IsearchResults[];
    search: string;
    pageSize: number;
    total: number;
}
interface IshowEpisodes {
    episodeNumber: string;
    episodeTitle: string;
    dataHref: string;
}
interface IshowSeasons {
    season: string;
    date: string;
    episodes: IshowEpisodes[];
}
interface IshowResponse {
    title: string;
    from: string;
    to: string;
    summary: string;
    seasons: IshowSeasons[];
}
interface Iresponse {
    type: string;
    searchResponse?: IsearchResponse;
    showResponse?: IshowResponse;
    movieResponse?: ImovieResponse;
    torrentResponse?: Itorrent;
}
interface Idata {
    title: string;
    metaUrl: string;
    sound: string;
    language: string;
    quality: string;
    magnet: string;
    hash: string;
    size: string;
    seeders: number;
    leechers: number;
}
interface ImovieResults {
    title: string;
    torrentUrl: string;
    sound: string;
    language: string;
    quality: string;
    size: string;
    seeders: number;
    leechers: number;
}
interface ImovieResponse {
    title: string;
    summary: string;
    release: string;
    results: ImovieResults[];
}
interface Itorrent {
    source?: string;
    sourceUrl?: string;
    magnet: string;
    hash: string;
    size: string;
    date: string;
}
declare class Enums {
    static SORT: {
        seeders: string;
        date: string;
        size: string;
    };
    static SORT_TYPE: {
        descending: string;
        ascending: string;
    };
}
export declare class Zooqle {
    endPoint: string;
    enums: typeof Enums;
    search(query: string, parameters?: string[]): Promise<Iresponse>;
    getHrefData(dataHref: string): Promise<Idata[]>;
    getTorrentData(torrentUrl: string): Promise<Itorrent>;
}
export declare const zooqle: Zooqle;
export {};
