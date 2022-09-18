import { Component } from "react";
export declare type LinkedinBadgeLoaderProps = {
    locale?: string;
    size?: 'small' | 'medium' | 'large';
    theme?: 'dark' | 'light';
    type?: 'horizontal' | 'vertical';
    vanity?: string;
    version?: 'v1' | 'v2';
};
export default class LinkedinBadgeLoader extends Component<any, Required<LinkedinBadgeLoaderProps & {
    badgeLoaded: boolean;
}>> {
    readonly CALLBACK_NAME: string;
    readonly BADGE_NAMES: string[];
    readonly SCRIPT_NAMES: string[];
    readonly TRACKING_PARAM = "profile-badge";
    private responsesReceived;
    private expectedResponses;
    private scripts;
    private childScripts;
    readonly badges: HTMLElement[];
    static isCNDomain(): boolean;
    static generateUrl(isEI: boolean): string;
    constructor(props: LinkedinBadgeLoaderProps);
    /**
     * Renders all unrendred LinkedIn Badges on the page
     */
    liuRenderAll(): void;
    getBadgeKeyQueryParams(badge: HTMLElement): string[];
    renderBadge(badge: HTMLElement): void;
    /**
     * Handles a response from the server. Finds badge matching badgeUid and inserts badgeHtml there
     * @param badgeHtml: String representing contents of the badge
     * @param badgeUid: UID of the badge to target
     **/
    responseHandler(badgeHtml: HTMLElement, badgeUid: string): void;
    replaceScriptTags(node: Node, isCreate: boolean): Node;
    shouldReplaceNode(node: HTMLElement, isCreate: boolean): boolean;
    isScriptNode(node: HTMLElement): boolean;
    cloneScriptNode(node: HTMLElement): HTMLScriptElement;
    render(): JSX.Element;
    /**
     * Tries to clean added tags
     **/
    tryClean(): void;
    jsonp(url: string): void;
}
//# sourceMappingURL=index.d.ts.map