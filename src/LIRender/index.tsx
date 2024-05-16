import React, { useEffect } from "react";
const LIRender = ({
  CALLBACK_NAME = "LIBadgeCallback",
  BADGE_NAMES = ".LI-profile-badge, .LI-entity-badge",
  TRACKING_PARAM = "profile-badge",
  size = "medium",
  locale = "en_US",
  type = "vertical",
  theme = "light",
  vanity = "ziping-liu-1932a029a",
  version = "v2",
  entity = "profile",
  isEI = false,
  isCreatePage = false,
  debug = true,
  cleanUp = false,
}: {
  CALLBACK_NAME?: string;
  BADGE_NAMES?: string;
  TRACKING_PARAM?: string;
  size?: string;
  locale?: string;
  type?: string;
  theme?: string;
  vanity?: string;
  version?: string;
  entity?: string;
  isEI?: boolean;
  cleanUp?: boolean;
  isCreatePage?: boolean;
  debug?: boolean;
}) => {
  function createDataAttributesQuerySelector(
    dataAttributes: { [key: string]: string }[],
  ): string {
    return dataAttributes
      .map((attr) => {
        return Object.entries(attr)
          .map(([key, value]) => {
            return `[data-${key}="${value}"]`;
          })
          .join("");
      })
      .join("");
  }
  const badgeQuerySelector = createDataAttributesQuerySelector([
    {
      type,
    },
    {
      theme,
    },
    {
      size,
    },
    {
      locale,
    },
    {
      version,
    },
    {
      entity,
    },
    {
      vanity,
    },
  ]);

  const fulbadgequery = `${BADGE_NAMES}${badgeQuerySelector}`;
  // badge needs to be unique to this instance of the component, so use a ref and set it in the useEffect

  const badge = document.querySelector(fulbadgequery);
  const badgeRef = React.useRef(badge);

  React.useEffect(() => {
    badgeRef.current = badge;
  }, [badge]);

  // this need to be done so check if ref to badge has changed
  useEffect(() => {
    let expectedResponses = 0;
    let responsesReceived = 0;
    const scripts: HTMLScriptElement[] = [];
    const childScripts: Record<string | number, boolean | any> = {};
    //

    if (debug) {
      console.info(
        "%cLIRender:",
        "background: #0077b5; color: #fff; padding: 5px; border-radius: 5px; font-weight: bold; font-size: 14px;",

        `Using query selector: ${fulbadgequery} to find badge element for badge with type: ${type}, theme: ${theme}, size: ${size}, locale: ${locale}, version: ${version}, entity: ${entity}`,
      );
    }

    const jsonp = (url: string) => {
      const script = document.createElement("script");
      script.src = url;
      scripts.push(script);
      document.body.appendChild(script);
    };

    const shouldReplaceNode = (node: any, isCreate: boolean) => {
      return (
        isScriptNode(node) &&
        !childScripts[node.src] &&
        (!isCreate || (isCreate && !node.getAttribute("data-isartdeco")))
      );
    };

    const replaceScriptTags = (node: any, isCreate: boolean) => {
      if (shouldReplaceNode(node, isCreate)) {
        if (node.parentNode && node.parentNode.replaceChild) {
          node.parentNode.replaceChild(cloneScriptNode(node), node);
        }
        childScripts[node.src] = true;
      } else {
        const childrenArrayNodes = Array.from(node.childNodes);
        for (let i = 0; i < childrenArrayNodes.length; i++) {
          replaceScriptTags(childrenArrayNodes[i], isCreate);
        }
      }
    };

    const isScriptNode = (node: HTMLElement) => {
      return node.tagName === "SCRIPT";
    };

    const cloneScriptNode = (node: HTMLScriptElement) => {
      const script = document.createElement("script");
      const attributesArray = Array.from(node.attributes) as Array<Attr>;
      for (const attribute of attributesArray) {
        script.setAttribute(attribute.name, attribute.value);
      }
      return script;
    };

    const isCNDomain = () => {
      if (typeof window !== "undefined") {
        const hostName = window.location?.hostname || "";
        return /linkedin(-ei)?.cn$/.test(hostName);
      }
      return false;
    };

    const generateUrl = (isEI = false) => {
      const domainPrefix = isEI
        ? "https://badges.linkedin-ei"
        : "https://badges.linkedin";
      return isCNDomain() ? domainPrefix + ".cn/" : domainPrefix + ".com/";
    };

    const getBadgeKeyQueryParams = (badge: HTMLElement) => {
      return Array.from(badge.attributes)
        .filter((attr) => attr.name.startsWith("data-key-"))
        .map(
          (attr) =>
            encodeURIComponent(attr.name.replace("data-", "").toLowerCase()) +
            "=" +
            encodeURIComponent(attr.value),
        );
    };

    const renderBadge = (
      badge: HTMLElement,
      size = "medium",
      locale = "en_US",
      type = "vertical",
      theme = "light",
      vanity = "ziping-liu-1932a029a",
      version = "v2",
      entity = "profile",
      isEI = false,
      isCreatePage = false,
      TRACKING_PARAM = "profile-badge",
      cleanUp = false,
    ) => {
      const stringToHash = (str: string) => {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        return hash;
      };

      const uid =
        new Date().getTime() +
        stringToHash(locale) +
        stringToHash(type) +
        stringToHash(theme) +
        stringToHash(vanity) +
        stringToHash(version) +
        stringToHash(entity) +
        stringToHash(isEI ? "ei" : "") +
        stringToHash(isCreatePage ? "create" : "") +
        stringToHash(size);

      let baseUrl = generateUrl(isEI);
      let queryParams = [
        "locale=" + encodeURIComponent(locale),
        "badgetype=" + encodeURIComponent(type),
        "badgetheme=" + encodeURIComponent(theme),
        "uid=" + encodeURIComponent(uid),
        "version=" + encodeURIComponent(version),
      ];

      if (version === "v2") {
        baseUrl += "view";
        queryParams.push("badgesize=" + encodeURIComponent(size));
        queryParams.push("entity=" + encodeURIComponent(entity));
        queryParams = queryParams.concat(getBadgeKeyQueryParams(badge));
      } else {
        baseUrl += "profile";
        queryParams.push("maxsize=" + encodeURIComponent(size));
        queryParams.push("trk=" + encodeURIComponent(TRACKING_PARAM));
        queryParams.push("vanityname=" + encodeURIComponent(vanity));
      }

      if (isCreatePage) {
        queryParams.push("fromCreate=true");
      }

      const url = baseUrl + "?" + queryParams.join("&");
      badge.setAttribute("data-uid", String(uid));
      jsonp(url);
    };

    if (badge) {
      expectedResponses++;
      badge.setAttribute("data-rendered", "true");
      renderBadge(
        badge as HTMLElement,
        size,
        locale,
        type,
        theme,
        vanity,
        version,
        entity,
        isEI,
        isCreatePage,

        TRACKING_PARAM,
        cleanUp,
      );
    }

    const responseHandler = (badgeHtml: string) => {
      responsesReceived++;
      const defaultWidth = 330;
      const defaultHeight = 300;

      const badgeMarkup = `<body>${badgeHtml}</body>`;
      const iframe = document.createElement("iframe");
      iframe.onload = function () {
        if (iframe.contentWindow) {
          const iframeBody = iframe.contentWindow.document.body;
          iframe.setAttribute(
            "height",
            `${(iframeBody.scrollHeight || defaultHeight) + 5}`,
          );
          iframe.setAttribute(
            "width",
            `${(iframeBody.scrollWidth || defaultWidth) + 5}`,
          );
        }
      };
      iframe.setAttribute("frameBorder", "0");
      iframe.style.display = "block";
      badge!.appendChild(iframe);
      if (iframe.contentWindow) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(badgeMarkup);
        iframe.contentWindow.document.close();
      }
      replaceScriptTags(badge, isCreatePage);
      // appending badge
      if (debug) {
        console.info(
          "%cresponseHandler - LIRenderAll:",
          "background: #0077b5; color: #fff; padding: 5px; border-radius: 5px; font-weight: bold; font-size: 14px;",
          `appending badge to iframe: ${badgeMarkup}, badge: ${badge?.getAttribute("data-vanity")}, badge:\n`,
          badge,
        );
      }
      tryClean();
    };

    (window as any)[CALLBACK_NAME] = responseHandler;

    const tryClean = () => {
      if (debug) {
        console.info(
          "%cLIRender:",
          "background: #0077b5; color: #fff; padding: 5px; border-radius: 5px; font-weight: bold; font-size: 14px;",
          `at tryClean: expectedResponses: ${expectedResponses}, responsesReceived: ${responsesReceived}`,
        );
      }
      if (
        cleanUp &&
        expectedResponses > 0 &&
        (responsesReceived >= expectedResponses || responsesReceived >= 1)
      ) {
        if (debug) {
          console.info(
            "%cLIRender:",
            "background: #0077b5; color: #fff; padding: 5px; border-radius: 5px; font-weight: bold; font-size: 14px;",
            `cleaning up due to responses check passed, expectedResponses > 0 && (responsesReceived >= expectedResponses || responsesReceived >= 1)`,
          );
        }
        delete (window as any)[CALLBACK_NAME];
        scripts.forEach((script) => document.body.removeChild(script));
      } else {
        if (debug) {
          console.info(
            "%cLIRender:",
            "background: #0077b5; color: #fff; padding: 5px; border-radius: 5px; font-weight: bold; font-size: 14px;",
            `not cleaning up due to responses check failed, expectedResponses > 0 && (responsesReceived >= expectedResponses || responsesReceived >= 1), cleanUp = ${cleanUp}`,
          );
        }
      }
    };

    return () => {
      scripts.forEach((script) => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
      if ((window as any)[CALLBACK_NAME] === responseHandler) {
        delete (window as any)[CALLBACK_NAME];
      }
    };
  }, [
    CALLBACK_NAME,
    BADGE_NAMES,
    TRACKING_PARAM,
    size,
    locale,
    type,
    theme,
    vanity,
    version,
    entity,
    isEI,
    isCreatePage,
    debug,
    cleanUp,
    badgeQuerySelector,
    badgeRef.current,
    badge,
  ]);

  return (
    <iframe
      key={`${vanity}-${type}-${theme}-${size}-${locale}-${version}-${entity}-${isEI}-${isCreatePage}-${debug}-${cleanUp}`}
    ></iframe>
  );
};

export default LIRender;
