/* Auto generated, hash = 2xnr98u0iux66h5q9lkxquv5q */
//From LinkedIn TODO: Break this file down so that we can actually unit test it.
import React, { Component } from "react";

import { createRoot } from "react-dom/client";
import { cloneDeep } from "lodash";

export type LinkedinBadgeLoaderProps = {
  locale?:string;
  size?:'small'|'medium'|'large';
   theme?:'dark'|'light';
   type?:'horizontal'|'vertical';
   vanity?:string;
   version?:'v1'|'v2';
   className?:string;
   linkClassName?:string;
   trackingParam?:string;
  title?:string;
 }
export default class LinkedinBadgeLoader extends Component<any,Required<LinkedinBadgeLoaderProps & {badgeLoaded:boolean,  responsesReceived: number; //Keeps track of number of responses recieved for proper cleanup when finished
 expectedResponses: number; //Keeps track of number of responses to expect}> > 
  scripts: HTMLScriptElement[]; //Keeps track of scripts added for proper cleanup when finished
  childScripts: Map<Node, boolean>;
}>>{
  readonly CALLBACK_NAME: string = "LIBadgeCallback"; //Must match callback on helpers.js
  readonly BADGE_NAMES = [".LI-profile-badge", ".LI-entity-badge"];
  readonly SCRIPT_NAMES =[".badge-base__link", ".LI-simple-link"]
  readonly BASE_NAME = "badge-base";
  readonly TRACKING_PARAM = "profile-badge";



  static isCNDomain() {
    if (typeof window !== "undefined") {
      const hostName =
        window?.location?.hostname || window?.location?.href || "";

      const url = new URL(hostName);
      const domain = url.hostname;
      return /linkedin(-ei)?.cn$/.test(domain);
    }

    return false;
  }
  static generateUrl(isEI: boolean) {
    const domainPrefix = isEI
      ? "https://badges.linkedin-ei"
      : "https://badges.linkedin";
    const domainSuffix = LinkedinBadgeLoader.isCNDomain() ? ".cn" : "";
    return `${domainPrefix}${domainSuffix}/js/linkedInBadge.js`;
  }
  constructor(props: LinkedinBadgeLoaderProps) {
    super(props);
    this.state = {
      locale: props.locale || "en_US",
      size: props.size || "medium",
      theme: props.theme || "light",
      type: props.type || "horizontal",
      vanity: props.vanity || "liu",
      version: props.version || "v1",
      badgeLoaded: false,
      title: props.title || "Linkedin.com/in/liu",
      className: props.className || `${this.BASE_NAME} ${this.BADGE_NAMES[0].replace('.', '')}`,
      linkClassName: props.linkClassName || this.SCRIPT_NAMES.map((name) => name.replace(".","")).join(" "),
      trackingParam: props.trackingParam || this.TRACKING_PARAM,
      expectedResponses: 0,
      responsesReceived: 0,
      scripts : [],
      childScripts: new Map(),
    };
    this.responseHandler = this.responseHandler.bind(this);
    this.tryClean = this.tryClean.bind(this);
    this.getBadgeKeyQueryParams = this.getBadgeKeyQueryParams.bind(this);
    this.liuRenderAll = this.liuRenderAll.bind(this);
    this.replaceScriptTags = this.replaceScriptTags.bind(this);
    this.renderBadge = this.renderBadge.bind(this);
    this.jsonp = this.jsonp.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    (window as any)[this.CALLBACK_NAME] = this.responseHandler;
  }
  /**
   * Renders all unrendred LinkedIn Badges on the page
   */
  liuRenderAll() {
    // FROM LINKEDIN TODO -- tracking param for other badge types
    const badges = document.querySelectorAll(this.state.className);
    for (const badge of badges) {
      const rendered = badge.getAttribute("data-rendered");
      if (rendered !== null && rendered.length > 0) {
        this.setState({
          expectedResponses: this.state.expectedResponses + 1,
        })
        badge.setAttribute("data-rendered", "true");
        this.renderBadge(badge as HTMLElement);
      }
    }
  }

  getBadgeKeyQueryParams(badge: HTMLElement) {
    const params: string[] = [];
    const key_regex = /data-(\w+)/;
    for (const attr of badge.attributes) {
      if (attr.name.startsWith("data-") && attr.name.match(key_regex)) {
        const paramsFound = attr.name.match(key_regex);

        paramsFound?.forEach((param) => {
          params.push(`${param}=${attr.value}`);
        });
      }
    }
    return params;

  }

  /*
   * Renders a single badge on the page
   * @param badge: div element of badge to render
   */
  renderBadge(badge: HTMLElement) {
    let size = badge.getAttribute("data-size") || "medium",
      locale = badge.getAttribute("data-locale") || "en_US",
      type = badge.getAttribute("data-type") || "vertical",
      theme = badge.getAttribute("data-theme") || "light",
      vanity = badge.getAttribute("data-vanity") || "",
      version = badge.getAttribute("data-version") || "v1",
      isEI = badge.hasAttribute("data-ei") || false,
      entity = badge.getAttribute("data-entity") || "",
      isCreatePage = badge.hasAttribute("data-iscreate") || false,
      uid = Math.round(1000000 * Math.random()),
      baseUrl = LinkedinBadgeLoader.generateUrl(isEI),
      queryParams = [
        "locale=" + encodeURIComponent(locale),
        "badgetype=" + encodeURIComponent(type),
        "badgetheme=" + encodeURIComponent(theme),
        "uid=" + encodeURIComponent(uid),
        "version=" + encodeURIComponent(version),
      ];

    let url = baseUrl + "?" + queryParams.join("&");

    if (version === "v2") {
      baseUrl += "view";
      queryParams.push("badgesize=" + encodeURIComponent(size));
      queryParams.push("entity=" + encodeURIComponent(entity));
      queryParams = queryParams.concat(this.getBadgeKeyQueryParams(badge));
    } else {
      baseUrl += "profile";
      queryParams.push("maxsize=" + encodeURIComponent(size));
      queryParams.push("trk=" + encodeURIComponent(this.TRACKING_PARAM));
      queryParams.push("vanityname=" + encodeURIComponent(vanity));
    }

    if (isCreatePage) {
      queryParams.push("fromCreate=true");
    }

    url = baseUrl + "?" + queryParams.join("&");
    badge.setAttribute("data-uid", String(uid));
    this.setState({ badgeLoaded: true });
    this.jsonp(url); //Calls responseHandler when done
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
 }

 componentWillUnmount() { 
   window.removeEventListener('load', this.handleLoad)  
 }

  /**
   * Handles a response from the server. Finds badge matching badgeUid and inserts badgeHtml there
   * @param badgeHtml: String representing contents of the badge
   * @param badgeUid: UID of the badge to target
   **/
  responseHandler(badgeHtml: HTMLElement, badgeUid: string) {
    this.setState({
      responsesReceived: this.state.responsesReceived + 1,
    });
  

    let i, badge, uid, isCreate;
    const defaultWidth = 330; // max possible width
    const defaultHeight = 300; // max possible height
    const badges = document.querySelectorAll(this.state.className);
    for (const badge of badges) {
      isCreate = badge.hasAttribute("data-iscreate");
      uid = badge.getAttribute("data-uid");
      if (uid === badgeUid) {
        const badgeMarkup = badge.innerHTML;

        const iframe = document.createElement("iframe");
        iframe.onload = () => {
          const iframeBody = iframe?.contentWindow?.document.body;
          // 5 px buffer to avoid the badge border being cut off.
          iframe.setAttribute(
            "height",
            String((iframeBody?.scrollHeight || defaultHeight) + 5)
          );
          iframe.setAttribute(
            "width",
            String(iframeBody?.scrollWidth || defaultWidth) + 5
          );
        
        };

        createRoot(iframe).render(
          <body>
            <>{badgeHtml}</>
          </body>
        );

        iframe.appendChild(badge);
      }
    }
  }
  handleLoad() {
    this.liuRenderAll();
   }

  // These functions are needed because badge markup is added via innerHtml property which does not run script tags
  replaceScriptTags(node: Node, isCreate: boolean) {
    if (this.shouldReplaceNode(node as HTMLElement, isCreate)) {
      node.parentNode?.replaceChild(
        this.cloneScriptNode(node as HTMLElement),
        node
      );
      const childScripts = this.state.childScripts;
      childScripts.set(node, true);
      this.setState({ childScripts });
    } else {
      let i = 0,
        children = node.childNodes;
      while (i < children.length) {
        this.replaceScriptTags(children[i++], isCreate);
      }
    }
    return node;
  }

  shouldReplaceNode(node: HTMLElement, isCreate: boolean) {
    return (
      this.isScriptNode(node) &&
      !this.state.childScripts.get(node) &&
      (!isCreate || (isCreate && !node.getAttribute("data-isartdeco")))
    );
  }

  isScriptNode(node: HTMLElement) {
    return node.tagName === "SCRIPT";
  }
  cloneScriptNode(node: HTMLElement) {
    const script = document.createElement("script");

    const cloneNode = cloneDeep(node);
    for (let i = cloneNode.attributes.length - 1; i >= 0; i--) {
      script.setAttribute(
        cloneNode.attributes[i].name,
        cloneNode.attributes[i].value
      );
    }
    return script;
  }

  render() {
    
    return (
      <div
        className= {this.state.className}
        data-locale={this.state.locale}
        data-size={this.state.size}
        data-theme={this.state.theme}
        data-type={this.state.type}
        data-vanity=  {this.state.vanity}
        data-version={this.state.version}
      >
        <a
          className={this.state.linkClassName}
          href={`${'https://www.linkedin.com/in/' + this.state.vanity + '?trk=profile-badge'}`}
        >
         {this.state.title}
        </a>
        
      </div>
    );
  }

  // Gets all incoming responses

  /**
   * Tries to clean added tags
   **/
  tryClean() {
    //Clean up after all requests are done..
    //Accounts for people including script more than once
    const done =
      (this.state.responsesReceived >= this.state.expectedResponses &&
        this.state.expectedResponses > 0) ||
      this.state.responsesReceived >= this.state.badges.length;
    if (done) {
      delete (window as any)[`${this.CALLBACK_NAME}`];

      // remove all script tags
      const scripts = this.state.scripts;
      scripts.map(function (script) {
        document.body.removeChild(script);
      })
      this.setState({ scripts});
    }
  }

  /*
   * Makes Jsonp request, responses handles by CALLBACK_NAME
   * @param url String: url of server to make request to
   */
  jsonp(url: string) {
    const script = document.createElement("script");
    script.src = url;
    const scripts = this.state.scripts;
    scripts.push(script);
    this.setState({ scripts });
    document.body.appendChild(script);
  }
}

