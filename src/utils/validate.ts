/**
 * 判断url是否是http或https
 */
export function isHttp(url: string) {
  return url.includes('http://') || url.includes('https://')
}

/**
 * 判断path是否为外链
 */
export function isExternal(path: any) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 */
export function validUsername(str: string) {
  const validMap = ['admin', 'editor']
  return validMap.includes(str.trim())
}

/**
 */
export function validURL(url: string) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d?)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:\d+)*(\/($|[\w.,?'\\+&%$#=~-]+))*$/
  return reg.test(url)
}

/**
 */
export function validLowerCase(str: string) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 */
export function validUpperCase(str: string) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 */
export function validAlphabets(str: string) {
  const reg = /^[A-Z]+$/i
  return reg.test(str)
}

/**
 */
export function validEmail(email: string) {
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
  return reg.test(email)
}

// /**
//  * @param {string} str
//  * @returns {Boolean}
//  */
// export function isString(str: string) {
//     if (typeof str === 'string' || str instanceof String) {
//         return true;
//     }
//     return false;
// }

// /**
//  * @param {Array} arg
//  * @returns {Boolean}
//  */
// export function isArray(arg:any) {
//     if (typeof Array.isArray === 'undefined') {
//         return Object.prototype.toString.call(arg) === '[object Array]';
//     }
//     return Array.isArray(arg);
// }
