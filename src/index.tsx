

import React from 'react';
 
/**
 * LinkedInBadge component props used by LinkedInBadge component to render the LinkedIn badge
 * @param locale: string - The locale of the badge
 * @param size: "medium" | "large" - The size of the badge, but type also affects the size of the badge
 * @param id: string - The id of the badge, this is only required if you are going to have multiple badges on the same page, hence if thats the case make sure each badge has a unique id or else only one might load
 * @param vanity: string - The part of your LinkedIn profile URL that comes after `linkedin.com/in/`, e.g. for `linkedin.com/in/ziping-liu-1932a029a/` the vanity is `ziping-liu-1932a029a`
 * @param type: "VERTICAL" | "HORIZONTAL" - This actually adjusts the size of the badge, where VERTICAL is smaller than HORIZONTAL, so by setting  size to "medium" and type to "VERTICAL" you get a smaller badge than setting size to "medium" and type to "HORIZONTAL", and so on.
 */
export type LinkedInBadgeProps = {

  locale: string,
  size:  "medium" | "large",
  theme: "light" | "dark",
  type: "VERTICAL" | "HORIZONTAL",
  vanity: string,
  version: "v1" | "v2"
  className: string,
  style: React.CSSProperties,
  id: string,
}

export default function LinkedInBadge(props: Partial<LinkedInBadgeProps>) {
  const locale = props.locale || "en_US";
  const size = props.size || "medium";
  const theme = props.theme || "light";
  const type = props.type || "VERTICAL";
  const vanity = props.vanity || "☯liu";
  const version = props.version || "v1";
  const vanityEncoded = encodeURIComponent(vanity);

  const url = `https://www.linkedin.com/in/${vanityEncoded}?trk=profile-badge`;

  const [componentDidMount, setComponentDidMount] = React.useState(false);
  React.useEffect(() => {
    // append the linkedin badge script to the body if it hasn't been appended yet
    if (!componentDidMount) {
      // first check if the script has already been added by id
      const id = props.id || "linkedin-badge-script";
      if (!document.getElementById(id)) {
        const script = document.createElement("script");
        script.id = id;
        script.src = "https://platform.linkedin.com/badges/js/profile.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        setComponentDidMount(true);
      } else {
         // re-render the script by removing and re-adding it
         const script = document.getElementById(id);
         script?.remove();
         const newScript = document.createElement("script");
         newScript.id = id;
         newScript.src = "https://platform.linkedin.com/badges/js/profile.js";
         newScript.async = true;
         newScript.defer = true;
         document.body.appendChild(newScript);
         setComponentDidMount(true);
      }
    }
  }, [componentDidMount, props.id]);

  return(<div
    className={"badge-base LI-profile-badge" + (props.className ? " " + props.className : "")}
    style={props.style}
    id={props.id}
    data-locale={locale}
    data-size={size}
    data-theme={theme}
    data-type={type}
    data-vanity={vanity}
    data-version={version}
  >
    <a
      className="badge-base__link LI-simple-link"
      href={url}
    >
      Ziping Liu
    </a>
  </div>
  )
}
