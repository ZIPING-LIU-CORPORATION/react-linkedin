import React from "react";
import LIRenderAll from "./LIRenderAll";
import LinkedInBadgeSelfRender from "./LinkedInBadgeSelfRender";
/**
 * @param {string} [locale="en_US"] - The locale to use for the badge. Defaults to `"en_US"`.
 * @param {("medium"|"large")} [size="medium"] - The size of the badge. By default, the badge is set to `"medium"`.
 * @param {("light"|"dark")} [theme="light"] - The theme of the badge. By default, the badge is set to `"light"`.
 * @param {("VERTICAL"|"HORIZONTAL")} [props.type="VERTICAL"] - The orientation of the badge. By default, the badge is set to `"VERTICAL"`.
 * @param {string} [vanity="☯liu"] - The vanity name or URL to display on the badge.
 * @param {("v1"|"v2")} [version="v1"] - The version of the badge to use. Uses `"v1"` by default.
 * @param {string} [className] - Additional CSS classes to apply to the badge container.
 * @param {React.CSSProperties} [style] - Inline styles to apply to the badge container.
 * @param {string} [id] - The ID to assign to the badge container.
 * @param {string} [script_src] - The URL of an external script to include for the badge.
 * @param {string} [name] - The name to display on the badge.
 * @param {string} [entity] - The entity type of the badge, defaults to `"PROFILE"`.
 * @param {boolean} [hideViewProfileButton] - Defaults as `false`, if set `true`, the view profile button will be hidden that is displayed as part of the badge's content as a button that when clicked opens the LinkedIn profile page in a new tab.
 * @param {useLinkedInApiUrlPure} [useLinkedInApiUrlPure] - Defaults as `false`, if set `true`, when call LinkedIn's badge API, the API request won't be proxied through a Ziping.org Web Services (ZWS) web server. The proxied request is used to remove security issues that some browsers may have due to the returned content of LinkedIn's API having certain headers that the browser regards as possibly harmful (although in this case its a red-herring given badge content from LinkedIn does not contain malicious content or content that may be inappropriately used to harm the user's computer). 
 * Note: new versions (starting with 5.12 and above) may encounter issues when configured to render through a method from previous versions and especially through the method provided by LinkedIn in utilizing an injected iframe rendering that is controlled and fully facilitated at the server side. Because the latest version, 5.11 or higher, now renders the badge entirely through the client side, it cannot be fully backward compatible for receiving content from the server, since server-side and client-side rendering are generally two different paradigms for displaying web content. Server-side rendering (SSR) refers to the process of generating the final HTML of a web page on the server before sending it to the client's browser. In this approach, the server receives a request from the client, retrieves the necessary data from databases or APIs, and then generates the complete HTML page. The server sends this fully rendered HTML to the client's browser, which displays it to the user. SSR is often used for dynamic content that needs to be generated based on user-specific data, such as personalized recommendations or search results. It can also be beneficial for search engine optimization (SEO) because search engine crawlers can easily index the content of the page. On the other hand, client-side rendering (CSR) involves generating the web page's content using JavaScript on the client's browser. In this approach, the server initially sends a minimal HTML page to the client, along with the necessary JavaScript files. Once the JavaScript is loaded in the client's browser, it takes over and dynamically generates the content of the page. CSR allows for a more interactive and dynamic user experience, as the page can be updated without requiring a full page reload. However, it requires the client's device to have the necessary processing power to execute the JavaScript and render the content. The key difference between SSR and CSR lies in where the majority of the rendering process takes place. SSR relies on the server to generate the complete HTML, while CSR relies on the client's browser to generate the content using JavaScript. As a result, these two rendering methods are not meant to be used together by the nature of their design. Attempting to combine server-side and client-side rendering can lead to compatibility issues, as the server-generated content may not align with the expectations of the client-side JavaScript code. In the context of the LinkedIn badge, the latest version (5.11 or higher) has shifted to a client-side rendering approach. This means that the badge is now rendered entirely by the client's browser using JavaScript. Consequently, it may not be fully backward compatible with the previous server-side rendering method that utilized an injected iframe. Attempting to use the old server-side rendering method with the new client-side rendering version can result in conflicts and unexpected behavior. To ensure proper functionality and compatibility, it is recommended to use the rendering method that aligns with the specific version of the LinkedIn badge being implemented. If using version 5.11 or higher, the client-side rendering approach should be used, and any server-side rendering configurations from previous versions should be avoided. Please refer to 
 * the projects SECURITY.md file for details on which versions of the `react-linkedinbadge` best supports prior rendering methods.
 * @param {boolean} [generateUidWithoutApi] - Defaults as `false`, if `true`, uid creation won't include utilizing an API call to form a more unique uid.
 * @param {ReactNode} [children] - The children to render within the badge container, only supported when useLinkedInApiUrlPure is set to `false`, hence when rendering the badge within the component itself and without the LinkedIn's badge rendering API's callback injection with iframe method.
 * @param {boolean} [noCache] - Default is `false`, set to `true` to disable the caching of profile badge data in the browser's local storage. Caching is only done when rendering through the 
 * component's self-rendering method and not through the LinkedIn's badge rendering API's callback injection with iframe method.
 * @example
 * ```tsx
 * <LinkedInBadge
 *    locale="en_US"
 *    size="medium"
 *    theme="light"
 *    type="VERTICAL"
 *    entity="PROFILE"
 *    vanity="☯liu"
 *    version="v1"
 *  />
 * ```
 *
 **/
export type LinkedInBadgeProps = {
  locale: string;
  size: "medium" | "large";
  theme: "light" | "dark";
  type: "VERTICAL" | "HORIZONTAL";
  entity: "PROFILE" | "COMPANY" | "GROUP";
  vanity: string;
  version: "v1" | "v2";
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  noCache: boolean;
  id: string;
  script_src: string;
  name: string;
  debug: boolean;
  hideViewProfileButton: boolean;
  generateUidWithoutApi: boolean;
  useLinkedInApiUrlPure: boolean;
};

/**
 * React component that renders a LinkedIn badge on a website.
 * @param {LinkedInBadgeProps} props - The props for the LinkedIn badge component, such as the locale, size, theme, type, entity, vanity, version, className, style, children, id, script_src, useLinkedInApiUrlPure, name, debug, and generateUidWithoutApi. See LinkedInBadgeProps for more details.
 * @returns {React.ReactElement} The rendered LinkedIn badge component.
 * @description This implementation uses two React components - LinkedInBadge and LIRenderAll.
 * LinkedInBadge is the parent component responsible for
 * rendering the container and basic structure of the LinkedIn badge,
 * while LIRenderAll is a child component that handles
 * the rendering and management of the actual badge content.
 * @argument The reason for this separation is that the badge content needs to be loaded asynchronously from a server, and the LIRenderAll component is responsible for making the necessary requests and handling the responses. By separating the concerns, the parent component can render the initial structure, and the child component can take care of the dynamic badge content.
 * @example
 * ```tsx
 * <LinkedInBadge
 *    locale="en_US"
 *    size="medium"
 *    theme="light"
 *    type="VERTICAL"
 *    entity="PROFILE"
 *    vanity="☯liu"
 *    version="v1"
 *  />
 * ```
 */
export default function LinkedInBadge(props: Partial<LinkedInBadgeProps>) {
  const locale = props.locale || "en_US";
  const size = props.size || "medium";
  const theme = props.theme || "light";
  const generateUidWithoutApi = props.generateUidWithoutApi || false;
  const type = props.type || "VERTICAL";
  const entity = props.entity || "PROFILE";
  const vanity = props.vanity || "☯liu";
  const version = props.version || "v1";
  const useLinkedInApiUrlPure = props.useLinkedInApiUrlPure || false;
  const vanityEncoded = encodeURIComponent(vanity);
  const name = props.name || "";
  const noCache = props.noCache || false;
  const url = `https://www.linkedin.com/in/${vanityEncoded}?trk=profile-badge`;
  const refForDivBadge = React.useRef<HTMLDivElement>(null);
  const [componentDidMount, setComponentDidMount] =
    React.useState<boolean>(false);
  const [badgeDidRender, setBadgeDidRender] = React.useState<boolean>(false);

  React.useEffect(() => {
    const logDebug = (message: string, type: string, componentName: string) => {
      if (props.debug) {
        const currentTime = new Date().toLocaleTimeString();
        console.log(`[${currentTime}] ${type} - ${componentName}: ${message}`);
      }
    };

    // check if div is rendered via ref
    if (!componentDidMount) {
      logDebug(
        "checking if div is rendered",
        "info",
        "at LinkedInBadge Component React.useEffect with componentDidMount: false",
      );
      if (refForDivBadge.current) {
        logDebug(
          "div rendered",
          "info",
          "at LinkedInBadge Component React.useEffect with componentDidMount: false",
        );
        setComponentDidMount(true);
      } else {
        logDebug("div not rendered yet", "info", "at LinkedInBadge Component");
      }
    }
  }, [componentDidMount, refForDivBadge, props.debug]);

  return (
    <>
      {props.useLinkedInApiUrlPure === true ? (
        <>
          <div
            ref={refForDivBadge}
            className={
              "badge-base LI-profile-badge" +
              (props.className ? ` ${props.className}` : "")
            }
            style={props.style}
            data-locale={locale}
            data-size={size}
            data-theme={theme}
            data-type={type}
            data-vanity={vanity}
            data-version={version}
            id={props.id}
          >
            <a
              className="badge-base__link LI-simple-link"
              target="_blank"
              rel="noopener noreferrer"
              href={url}
            >
              {name}
            </a>
          </div>
          {refForDivBadge.current &&
            badgeDidRender === false &&
            componentDidMount && (
              <LIRenderAll
                generateUidWithoutApi={generateUidWithoutApi}
                useLinkedInApiUrlPure={useLinkedInApiUrlPure}
                badgeDidRender={badgeDidRender}
                setBadgeDidRender={setBadgeDidRender}
                badges={Array.from(
                  document.getElementsByClassName(
                    "badge-base LI-profile-badge",
                  ),
                )}
                script_src={props.script_src}
                debug={props.debug}
              />
            )}
        </>
      ) : (
        <LinkedInBadgeSelfRender
          locale={locale}
          size={size}
          style={props.style}
          entity={entity}
          theme={theme}
          type={type}
          vanity={vanity}
          noCache={noCache}
          version={version}
          className={props.className}
          generateUidWithoutApi={generateUidWithoutApi}
          hideViewProfileButton={props.hideViewProfileButton}
          id={props.id}
          debug={props.debug}
          name={name}
          isCreatePage={false}
        >
          {props.children}
        </LinkedInBadgeSelfRender>
      )}
    </>
  );
}
