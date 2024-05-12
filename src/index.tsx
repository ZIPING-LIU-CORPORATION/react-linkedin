import React from "react";
import LIRenderAll from "./LIRenderAll";
 
/**
 * LinkedInBadge component props used by LinkedInBadge component to render the LinkedIn badge
 * @param locale: string - The locale of the badge
 * @param size: "medium" | "large" - The size of the badge, but type also affects the size of the badge
 * @param id: string - The id of the badge, this is only required if you are going to have multiple badges on the same page, hence if thats the case make sure each badge has a unique id or else only one might load
 * @param vanity: string - The part of your LinkedIn profile URL that comes after `linkedin.com/in/`, e.g. for `linkedin.com/in/ziping-liu-1932a029a/` the vanity is `ziping-liu-1932a029a`
 * @param type: "VERTICAL" | "HORIZONTAL" - This actually adjusts the size of the badge, where VERTICAL is smaller than HORIZONTAL, so by setting  size to "medium" and type to "VERTICAL" you get a smaller badge than setting size to "medium" and type to "HORIZONTAL", and so on.
 * @param script_src: string - source url for the linkedin badge script, this is optional and only needed if you want to use a different script other than the one used in LinkedIn's badge documentation `(https://platform.linkedin.com/badges/js/profile.js)`
 * @param name: string - The name to display on the badge, this is optional and only needed if you want to display your name or some string of text that will either be show above or below your badge as a clickable link. If let empty, nothing well be shown.
 * @param debug: boolean - If true, the badge will be rendered in debug mode, console logs will be seen at key points throughout the badge's rendering process within react's lifecycle methods.
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
  id: string;
  script_src: string;
  useLinkedInApiUrlPure: boolean;
  name: string;
  debug: boolean;
};

/**
 * React component that renders a LinkedIn badge on a website.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.locale="en_US"] - The locale to use for the badge.
 * @param {("medium"|"large")} [props.size="medium"] - The size of the badge.
 * @param {("light"|"dark")} [props.theme="light"] - The theme of the badge.
 * @param {("VERTICAL"|"HORIZONTAL")} [props.type="VERTICAL"] - The orientation of the badge.
 * @param {string} [props.vanity="☯liu"] - The vanity name or URL to display on the badge.
 * @param {("v1"|"v2")} [props.version="v1"] - The version of the badge to use.
 * @param {string} [props.className] - Additional CSS classes to apply to the badge container.
 * @param {React.CSSProperties} [props.style] - Inline styles to apply to the badge container.
 * @param {string} [props.id] - The ID to assign to the badge container.
 * @param {string} [props.script_src] - The URL of an external script to include for the badge.
 * @param {string} [props.name] - The name to display on the badge.
 * @param {string} {props.entity} - The entity to display on the badge.
 * @param {useLinkedInApiUrlPure} [props.useLinkedInApiUrlPure] - Defaults as false, if set true, when call LinkedIn's badge API, the API request won't be proxied through Ziping Liu's server. The proxied request is used to remove security issues that some browsers may have due to the returned content of LinkedIn's API having certain headers that the browser regards as possibly harmful (although in this case its a red herring given badge content from LinkedIn does not contain malicious content or content that may be inappropriately used to harm the user's computer).
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
        <LinkedInBadgeSelfRendered
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
        />
      )}
    </>
  );
}

const LinkedInBadgeSelfRendered = (props: {
  locale?: string;
  size?: "medium" | "large";
  theme?: "light" | "dark";
  entity?: "PROFILE" | "COMPANY" | "GROUP";
  type?: "VERTICAL" | "HORIZONTAL";
  vanity?: string;
  version?: "v1" | "v2";
  className?: string;
  style?: React.CSSProperties;
  uid?: string;
  id?: string;
  TRACKING_PARAM?: string;
  isCreatePage?: boolean;
  name?: string;
  debug?: boolean;
}) => {
  const [profileData, setProfileData] = React.useState<{
    profileImageSrc: string;
    profileName: string;
    profileHeadline: string;
    profileCompanyOrSchool: {
      text: string;
      href: string;
    }[];
    profileNameLink: string;
    profileViewLink: string;
    profileCompanySchoolLink: string;
  } | null>(null);

  React.useEffect(() => {
    const { locale, size, theme, type, vanity, version, isCreatePage, entity } =
      props;
    const captureUnicodeEscapes = (input: string): RegExpMatchArray | null => {
      const unicodeEscapeRegex = /((\\u[\dA-Fa-f]{4}){2,})/g;
      return unicodeEscapeRegex.exec(input);
    };
    const TRACKING_PARAM = props.TRACKING_PARAM || "public-profile-badge";
    const uid = `${Math.round(1000000 * Math.random())}`;
    const baseUrl = "https://ziping.liu.academy/api/v2/linkedin/profile/";

    const payloadBodyParams: {
      [key: string]: string | string[];
    } = {
      badgetype: encodeURIComponent(type || "VERTICAL"),
      badgetheme: encodeURIComponent(theme || "light"),
      locale: locale || "en_US",
      uid: encodeURIComponent(uid),
      version: encodeURIComponent(version || "v1"),
    };

    if (version === "v2") {
      payloadBodyParams.badgesize = size || "medium";
      payloadBodyParams.entity = entity || "PROFILE";
    } else {
      payloadBodyParams.maxsize = encodeURIComponent(size || "medium");
      payloadBodyParams.trk = TRACKING_PARAM;
      payloadBodyParams.vanityname = encodeURIComponent(vanity || "☯liu");
    }

    if (isCreatePage) {
      payloadBodyParams.fromCreate = "true";
    }

    const xmlnew = new XMLHttpRequest();

    xmlnew.open("POST", baseUrl, true);
    xmlnew.setRequestHeader("Content-Type", "application/json");
    xmlnew.onreadystatechange = function () {
      if (xmlnew.readyState === 4 && xmlnew.status === 200) {
        const data = JSON.parse(xmlnew.responseText);
        const headlineText = data.profileHeadline;
        const captured = captureUnicodeEscapes(headlineText);

        if (captured) {
          const capturedPart = captured[1];
          const capturedPartJson = JSON.parse(`"${capturedPart}"`);
          data.profileHeadline = headlineText.replace(
            capturedPart,
            capturedPartJson,
          );
        }

        setProfileData(data);
      }
    };

    if (profileData === null) {
      xmlnew.send(JSON.stringify(payloadBodyParams));
    }
  }, [
    props.locale,
    props.size,
    props.theme,
    props.type,
    props.vanity,
    props.version,
    props.isCreatePage,
    props.entity,
    profileData,
  ]);

  const widthSet = React.useMemo(() => {
    return props.size === "medium" && props.type === "VERTICAL"
      ? "250"
      : props.size === "medium" && props.type === "HORIZONTAL"
        ? "280"
        : props.size === "large" && props.type === "VERTICAL"
          ? "300"
          : props.size === "large" && props.type === "HORIZONTAL"
            ? "330"
            : "250";
  }, [props.size, props.type]);

  return (
    <div style={props.style} className="profile-badge-reacted">
      <div
        className={
          `profile-badge profile-badge--width-${widthSet} ` +
          `profile-badge--${props.theme === "light" ? "light" : "dark"}`
        }
        lang="en"
        dir="ltr"
      >
        <div
          className={
            `profile-badge__header ` +
            `profile-badge__header--${props.theme === "light" ? "light" : "dark"}`
          }
        >
          <span className="sr-only">LinkedIn</span>
          <LinkedInIcon theme={props.theme} />
        </div>
        <div className="profile-badge__content">
          {profileData?.profileImageSrc && (
            <img
              className={
                `artdeco-entity-image ` +
                `artdeco-entity-image--circle-4 ` +
                `profile-badge__content-profile-image`
              }
              title={profileData?.profileName}
              alt={profileData?.profileName}
              src={profileData?.profileImageSrc}
            />
          )}
          <h3 className="profile-badge__content-profile-name" itemProp="name">
            {profileData?.profileName && (
              <a
                className={
                  `profile-badge__content-profile-name-link ` +
                  `profile-badge__content-profile-name-link--${props.theme === "light" ? "light" : "dark"}`
                }
                href={
                  profileData?.profileNameLink ||
                  "https://www.linkedin.com/in/%E2%98%AFliu?trk=public-profile-badge-profile-badge-profile-name"
                }
                data-tracking-control-name="public-profile-badge-profile-badge-profile-name"
                data-tracking-will-navigate=""
              >
                {profileData?.profileName && <>{profileData?.profileName}</>}
              </a>
            )}
          </h3>
          <h4 className="profile-badge__content-profile-headline">
            {profileData?.profileHeadline && (
              <>{profileData?.profileHeadline}</>
            )}
          </h4>
          <h4 className="profile-badge__content-profile-company-school-info">
            {profileData?.profileCompanyOrSchool &&
              Array.isArray(profileData?.profileCompanyOrSchool) &&
              profileData?.profileCompanyOrSchool.map(
                (companyOrSchool, index) => {
                  return (
                    <>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        href={companyOrSchool.href}
                        className={
                          `profile-badge__content-profile-company-school-info-link ` +
                          `profile-badge__content-profile-company-school-info-link--${props.theme === "light" ? "light" : "dark"}`
                        }
                        data-tracking-control-name="public-profile-badge-profile-badge_school-name"
                        data-tracking-will-navigate="true"
                      >
                        {companyOrSchool.text}
                      </a>{" "}
                      {index !== profileData?.profileCompanyOrSchool.length - 1
                        ? " | "
                        : ""}{" "}
                    </>
                  );
                },
              )}
          </h4>
        </div>
        <a
          className={
            `profile-badge__cta-btn ` +
            `profile-badge__cta-btn--${props.theme === "light" ? "light" : "dark"}`
          }
          rel="noopener noreferrer"
          href={
            profileData?.profileViewLink ||
            `https://www.linkedin.com/in/${encodeURIComponent(props.vanity || "☯liu")}?trk=public-profile-badge-profile-badge-profile-cta`
          }
          target="_blank"
          data-tracking-control-name="public-profile-badge-profile-badge-view-profile-cta"
          data-tracking-will-navigate=""
        >
          View profile
        </a>
        {profileData === null && (
          <a
            className="badge-base__link LI-simple-link"
            target="_blank"
            rel="noopener noreferrer"
            href={`${
              props.vanity
                ? `https://www.linkedin.com/in/${props.vanity}?trk=profile-badge`
                : "https://www.linkedin.com/in/%E2%98%AFliu?trk=public-profile-badge-profile-badge-profile-name"
            }`}
          >
            {props.name || ""}
          </a>
        )}
      </div>
    </div>
  );
};

const LinkedInIcon = ({
  theme = "light",
  style,
}: {
  theme?: "light" | "dark";
  style?: React.CSSProperties;
}) => {
  return (
    <i
      style={style}
      className={
        `profile-badge__header-logo-icon ` +
        `profile-badge__header-logo-icon--${
          theme === "light" ? "light" : "dark"
        }`
      }
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 84 21"
        preserveAspectRatio="xMinYMin meet"
        version="1.1"
        focusable="false"
      >
        <g
          className="inbug"
          stroke="none"
          strokeWidth={1}
          fill="none"
          fillRule="evenodd"
        >
          <path
            d="M19.479,0 L1.583,0 C0.727,0 0,0.677 0,1.511 L0,19.488 C0,20.323 0.477,21 1.333,21 L19.229,21 C20.086,21 21,20.323 21,19.488 L21,1.511 C21,0.677 20.336,0 19.479,0"
            className="bug-text-color"
            transform="translate(63.000000, 0.000000)"
          />
          <path
            d="M82.479,0 L64.583,0 C63.727,0 63,0.677 63,1.511 L63,19.488 C63,20.323 63.477,21 64.333,21 L82.229,21 C83.086,21 84,20.323 84,19.488 L84,1.511 C84,0.677 83.336,0 82.479,0 Z M71,8 L73.827,8 L73.827,9.441 L73.858,9.441 C74.289,8.664 75.562,7.875 77.136,7.875 C80.157,7.875 81,9.479 81,12.45 L81,18 L78,18 L78,12.997 C78,11.667 77.469,10.5 76.227,10.5 C74.719,10.5 74,11.521 74,13.197 L74,18 L71,18 L71,8 Z M66,18 L69,18 L69,8 L66,8 L66,18 Z M69.375,4.5 C69.375,5.536 68.536,6.375 67.5,6.375 C66.464,6.375 65.625,5.536 65.625,4.5 C65.625,3.464 66.464,2.625 67.5,2.625 C68.536,2.625 69.375,3.464 69.375,4.5 Z"
            className="background"
            fill="currentColor"
          />
        </g>
        <g className="linkedin-text">
          <path
            d="M60,18 L57.2,18 L57.2,16.809 L57.17,16.809 C56.547,17.531 55.465,18.125 53.631,18.125 C51.131,18.125 48.978,16.244 48.978,13.011 C48.978,9.931 51.1,7.875 53.725,7.875 C55.35,7.875 56.359,8.453 56.97,9.191 L57,9.191 L57,3 L60,3 L60,18 Z M54.479,10.125 C52.764,10.125 51.8,11.348 51.8,12.974 C51.8,14.601 52.764,15.875 54.479,15.875 C56.196,15.875 57.2,14.634 57.2,12.974 C57.2,11.268 56.196,10.125 54.479,10.125 L54.479,10.125 Z"
            fill="currentColor"
          />
          <path
            d="M47.6611,16.3889 C46.9531,17.3059 45.4951,18.1249 43.1411,18.1249 C40.0001,18.1249 38.0001,16.0459 38.0001,12.7779 C38.0001,9.8749 39.8121,7.8749 43.2291,7.8749 C46.1801,7.8749 48.0001,9.8129 48.0001,13.2219 C48.0001,13.5629 47.9451,13.8999 47.9451,13.8999 L40.8311,13.8999 L40.8481,14.2089 C41.0451,15.0709 41.6961,16.1249 43.1901,16.1249 C44.4941,16.1249 45.3881,15.4239 45.7921,14.8749 L47.6611,16.3889 Z M45.1131,11.9999 C45.1331,10.9449 44.3591,9.8749 43.1391,9.8749 C41.6871,9.8749 40.9121,11.0089 40.8311,11.9999 L45.1131,11.9999 Z"
            fill="currentColor"
          />
          <polygon
            fill="currentColor"
            points="38 8 34.5 8 31 12 31 3 28 3 28 18 31 18 31 13 34.699 18 38.241 18 34 12.533"
          />
          <path
            d="M16,8 L18.827,8 L18.827,9.441 L18.858,9.441 C19.289,8.664 20.562,7.875 22.136,7.875 C25.157,7.875 26,9.792 26,12.45 L26,18 L23,18 L23,12.997 C23,11.525 22.469,10.5 21.227,10.5 C19.719,10.5 19,11.694 19,13.197 L19,18 L16,18 L16,8 Z"
            fill="currentColor"
          />
          <path
            d="M11,18 L14,18 L14,8 L11,8 L11,18 Z M12.501,6.3 C13.495,6.3 14.3,5.494 14.3,4.5 C14.3,3.506 13.495,2.7 12.501,2.7 C11.508,2.7 10.7,3.506 10.7,4.5 C10.7,5.494 11.508,6.3 12.501,6.3 Z"
            fill="currentColor"
          />
          <polygon fill="currentColor" points="3 3 0 3 0 18 9 18 9 15 3 15" />
        </g>
      </svg>
    </i>
  );
};
