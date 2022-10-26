

export class SpConfig {     
    public static ConfigList: any[] = [];

    public static UTCBias: number = null;
    public static UTCDaylightBias: number = null;

    public static getRecordByTitle(Title: string): any {
        return this.ConfigList.filter(function (x) {
            return x['Title'] == Title;
        })
    }
     
}
