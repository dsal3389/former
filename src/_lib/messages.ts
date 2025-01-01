
export enum Variant {
    Tab,
    Traffic,
}

// represent `former` plugin event message
// used everywhere
export class Message {
    url: string;
    variant: Variant;
    reason: string | null;
    deletable: boolean;

    constructor(variant: Variant, url: string, reason: string | null, deletable: boolean) {
        this.url = url;
        this.variant = variant;
        this.reason = reason;
        this.deletable = deletable;
    }
}
