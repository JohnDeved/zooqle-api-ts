interface IsearchResults {
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
export declare class Zooqle {
    search(query: string): Promise<IsearchResponse>;
}
export declare const zooqle: Zooqle;
export {};
