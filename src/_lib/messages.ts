
// the variant defines what kind of block
// happend, if it was a traffic or tab
export enum Variant {
    Tab,
    Traffic,
}

export enum FilterRule {
    // domain is blacklisted and filtered
    Domain,
    
    // some websites will contain certin keywords
    // for SEO (search engine optimization), the plugin
    // can filter based on those keywords
    Keyword,

    // user defined filter sites
    Custom
}

// represent `former` plugin event message
// used everywhere
export class Message {
    url: string;
    variant: Variant;
    filterRule: FilterRule;

    // details provide the user more information
    // about why the action happened, this is more relevent
    // for the `Keyword` and `Domain` FilterRule variants 
    details: string | null;

    constructor(variant: Variant, url: string, filterRule: FilterRule, details: string | null) {
        this.url = url;
        this.variant = variant;
        this.filterRule = filterRule;
        this.details = details;
    }

    // returns a boolean value inidicating 
    // if the rule can be deleted from filtering
    get deleteable(): boolean {
        return this.filterRule === FilterRule.Custom;
    }
}
