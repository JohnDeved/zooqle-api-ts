interface IsearchResults {
    filetype: string;
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
    title: string;
    source?: string;
    sourceUrl?: string;
    magnet: string;
    hash: string;
    size: string;
    date: string;
}
interface Isort {
    seeders: string;
    date: string;
    size: string;
}
interface IsortType {
    descending: string;
    ascending: string;
}
declare class Enums {
    SORT: Isort;
    SORT_TYPE: IsortType;
}
export declare class Zooqle {
    endPoint: string;
    enums: Enums;
    search(query: string, parameters?: string[]): Promise<Iresponse>;
    getHrefData(dataHref: string): Promise<Idata[]>;
    getTorrentData(torrentUrl: string): Promise<Itorrent>;
}
export declare const zooqle: Zooqle;
export {};
