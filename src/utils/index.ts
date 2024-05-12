/**
 *
 * @description Generates a unique identifier (UID) for a LinkedIn Badge component. It ensures that the ID does not clash with any existing IDs. To achieve this, the method uses a set of criteria such as the component's properties, hostname, pathname, search, IP address, and current timestamp. In contrast, LinkedIn uses a random number, which may result in collisions. The proposed method offers a more reliable and robust solution for UID generation. It does not rely on cryptographic algorithms or libraries that are not necessary for the context of UID usages. The UID mainly serves as unique DOM identifiers.
 * @param {Record<string, any>} props - The properties of the LinkedIn Badge component.
 * @param {boolean} [generateUidWithoutApi] - Defaults as false. If true, the UID creation won't include utilizing an API call to form a more unique UID.
 * @returns {Promise<string>} The generated UID, which is an unsigned 32-bit integer in string format.
 */
export async function generateUidFromProps(
  props: Record<string, any>,
  generateUidWithoutApi = false,
) {
  const getIpInBrowser = async () => {
    return new Promise<string | null>((resolve, reject) => {
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => resolve(data.ip))
        .catch((err) => resolve(null));
    });
  };

  const keys = Object.keys(props);
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const search = window.location.search;

  // create hash from the keys, values, hostname, pathname, search, and ip address, hash
  // should be a number, created via bitwise operations
  let hash = 0;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = props[key];
    console.info("key", key, "value", value);
    if (value && typeof value === "string") {
      for (let j = 0; j < value.length; j++) {
        hash = (hash << 5) - hash + value.charCodeAt(j);
      }
    }
  }
  console.info("hash2", hash);
  if (hostname && typeof hostname === "string") {
    for (let i = 0; i < hostname.length; i++) {
      hash = (hash << 5) - hash + hostname.charCodeAt(i);
    }
  }
  if (pathname && typeof pathname === "string") {
    for (let i = 0; i < pathname.length; i++) {
      hash = (hash << 5) - hash + pathname.charCodeAt(i);
    }
  }

  if (search && typeof search === "string") {
    for (let i = 0; i < search.length; i++) {
      hash = (hash << 5) - hash + search.charCodeAt(i);
    }
  }

  if (generateUidWithoutApi === false) {
    const ip = await getIpInBrowser();

    if (ip && typeof ip === "string") {
      for (let i = 0; i < ip.length; i++) {
        hash = (hash << 5) - hash + ip.charCodeAt(i);
      }
    }
  }

  const currentTimestamp = Date.now();
  hash = (hash << 5) - hash + currentTimestamp;

  hash = hash >>> 0;

  return hash.toString();
}
