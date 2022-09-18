/* Auto generated, hash = 2xnr98u0iux66h5q9lkxquv5q */
//From LinkedIn TODO: Break this file down so that we can actually unit test it.
import React, { Component } from "react";

import { createRoot } from "react-dom/client";
import { cloneDeep } from "lodash";
export default class LinkedinBadgeLoader extends Component<any, any> {
  readonly CALLBACK_NAME: string = "LIBadgeCallback"; //Must match callback on helpers.js
  readonly BADGE_NAMES = [".LI-profile-badge", ".LI-entity-badge"];
  readonly TRACKING_PARAM = "profile-badge";
  private responsesReceived = 0; //Keeps track of number of responses recieved for proper cleanup when finished
  private expectedResponses = 0; //Keeps track of number of responses to expect
  private scripts: HTMLScriptElement[] = []; //Keeps track of scripts added for proper cleanup when finished
  private childScripts: Map<Node, boolean>;
  readonly badges: HTMLElement[];

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
  constructor() {
    super({});
    this.responseHandler = this.responseHandler.bind(this);
    this.childScripts = new Map<Node, boolean>();
    this.tryClean = this.tryClean.bind(this);
    this.liuRenderAll = this.liuRenderAll.bind(this);
    this.replaceScriptTags = this.replaceScriptTags.bind(this);
    this.badges = Array.prototype.slice.call(
      document.querySelectorAll(this.BADGE_NAMES.join(" ")).values(),
      0
    );
    this.renderBadge = this.renderBadge.bind(this);

    (window as any)[this.CALLBACK_NAME] = this.responseHandler;
  }
  /**
   * Renders all unrendred LinkedIn Badges on the page
   */
  liuRenderAll() {
    // TODO -- tracking param for other badge types

    for (const badge of this.badges) {
      const rendered = badge.getAttribute("data-rendered");
      if (rendered !== null && rendered.length > 0) {
        this.expectedResponses++;
        badge.setAttribute("data-rendered", "true");
        this.renderBadge(badge);
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

    // Array.prototype.slice.call(badge.attributes).filter(function (attr) {
    //   return attr.name.lastIndexOf('data-key-', 0) !== -1;
    // }).map(function (attr) {
    //   // Most browsers automatically lowercase the attribute name when its being read
    //   // We are calling lowercase on it again to ensure consistency for any browsers that are lagging behind.
    //   return encodeURIComponent(attr.name.replace('data-', '').toLowerCase()) + '=' + encodeURIComponent(attr.value);
    // });
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
    this.jsonp(url); //Calls responseHandler when done
  }

  /**
   * Handles a response from the server. Finds badge matching badgeUid and inserts badgeHtml there
   * @param badgeHtml: String representing contents of the badge
   * @param badgeUid: UID of the badge to target
   **/
  responseHandler(badgeHtml: HTMLElement, badgeUid: string) {
    this.responsesReceived++;

    let i, badge, uid, isCreate;
    const defaultWidth = 330; // max possible width
    const defaultHeight = 300; // max possible height

    for (const badge of this.badges) {
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
          this.setState({
            badgeLoaded: true,
          });
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

  // These functions are needed because badge markup is added via innerHtml property which does not run script tags
  replaceScriptTags(node: Node, isCreate: boolean) {
    if (this.shouldReplaceNode(node as HTMLElement, isCreate)) {
      node.parentNode?.replaceChild(
        this.cloneScriptNode(node as HTMLElement),
        node
      );
      this.childScripts.set(node, true);
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
      !this.childScripts.get(node) &&
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
    this.liuRenderAll();
    return (
      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size="large"
        data-theme="light"
        data-type="HORIZONTAL"
        data-vanity="liu"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link"
          href="https://www.linkedin.com/in/liu?trk=profile-badge"
        >
          Ziping L.
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
      (this.responsesReceived >= this.expectedResponses &&
        this.expectedResponses > 0) ||
      this.responsesReceived >= this.badges.length;
    if (done) {
      delete (window as any)[`${this.CALLBACK_NAME}`];

      // remove all script tags
      this.scripts.map(function (script) {
        document.body.removeChild(script);
      })
    }
  }

  /*
   * Makes Jsonp request, responses handles by CALLBACK_NAME
   * @param url String: url of server to make request to
   */
  jsonp(url: string) {
    const script = document.createElement("script");
    script.src = url;
    this.scripts.push(script);
    document.body.appendChild(script);
  }
}

const badgeLoader = new LinkedinBadgeLoader();
