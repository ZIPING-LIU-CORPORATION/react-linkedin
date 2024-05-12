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
 * @param {useLinkedInApiUrlPure} [useLinkedInApiUrlPure] - Defaults as `false`, if set `true`, when call LinkedIn's badge API, the API request won't be proxied through a Ziping.org Web Services (ZWS) web server. The proxied request is used to remove security issues that some browsers may have due to the returned content of LinkedIn's API having certain headers that the browser regards as possibly harmful (although in this case its a red-herring given badge content from LinkedIn does not contain malicious content or content that may be inappropriately used to harm the user's computer).
 * @param {boolean} [generateUidWithoutApi] - Defaults as `false`, if `true`, uid creation won't include utilizing an API call to form a more unique uid.
 * @param {ReactNode} [children] - The children to render within the badge container, only supported when useLinkedInApiUrlPure is set to `false`, hence when rendering the badge within the component itself and without the LinkedIn's badge rendering API's callback injection with iframe method.
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
  id: string;
  script_src: string;
  useLinkedInApiUrlPure: boolean;
  name: string;
  debug: boolean;
  generateUidWithoutApi: boolean;
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
          version={version}
          className={props.className}
          generateUidWithoutApi={generateUidWithoutApi}
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
