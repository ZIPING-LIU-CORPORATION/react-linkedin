/**
 * Renders all LinkedIn badges on the page,
 * By default is called when document is at readyState 'complete'
 */
import React from "react";
import { LinkedInBadgeProps } from "../index";
type LIRenderAllProps = {
  scripts: HTMLScriptElement[];
  responsesReceived: number;
  expectedResponses: number;
  childScripts: { [x: number | string]: any };
  BADGE_NAMES: string;
  badges: Element[] | null;
  CALLBACK_NAME: string;
  trackingParam: string;
  setBadgeDidRender: (arg0: boolean) => void;
  badgeDidRender: boolean;
} & LinkedInBadgeProps;

/**
 * React child component responsible for rendering and managing the LinkedIn badge.
 *
 * @param {Object} props - Component props.
 * @param {HTMLScriptElement[]} [props.scripts=[]] - Array of script elements to include for the badge.
 * @param {number} [props.responsesReceived=0] - The number of responses received from the server.
 * @param {number} [props.expectedResponses=0] - The expected number of responses from the server.
 * @param {Object} [props.childScripts={}] - An object containing child script URLs as keys and their loaded states as values.
 * @param {string} [props.BADGE_NAMES=".LI-profile-badge, .LI-entity-badge"] - CSS selector for badge elements.
 * @param {string} [props.CALLBACK_NAME="LIBadgeCallback"] - The name of the callback function to handle server responses.
 * @param {Element[]|null} [props.badges=null] - Array of badge elements to render.
 * @param {string} [props.trackingParam="trk=profile-badge"] - The tracking parameter to include in the badge URL.
 * @param {Function} [props.setBadgeDidRender] - Callback function to set the badge rendering state.
 * @param {boolean} [props.badgeDidRender=false] - Flag indicating whether the badge has been rendered.
 * @returns {React.ReactElement} The rendered LinkedIn badge child component.
 * @abstract The LIRenderAll component uses various hooks and callbacks to manage the state and lifecycle of the badge rendering process. It keeps track of the number of expected and received responses from the server, handles the insertion of the badge content into the appropriate container, and manages the replacement of any script tags within the badge markup. As mentioned in the description for the LinkedInBadge React Custom Component, LIRenderAll is a child component that handles the rendering and management of the actual badge content.
 * @note The LinkedInBadge component, on the other hand, is responsible for rendering the container element with the appropriate props and attributes, as well as passing down the necessary props to the LIRenderAll child component. It also manages its own state related to component mounting and badge rendering. This separation of concerns allows for a more modular and maintainable codebase, where the responsibilities of rendering the badge container and managing the dynamic badge content are clearly separated.
 */
export const LIRenderAll = (props: Partial<LIRenderAllProps>) => {
  const [scripts, setScripts] = React.useState<HTMLScriptElement[]>(
    props.scripts || [],
  );
  const [componentDidUpdate, setComponentDidUpdate] = React.useState<boolean>(
    props.badgeDidRender || false,
  );
  const [responsesReceived, setResponsesReceived] = React.useState<number>(
    props.responsesReceived || 0,
  );
  const [expectedResponses, setExpectedResponses] = React.useState<number>(
    props.expectedResponses || 0,
  );
  const BADGE_NAMES =
    props.BADGE_NAMES || ".LI-profile-badge, .LI-entity-badge";
  const CALLBACK_NAME = props.CALLBACK_NAME || "LIBadgeCallback";
  const [badges, setBadges] = React.useState<Element[] | null>(
    props.badges || null,
  );

 
  const TRACKING_PARAM = props.trackingParam || "trk=profile-badge";
  const childScripts: LIRenderAllProps["childScripts"] = props.childScripts || {};


  const logDegug = (message: string, type: string, componentName: string) => {
    if (props.debug) {
      const currentTime = new Date().toLocaleTimeString();
      console.log(`[${currentTime}] ${type} - ${componentName}: ${message}`);
    }
  }

  




  /**
   * Handles a response from the server. Finds badge matching badgeUid and inserts badgeHtml there
   * @param badgeHtml: String representing contents of the badge
   * @param badgeUid: UID of the badge to target
   **/
  const responseHandler = React.useCallback(
    (badgeHtml: any, badgeUid: number) => {
      logDegug( `Response received for badgeUid: ${badgeUid}`, "info", "at responseHandler in LIRenderAll");

 
      setResponsesReceived(responsesReceived + 1);

      let uid, isCreate;
      var defaultWidth = 330; // max possible width
      var defaultHeight = 300; // max possible height

      for (const badge of badges || []) {
       
        logDegug( `Checking badge with uid: ${badge.getAttribute("data-uid")}`, "info", "at responseHandler in LIRenderAll");
        // isCreate needed to prevent reloading artdeco script tag
        isCreate = badge.getAttribute("data-iscreate");
        uid = parseInt(badge.getAttribute("data-uid") || "0", 10);
        if (uid === badgeUid) {
          var badgeMarkup = `<body>${badgeHtml}</body>`;
          const iframe = document.createElement("iframe");

          iframe.onload = function () {
            var iframeBody = iframe.contentWindow?.document.body;
            // 5 px buffer to avoid the badge border being cut off.
            iframe.setAttribute(
              "height",
              `${(iframeBody?.scrollHeight || defaultHeight) + 5}`,
            );
            iframe.setAttribute(
              "width",
              `${iframeBody?.scrollWidth || defaultWidth + 5}`,
            );
          };
   
          const replaceScriptTags = (badge: Element, isCreate: any) => {
            logDegug( `Replacing script tags for badge with uid: ${badge.getAttribute("data-uid")}`, "info", "at responseHandler in LIRenderAll");
            const scriptsFoundNow = badge.querySelectorAll("script");
            let i, len, script;
            for (i = 0, len = scriptsFoundNow.length; i < len; i++) {
              script = scriptsFoundNow[i];
              if (shouldReplaceNode(script, isCreate)) {
                var newScript = cloneScriptNode(script);
                badge.appendChild(newScript);
                badge.removeChild(script);
              }
            }
          };

          iframe.setAttribute("frameBorder", "0");
          iframe.style.display = "block";
          badge.appendChild(iframe);
          if (iframe.contentWindow) {
            logDegug( `Writing badge markup for badge with uid: ${badge.getAttribute("data-uid")}`, "info", "at responseHandler in LIRenderAll");
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(badgeMarkup);
            iframe.contentWindow.document.close();
          }
          replaceScriptTags(badge, isCreate);
        }
      }
      tryClean(
        responsesReceived,
        expectedResponses,
        badges,
        scripts,
        CALLBACK_NAME,
        setScripts,
      );
    },
    [badges, responsesReceived, tryClean],
  );

  const jsonp = React.useCallback(
    (url: string) => {
    
      var script = document.createElement("script");
      script.src = url;
      const scriptsState = scripts;
      scriptsState.push(script);
      script.id = `${CALLBACK_NAME}-${scriptsState.length + 1}`;
      logDegug( `Adding script tag with id: ${script.id}`, "info", "at jsonp in LIRenderAll");
      setScripts(scriptsState);
      document.body.appendChild(script);
    },
    [scripts],
  );

  const renderBadge = React.useCallback(
    (badge: Element) => {
      const getBadgeKeyQueryParams = (badge: Element): string[] => {
        // Convert the badge's attributes to an array
        const attributes = Array.from(badge.attributes);

        // Filter the attributes to include only those starting with 'data-key-'
        const keyAttributes = attributes.filter((attr: Attr) =>
          attr.name.startsWith("data-key-"),
        );

        // Map the filtered attributes to key-value pairs
        const keyValuePairs = keyAttributes.map((attr: Attr) => {
          const key = attr.name.replace("data-", "").toLowerCase();
          const value = attr.value;
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        });

        logDegug( `Badge key query params: ${keyValuePairs}`, "info", "at renderBadge in LIRenderAll");

        return keyValuePairs;
      };
      const size = props.size || badge.getAttribute("data-size") || "medium";
      const locale =
        props.locale || badge.getAttribute("data-locale") || "en_US";
      const type = props.type || badge.getAttribute("data-type") || "VERTICAL";
      const theme = props.theme || badge.getAttribute("data-theme") || "dark";
      const vanity =
        props.vanity || badge.getAttribute("data-vanity") || "☯liu";
      const version =
        props.version || badge.getAttribute("data-version") || "v1";
      const isEI = badge.hasAttribute("data-ei") || false;
      const entity = badge.getAttribute("data-entity") || "PROFILE";
      const isCreatePage = badge.hasAttribute("data-iscreate") || false;
      const uid = Math.round(1000000 * Math.random());
      let baseUrl = generateUrl(isEI);
      let queryParams = [
        "locale=" + encodeURIComponent(locale),
        "badgetype=" + encodeURIComponent(type),
        "badgetheme=" + encodeURIComponent(theme),
        "uid=" + encodeURIComponent(uid),
        "version=" + encodeURIComponent(version),
      ];
      let url;
      if (version === "v2") {
        baseUrl += "view";
        queryParams.push("badgesize=" + encodeURIComponent(size || "medium"));
        queryParams.push("entity=" + encodeURIComponent(entity || "PROFILE"));
        const badgeKeyQueryParams = getBadgeKeyQueryParams(badge);
        queryParams = queryParams.concat(badgeKeyQueryParams);
      } else {
        baseUrl += "profile";
        queryParams.push("maxsize=" + encodeURIComponent(size));
        queryParams.push("trk=" + encodeURIComponent(TRACKING_PARAM));
        queryParams.push("vanityname=" + encodeURIComponent(vanity));
      }

      if (isCreatePage) {
        queryParams.push("fromCreate=true");
      }

      url = baseUrl + "?" + queryParams.join("&");
      badge.setAttribute("data-uid", `${uid}`);
      jsonp(url); //Calls responseHandler when done
    },
    [
      props.size,
      props.locale,
      props.type,
      props.theme,
      props.vanity,
      props.version,
      props.trackingParam,
      jsonp,
    ],
  );

  // These functions are needed because badge markup is added via innerHtml property which does not run script tags
  const shouldReplaceNode = (
    node: { src: string | number; getAttribute: (arg0: string) => any } & {
      tagName: string;
    },
    isCreate: any,
  ) => {
    return (
      isScriptNode(node) &&
      !childScripts[node.src] &&
      (!isCreate || (isCreate && !node.getAttribute("data-isartdeco")))
    );
  };

  const isScriptNode = (node: { tagName: string }) => {
    return node.tagName === "SCRIPT";
  };

  const cloneScriptNode = (
    node:
      | {
          setAttribute: (arg0: any, arg1: any) => void;
          attributes: { name: any; value: any }[];
        }
      | HTMLElement
      | HTMLScriptElement
      | Element,
  ) => {
    var script = document.createElement("script");
    for (var i = node.attributes.length - 1; i >= 0; i--) {
      script.setAttribute(node.attributes[i].name, node.attributes[i].value);
    }
    return script;
  };

 

 
  /**
   * Effect hook to render badges when the component mounts, where renderBadge calls 
   * are made and state status for the updated badges is set
   */
  React.useEffect(() => {
    if (badges === null) {
      logDegug( `Setting badges to: ${Array.prototype.slice.call(document.querySelectorAll(BADGE_NAMES))}`, "info", "at useEffect in LIRenderAll");
      setBadges(
        Array.prototype.slice.call(document.querySelectorAll(BADGE_NAMES)),
      );
    }
    if (badges && componentDidUpdate === false && badges.length > 0) {
      logDegug( `Rendering badges: ${badges}`, "info", "at useEffect in LIRenderAll where componentDidUpdate: false, thus requiring  rendering to initiate");
      for (const badge of badges || []) {
        const rendered = badge.getAttribute("data-rendered");
        if (!rendered) {
          setExpectedResponses(expectedResponses + 1);
          badge.setAttribute("data-rendered", `${true}`);
          renderBadge(badge);
          setComponentDidUpdate(true);
          if (props.setBadgeDidRender) {
            props.setBadgeDidRender(true);
          }
          logDegug( `Badge rendered: ${badge}`, "info", "at useEffect in LIRenderAll, setting "+ `${CALLBACK_NAME} global as part of linkedin's rendering process to trigger and coupled specific to this current badge, vanity: ${props.vanity || badge.getAttribute("data-vanity")}`);
          (window as any)[CALLBACK_NAME] = responseHandler;

        }
      }
    }
  }, [
    badges,
    BADGE_NAMES,
    renderBadge,
    responseHandler,
    expectedResponses,
    setComponentDidUpdate,
    props,
    componentDidUpdate,
  ]);

  // Gets all incoming responses

  return <>
  
  </>;
};

export function isCNDomain() {
  if (typeof window !== "undefined") {
    const hostName = (window.location && window.location.hostname) || "";
    return /linkedin(-ei)?.cn$/.test(hostName);
  }

  return false;
}

export function generateUrl(isEI: boolean) {
  var domainPrefix = isEI
    ? "https://badges.linkedin-ei"
    : "https://badges.linkedin";
  if (isCNDomain()) {
    return domainPrefix + ".cn/";
  }

  return domainPrefix + ".com/";
}

export default LIRenderAll;

/**
 * Tries to clean added tags
 **/
function tryClean(
  responsesReceived: number,
  expectedResponses: number,
  badges: Element[] | null,
  scripts: HTMLScriptElement[],
  CALLBACK_NAME: string,
  setScripts: (scripts: HTMLScriptElement[]) => void,
) {
  const isDone =
    (responsesReceived >= expectedResponses && expectedResponses > 0) ||
    responsesReceived >= (badges?.length || 0);
  if (isDone) {
    delete (window as any)[CALLBACK_NAME];

    // remove all script tags
    const scriptsTemp = scripts;
    scriptsTemp.map(function (script) {
      document.body.removeChild(script);
    });

    setScripts([]);
  }
}
