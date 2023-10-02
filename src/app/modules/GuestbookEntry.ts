export class GuestbookEntry {

    private n: number;
    private row_id: number;
    private username: string;
    private bodytext: string;
    private image: number;
    private link: string;

    constructor(jsonObject: object) {
        Object.assign(this, jsonObject)
    }

    public getN(): number {
        return this.n;
    }

    public getRowId(): number {
        return this.row_id;
    }

    public getUsername(): string {
        return this.username;
    }

    public getBodytext(): string {
        return this.bodytext;
    }

    public getImage(): number {
        return this.image;
    }

    public getLink(): string {
        return this.link;
    }
}