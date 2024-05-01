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
 */
export type LinkedInBadgeProps = {
  locale: string;
  size: "medium" | "large";
  theme: "light" | "dark";
  type: "VERTICAL" | "HORIZONTAL";
  vanity: string;
  version: "v1" | "v2";
  className: string;
  style: React.CSSProperties;
  id: string;
  script_src: string;
  name: string;
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
  const vanity = props.vanity || "☯liu";
  const version = props.version || "v1";
  const vanityEncoded = encodeURIComponent(vanity);
  const name = props.name || "";
  const url = `https://www.linkedin.com/in/${vanityEncoded}?trk=profile-badge`;
  const refForDivBadge = React.useRef<HTMLDivElement>(null);
  const [componentDidMount, setComponentDidMount] =
    React.useState<boolean>(false);
  const [badgeDidRender, setBadgeDidRender] = React.useState<boolean>(false);

  React.useEffect(() => {
    // check if div is rendered via ref
    if (!componentDidMount) {
      if (refForDivBadge.current) {
        console.info("div rendered");
        setComponentDidMount(true);
      } else {
        console.info("div not rendered yet");
      }
    }
  }, [componentDidMount, refForDivBadge]);

  return (
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
    >
      <a className="badge-base__link LI-simple-link" href={url}>
        {name}{" "}
        <LIRenderAll
          {...props}
          badges={refForDivBadge.current ? [refForDivBadge.current] : undefined}
          badgeDidRender={badgeDidRender}
          setBadgeDidRender={setBadgeDidRender}
        />
      </a>
    </div>
  );
}
