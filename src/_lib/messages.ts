
// the Effected defines what was effected
// by the trigger
export enum Effected {
    Tab,
    Traffic,
}

export enum Reason {
    // domain is blacklisted and filtered
    Domain,
    
    // some websites will contain certin keywords
    // for SEO (search engine optimization), the plugin
    // can filter based on those keywords
    Keyword,

    // user defined filter sites
    Custom
}

export interface MessageProps {
    url: string, 
    effected: Effected,
    reason: Reason, 
    details: string | null
}

// represent `former` plugin event message
// used everywhere
export class Message {
    url: string;
    effected: Effected;
    reason: Reason;

    // details provide the user more information
    // about why the action happened, this is more relevent
    // for the `Keyword` and `Domain` FilterRule variants 
    details: string | null;

    constructor({ url, effected, reason, details }: MessageProps) {
        this.url = url;
        this.effected = effected;
        this.reason = reason;
        this.details = details;
    }

    // returns a boolean value inidicating 
    // if the rule can be deleted from filtering
    get deleteable(): boolean {
        return this.reason === Reason.Custom;
    }
}
