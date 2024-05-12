import React from "react";
import LIRenderAll from "./LIRenderAll";
import LinkedInBadgeSelfRender from "./LinkedInBadgeSelfRender";
 
/**
 * LinkedInBadge component props used by LinkedInBadge component to render the LinkedIn badge
 * @member locale: string - The locale to use for the badge, this is optional and only needed if you want to change the locale of the badge, by default it is set to "en_US"
 * @member size: "medium" | "large" - The size of the badge, this is optional and only needed if you want to change the size of the badge, by default it is set to "medium"
 * @member id: string - The id of the badge, this is only required if you are going to have multiple badges on the same page, hence if thats the case make sure each badge has a unique id or else only one might load
 * @member vanity: string - The part of your LinkedIn profile URL that comes after `linkedin.com/in/`, e.g. for `linkedin.com/in/ziping-liu-1932a029a/` the vanity is `ziping-liu-1932a029a`
 * @member type: "VERTICAL" | "HORIZONTAL" - This actually adjusts the size of the badge, where VERTICAL is smaller than HORIZONTAL, so by setting  size to "medium" and type to "VERTICAL" you get a smaller badge than setting size to "medium" and type to "HORIZONTAL", and so on.
 * @member script_src: string - source url for the linkedin badge script, this is optional and only needed if you want to use a different script other than the one used in LinkedIn's badge documentation `(https://platform.linkedin.com/badges/js/profile.js)`
 * @member name: string - The name to display on the badge, this is optional and only needed if you want to display your name or some string of text that will either be show above or below your badge as a clickable link. If let empty, nothing well be shown.
 * @member debug: boolean - If true, the badge will be rendered in debug mode, console logs will be seen at key points throughout the badge's rendering process within react's lifecycle methods.
 */
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
 * @param {string} [locale="en_US"] - The locale to use for the badge.
 * @param {("medium"|"large")} [size="medium"] - The size of the badge. By default, the badge is set to medium.
 * @param {("light"|"dark")} [theme="light"] - The theme of the badge. By default, the badge is set to light.
 * @param {("VERTICAL"|"HORIZONTAL")} [props.type="VERTICAL"] - The orientation of the badge. By default, the badge is set to VERTICAL.
 * @param {string} [vanity="☯liu"] - The vanity name or URL to display on the badge.
 * @param {("v1"|"v2")} [version="v1"] - The version of the badge to use. Uses v1 by default.
 * @param {string} [className] - Additional CSS classes to apply to the badge container.
 * @param {React.CSSProperties} [style] - Inline styles to apply to the badge container.
 * @param {string} [id] - The ID to assign to the badge container.
 * @param {string} [script_src] - The URL of an external script to include for the badge.
 * @param {string} [name] - The name to display on the badge.
 * @param {string} [entity] - The entity type of the badge, defaults to "PROFILE".
 * @param {useLinkedInApiUrlPure} [useLinkedInApiUrlPure] - Defaults as false, if set true, when call LinkedIn's badge API, the API request won't be proxied through a Ziping.org Web Services (ZWS) web server. The proxied request is used to remove security issues that some browsers may have due to the returned content of LinkedIn's API having certain headers that the browser regards as possibly harmful (although in this case its a red herring given badge content from LinkedIn does not contain malicious content or content that may be inappropriately used to harm the user's computer).
 * @param {boolean} [generateUidWithoutApi] - Defaults as false, if true, uid creation won't include utilizing an API call to form a more unique uid.
 * @returns {React.ReactElement} The rendered LinkedIn badge component.
 * @description This implementation uses two React components - LinkedInBadge and LIRenderAll.
 * LinkedInBadge is the parent component responsible for
 * rendering the container and basic structure of the LinkedIn badge,
 * while LIRenderAll is a child component that handles
 * the rendering and management of the actual badge content.
 * @argument The reason for this separation is that the badge content needs to be loaded asynchronously from a server, and the LIRenderAll component is responsible for making the necessary requests and handling the responses. By separating the concerns, the parent component can render the initial structure, and the child component can take care of the dynamic badge content.
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




