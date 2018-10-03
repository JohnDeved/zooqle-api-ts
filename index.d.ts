export declare class Zooqle {
    endPoint: string;
    search(query: string): Promise<any>;
    getHrefData(dataHref: string): Promise<any>;
}
export declare const zooqle: Zooqle;
