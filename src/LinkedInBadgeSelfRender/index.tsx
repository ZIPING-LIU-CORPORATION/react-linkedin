import React, { memo } from "react";
import { generateUidFromProps } from "src/utils";
import LinkedInIcon from "./LinkedInIcon";

const LinkedInBadgeSelfRender = ({
  locale = "en_US",
  size = "medium",
  style,
  theme = "light",
  vanity = "☯liu",
  version = "v1",
  className,
  type = "VERTICAL",
  entity = "PROFILE",
  children,
  generateUidWithoutApi = false,
  hideViewProfileButton = false,
  id,
  TRACKING_PARAM = "public-profile-badge",
  isCreatePage = false,
  name = "",
  noCache = false,
  debug = false,
}: {
  locale?: string;
  size?: "medium" | "large";
  theme?: "light" | "dark";
  entity?: "PROFILE" | "COMPANY" | "GROUP";
  type?: "VERTICAL" | "HORIZONTAL";
  vanity?: string;
  version?: "v1" | "v2";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  generateUidWithoutApi?: boolean;
  hideViewProfileButton?: boolean;
  id?: string;
  TRACKING_PARAM?: string;
  isCreatePage?: boolean;
  name?: string;
  noCache?: boolean;
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

  const [uid, setUid] = React.useState<string | null>(null);

 

  React.useEffect(() => {

    const decodeUnicodeEscapes = (input: string): string => {
        const unicodeEscapeRegex = /\\u([\dA-Fa-f]{4})/g;
        return input.replace(unicodeEscapeRegex, (match, grp) => {
            return String.fromCodePoint(parseInt(grp, 16));
        });
    };


    const fetchData = () => {
      generateUidFromProps({
        locale,
        size,
        theme,
        type,
        vanity,
        version,
        entity,
        generateUidWithoutApi,
        hideViewProfileButton,
        TRACKING_PARAM,
        isCreatePage,
      }).then((uidNew) => {
        if (uidNew !== uid && uidNew !== null) {
          setUid(uidNew);
        }

        const payloadBodyParams: {
          [key: string]: string | string[];
        } = {
          badgetype: encodeURIComponent(type || "VERTICAL"),
          badgetheme: encodeURIComponent(theme || "light"),
          locale: locale || "en_US",
          uid:
            uidNew ||
            `${lastUpdatedTime ? lastUpdatedTime : new Date().getTime()}`,
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

        if (isCreatePage) {
          payloadBodyParams.fromCreate = "true";
        }

        const xmlnew = new XMLHttpRequest();
        const baseUrl = "https://ziping.liu.academy/api/v2/linkedin/profile/";
        console.info(`profileData: ${profileData}, uidNew: ${uidNew}`);
        if (profileData === null && uidNew !== null) {
          xmlnew.open("POST", baseUrl, true);
          xmlnew.setRequestHeader("Content-Type", "application/json");
          xmlnew.onreadystatechange = function () {
            if (xmlnew.readyState === 4 && xmlnew.status === 200) {
            

              console.info(`xmlnew.responseText: ${xmlnew.responseText}`);

              const data = JSON.parse(xmlnew.responseText);
              let headlineText = data.profileHeadline;
                headlineText = decodeUnicodeEscapes(headlineText);
                headlineText = headlineText.replace(/&amp;/g, "&");

              // No need for captureUnicodeEscapes and JSON.parse anymore.
              console.info(`new headlineText: ${headlineText}`);
              console.info(`old headlineText: ${data.profileHeadline}`);
              data.profileHeadline = headlineText;

              if (debug) {
                console.info(
                  `Retrieved profile badge info for vanity ${vanity} via API and saving to local storage: `,
                  `'cachedProfileData-${vanity}-${locale}-${size}-${theme}-${type}-${entity}'`,
                  "profile data",
                  `${Object.keys(data).toString()}`,
                );
              }
              setProfileData(data);
              localStorage.setItem(
                `cachedProfileData-${vanity}-${locale}-${size}-${theme}-${type}-${entity}`,
                JSON.stringify(data),
              );
              localStorage.setItem(
                `cachedProfileData-${vanity}-${locale}-${size}-${theme}-${type}-${entity}-lastUpdated`,
                new Date().getTime().toString(),
              );
            }
          };
          if (debug) {
            console.info(
              `Fetching profile badge info now for vanity ${vanity} via API: `,
              `'${baseUrl}'`,
              "payloadBodyParams",
              `${Object.keys(payloadBodyParams).toString()}`,
            );
          }
          xmlnew.send(JSON.stringify(payloadBodyParams));
        }
      });
    };
    const cachedProfileData = localStorage.getItem(
      `cachedProfileData-${vanity}-${locale}-${size}-${theme}-${type}-${entity}`,
    );
    const lastUpdated = localStorage.getItem(
      `cachedProfileData-${vanity}-${locale}-${size}-${theme}-${type}-${entity}-lastUpdated`,
    );
    const now = new Date().getTime();
    const lastUpdatedTime = parseInt(lastUpdated || "0", 10);
    const timeDiff = now - lastUpdatedTime;
    const timeDiffInHours = timeDiff / (1000 * 60 * 60);

    const isCacheDataMissingRequiredFieldsOrCorrupt =
      cachedProfileData && !cachedProfileData.includes("profileName");
    const isOutDatedOrNotThere =
      isCacheDataMissingRequiredFieldsOrCorrupt ||
      !cachedProfileData ||
      !lastUpdated ||
      timeDiffInHours > 48;
    if (debug) {
      console.info(
        "cachedProfileData",
        cachedProfileData,
        "lastUpdated",
        lastUpdated,
        "isOutDatedOrNotThere",
        isOutDatedOrNotThere,
        "timeDiffInHours",
        timeDiffInHours,
      );
    }
    if (noCache || isOutDatedOrNotThere) {
      if (debug) {
        console.info(
          "Fetching data from API",
          "cachProfileData",
          cachedProfileData,
          "lastUpdated",
          lastUpdated,
          "cachedProfileData",
          cachedProfileData,
        );
      }
      fetchData();
    } else {
      if (debug) {
        console.info(
          "Fetching data from cache linkedinbadge",
          "cachProfileData",
          cachedProfileData,
          "lastUpdated",
          lastUpdated,
        );
      }
      setProfileData(JSON.parse(cachedProfileData));
    }
  }, [
    locale,
    size,
    theme,
    type,
    vanity,
    version,
    entity,
    generateUidWithoutApi,
    hideViewProfileButton,
    TRACKING_PARAM,
    isCreatePage,
    noCache,
    debug,
  ]);

  const widthSet = React.useMemo(() => {
    const sizeTypeToValueMap = {
      medium: {
        VERTICAL: "250",
        HORIZONTAL: "280",
      },
      large: {
        VERTICAL: "300",
        HORIZONTAL: "330",
      },
    };
    return sizeTypeToValueMap[size][type];
  }, [size, type]);

  return (
    <div
      id={id}
      style={style}
      className={"profile-badge-reacted" + (className ? ` ${className}` : "")}
    >
      <div
        className={
          `profile-badge profile-badge--width-${widthSet} ` +
          `profile-badge--${theme === "light" ? "light" : "dark"}`
        }
        lang={locale?.replace(/_[A-Za-z]+$/, "") || "en"}
        dir="ltr"
      >
        <div
          className={
            `profile-badge__header ` +
            `profile-badge__header--${theme === "light" ? "light" : "dark"}`
          }
        >
          <span className="sr-only">LinkedIn</span>
          <LinkedInIcon theme={theme} />
        </div>
        <div className="profile-badge__content">
          {profileData?.profileImageSrc ? (
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
          ) : (
            <figure title={profileData?.profileName}>
              <svg
                className={
                  `artdeco-entity-image ` +
                  `artdeco-entity-image--circle-4 ` +
                  `profile-badge__content-profile-image`
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 128 128"
                id="person-accent-4"
              >
                <path fill="#e7e2dc" d="M0 0h128v128H0z" />
                <path
                  d="M88.41 84.67a32 32 0 10-48.82 0 66.13 66.13 0 0148.82 0z"
                  fill="#788fa5"
                />
                <path
                  d="M88.41 84.67a32 32 0 01-48.82 0A66.79 66.79 0 000 128h128a66.79 66.79 0 00-39.59-43.33z"
                  fill="#9db3c8"
                />
                <path
                  d="M64 96a31.93 31.93 0 0024.41-11.33 66.13 66.13 0 00-48.82 0A31.93 31.93 0 0064 96z"
                  fill="#56687a"
                />
              </svg>
            </figure>
          )}

          <h3 className="profile-badge__content-profile-name" itemProp="name">
            {profileData?.profileName && (
              <a
                 className={
                  `profile-badge__content-profile-name-link ` +
                  `profile-badge__content-profile-name-link--${theme === "light" ? "light" : "dark"}`
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
          {profileData?.profileHeadline && (
            <h4 className="profile-badge__content-profile-headline">
              {profileData?.profileHeadline}
            </h4>
          )}
          {profileData?.profileCompanyOrSchool && (
            <h4 className="profile-badge__content-profile-company-school-info">
              {profileData?.profileCompanyOrSchool &&
                Array.isArray(profileData?.profileCompanyOrSchool) &&
                profileData?.profileCompanyOrSchool.map(
                  (companyOrSchool, index) => {
                    return (
                      <span key={`${uid}-company-school-${index}`}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={companyOrSchool.href}
                          className={
                            `profile-badge__content-profile-company-school-info-link ` +
                            `profile-badge__content-profile-company-school-info-link--${theme === "light" ? "light" : "dark"}`
                          }
                          data-tracking-control-name="public-profile-badge-profile-badge_school-name"
                          data-tracking-will-navigate="true"
                        >
                          {companyOrSchool.text}
                        </a>
                        &nbsp;
                        {index !==
                        profileData?.profileCompanyOrSchool.length - 1
                          ? " | "
                          : ""}&nbsp;
                        </span>
                 
                    );
                  },
                )}
            </h4>
          )}
        </div>
   
        {children}
 
        {hideViewProfileButton === false && profileData !== null && (
          <a
            className={
              `profile-badge__cta-btn ` +
              `profile-badge__cta-btn--${theme === "light" ? "light" : "dark"}`
            }
            rel="noopener noreferrer"
            href={
              profileData?.profileViewLink ||
              `https://www.linkedin.com/in/${encodeURIComponent(vanity || "☯liu")}?trk=public-profile-badge-profile-badge-profile-cta`
            }
            target="_blank"
            data-tracking-control-name="public-profile-badge-profile-badge-view-profile-cta"
            data-tracking-will-navigate=""

          >
            View profile
          </a>
        )}
        {profileData === null && (
          <a
            className="badge-base__link LI-simple-link"
            target="_blank"
            rel="noopener noreferrer"
            key={`${uid}-view-profile-no-data`}
            href={`${
              vanity
                ? `https://www.linkedin.com/in/${vanity}?trk=profile-badge`
                : "https://www.linkedin.com/in/%E2%98%AFliu?trk=public-profile-badge-profile-badge-profile-name"
            }`}
          >
            {name}
          </a>
        )}
      </div>
    </div>
  );
}


export default memo(LinkedInBadgeSelfRender);