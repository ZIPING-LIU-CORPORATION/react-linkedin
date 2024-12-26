import React, { FC } from "react";
import LinkedInBadgeSelfRender from "./LinkedInBadgeSelfRender";
import LIRender from "./LIRender";
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
 * @param {useLinkedInApiUrlPure} [useLinkedInApiUrlPure] - Defaults as `false`, if set `true`, profile badges are rendered fully through LinkedIn's badge rendering method and only through LinkedIn's API endpoints. If set to `true`, note that there may be issues surfaced inherent in LinkedIn's implementation of profile badges.
 * @param {boolean} [generateUidWithoutApi] - Defaults as `false`, if `true`, uid creation won't include utilizing an API call to form a more unique uid.
 * @param {ReactNode} [children] - The children to render within the badge container, only supported when useLinkedInApiUrlPure is set to `false`, hence when rendering the badge within the component itself and without the LinkedIn's badge rendering API's callback injection with iframe method.
 * @param {cleanUp} [noClean] - Defaults as `false` and is only used when `useLinkedInApiUrlPure` is set to `true`, if set to `true`, the callback function used by the server-side rendering will be cleaned up and deleted after rendering the profile badge.
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
  /**
   * The locale to use for the badge. Defaults to `"en_US"`.
   */
  locale: string;
  /**
   * The size of the badge. By default, the badge is set to `"medium"`.
   */
  size: "medium" | "large";
  /**
   * The theme of the badge. By default, the badge is set to `"light"`.
   */
  theme: "light" | "dark";
  /**
   * The orientation of the badge. By default, the badge is set to `"VERTICAL"`.
   */
  type: "VERTICAL" | "HORIZONTAL";
  /**
   * The entity type of the badge, defaults to `"PROFILE"`. At this time only "PROFILE" is supported.
   */
  entity: "PROFILE" | "COMPANY" | "GROUP";
  /**
   * The vanity name or URL to display on the badge. (vanity name is the part of the LinkedIn profile URL that comes after the `/in/` or `/company/` or `/group/` part)
   */
  vanity: string;
  /**
   * The version of the badge to use. Uses `"v1"` by default. At this time only "v1" is supported. v2 has never been tested or known to work.
   */
  version: "v1" | "v2";
  /**
   * Optional, an addtional class name to add to the badge container that is the most outer container of the badge.
   */
  className: string;
  /**
   * Optional, inline styles to apply to the badge container.
   */
  style: React.CSSProperties;
  /**
   * Optional, additional components that are rendered after the badge container.
   */
  children: React.ReactNode;
  /**
   * Optional, defaults to `false`, if true, saves and uses localStorage for badge data for faster rendering and caches the data for 24 hours.
   */
  noCache: boolean;
  /**
   * Optional, an element ID to assign to the badge container.
   */
  id: string;
  /**
   * Optional, the script that is used to render the badge. This is only used when `useLinkedInApiUrlPure` is set to `true`, which uses linkedin's rendering method.
   */
  script_src: string;
  /**
   * Optional, the name to display on the badge.
   */
  name: string;
  /**
   * Provides console logs if set to `true`.
   */
  debug: boolean;
  /**
   * Defaults as `false`, if set `true`, the view profile button will be hidden that is displayed as part of the badge's content as a button that when clicked opens the LinkedIn profile page in a new tab.
   */
  hideViewProfileButton: boolean;
  /**
   * Defaults as `false`, if set `true`, uid creation won't include utilizing an API call to form a more unique uid.
   */
  generateUidWithoutApi: boolean;
  /**
   * Defaults as `false`, if set `true`, profile badges are rendered fully through LinkedIn's badge rendering method and only through LinkedIn's API endpoints. If set to `true`, note that there may be issues surfaced inherent in LinkedIn's implementation of profile badges.
   */
  useLinkedInApiUrlPure: boolean;
  /**
   * Defaults as `false` and is only used when `useLinkedInApiUrlPure` is set to `true`, if set to `true`, the callback function used by the server-side rendering will be cleaned up and deleted after rendering the profile badge.
   */
  cleanUp: boolean;
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
const LinkedInBadge: FC<Partial<LinkedInBadgeProps>> = (props) => {
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
  const [componentDidMount, setComponentDidMount] =
    React.useState<boolean>(false);
 
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
      if (componentDidMount === false) {
        setComponentDidMount(true);
      }
    }
  }, [componentDidMount, props.debug]);

 

  return useLinkedInApiUrlPure === true ? (
    <div
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
      data-rendered="false"
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
      {componentDidMount && (
        <LIRender
          vanity={vanity}
          locale={locale}
          size={size}
          theme={theme}
          type={type}
          entity={entity}
          version={version}
          isCreatePage={false}
          debug={props.debug}
          cleanUp={props.cleanUp}
        />
      )}
    </div>
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
  );
}

export default LinkedInBadge;