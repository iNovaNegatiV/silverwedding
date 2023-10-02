import { identifierName } from "@angular/compiler";

export class GuestEntry {

    private n: number;
    private row_id: number;
    private username: string;
    private g_amount: number;
    private status: number;
    private timestamp: string;

    constructor(jsonObject: object) {
        Object.assign(this, jsonObject);
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

    public getGuestAmount(): number {
        return this.g_amount;
    }

    public getStatus(): number {
        return this.status;
    }

    public getTimestamp(): string {
        return this.timestamp;
    }
}