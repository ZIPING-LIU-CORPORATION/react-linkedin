import React from 'react';
/**
 * LinkedInBadge component props used by LinkedInBadge component to render the LinkedIn badge
 * @param locale: string - The locale of the badge
 * @param size: "medium" | "large" - The size of the badge, but type also affects the size of the badge
 * @param id: string - The id of the badge, this is only required if you are going to have multiple badges on the same page, hence if thats the case make sure each badge has a unique id or else only one might load
 * @param vanity: string - The part of your LinkedIn profile URL that comes after `linkedin.com/in/`, e.g. for `linkedin.com/in/ziping-liu-1932a029a/` the vanity is `ziping-liu-1932a029a`
 * @param type: "VERTICAL" | "HORIZONTAL" - This actually adjusts the size of the badge, where VERTICAL is smaller than HORIZONTAL, so by setting  size to "medium" and type to "VERTICAL" you get a smaller badge than setting size to "medium" and type to "HORIZONTAL", and so on.
 */
export declare type LinkedInBadgeProps = {
    locale: string;
    size: "medium" | "large";
    theme: "light" | "dark";
    type: "VERTICAL" | "HORIZONTAL";
    vanity: string;
    version: "v1" | "v2";
    className: string;
    style: React.CSSProperties;
    id: string;
};
export default function LinkedInBadge(props: Partial<LinkedInBadgeProps>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map