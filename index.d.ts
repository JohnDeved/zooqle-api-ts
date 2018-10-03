export declare class Zooqle {
    endPoint: string;
    search(query: string): Promise<any>;
    getHrefData(dataHred: string): Promise<void>;
}
export declare const zooqle: Zooqle;
