import BigNumber from "bignumber.js";
import Vue from 'vue'
export const deepClone = (e) => {
  return JSON.parse(JSON.stringify(e))
}

export const deepClone2 = (obj, hash = new WeakMap()) => {
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj === null || typeof obj !== 'object') return obj;

  if (hash.has(obj)) {
    return hash.get(obj)
  }

  let constr = new obj.constructor();
  hash.set(obj, constr);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      constr[key] = deepClone(obj[key], hash)
    }
  }

  let symbolObj = Object.getOwnPropertySymbols(obj)
  for (let i = 0; i < symbolObj.length; i++) {
    if (obj.hasOwnProperty(symbolObj[i])) {
      constr[symbolObj[i]] = deepClone(obj[symbolObj[i]], hash)
    }
  }
  return constr
}


export const formatSizeKM = (num, digits, t) => {
  const si = [
    {value: 1, symbol: ""},
    {value: 1E3, symbol: "K"},
    {value: 1E6, symbol: `M${t ? '+' : ''}`},
    {value: 1E9, symbol: "B"},
    {value: 1E12, symbol: "T"},
  ];
  // const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  // return new BigNumber(num).toFixed(fix);
  return (num / si[i].value).toFixed(digits) + si[i].symbol;
}
export const toThousands = (num) => {
  var initNum = (num || 0).toString(), result = '', formatNum = '';
  if (initNum.indexOf('.') > -1) formatNum = (num || 0).toString().split('.')
  var num = formatNum ? formatNum[0] : initNum;
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = formatNum ? num + result + '.' + formatNum[1] : num + result;
  }
  return result;
}

export const mToUpperCase = (e) => {
  return e.toUpperCase();
}
export const mToLowerCase = (e) => {
  return e.toLowerCase();
}

export const changeChainNetwork = async (e) => {
  let ethereum = window.ethereum;
  if (!ethereum) return false;
  const data = [{
    chainId: e.chainId,
    chainName: e.chainName,
    nativeCurrency: e.nativeCurrency,
    rpcUrls: e.rpcUrls,
    blockExplorerUrls: e.blockExplorerUrls,
  }];
  return await ethereum
    .request({method: "wallet_addEthereumChain", params: data})
    .catch( error =>{
      console.log(error)
      });
}



export const decimalsCarry = (num, decimals = 18) => {
  if(num === 0 || num === '0')
    return num;
  num = num + '';
  if (num.length >= decimals) {
    let first = num.substring(0, num.length - decimals);
    first = first === '' ? 0 : first;
    let last = num.substring(first.length, num.length);
    last = first === 0 ? num : last;
    num = first + '.' + last;
  } else {
    let first0 = decimals - num.length;
    let first = (eval(`1e${first0}`) + '').replace(/1/, '0.');
    num = first + num;
  }

  return num;
};

export const isChainCoin = (tokenName, network) => {
  if (['ETH'].indexOf(tokenName) > -1 && parseInt(network) === 1) {
    return true;
  } else if (['HT'].indexOf(tokenName) > -1 && parseInt(network) === 128) {
    return true;
  } else if (['BNB'].indexOf(tokenName) > -1 && parseInt(network) === 56) {
    return true;
  } else {
    return false;
  }
}


export const decimalsAbdicate = (num, decimals = 18) => {
  num = num + '';
  if (num.indexOf('.') > -1) {
    let first = num.split('.')[0];
    let last = num.split('.')[1];
    last = last + String(eval(`1e${decimals}`)).split('1')[1];

    let last_s = last.substring(0, decimals);
    num = first + last_s;
    num = num.replace(/\b(0+)/gi, "")
    num = num ? num : '0';
  } else {
    num = num + String(eval(`1e${decimals}`)).split('1')[1];
  }
  return num;
}
export const downFixedExt = (num, fix) => {
  if (num === 0 || num === '0'){
    return new BigNumber(num).toFixed(fix);
  }
  return downFixed(num,fix);
}

export const downFixed = (num, fix) => {
  if (num === 0 || num === '0') return new BigNumber(num).toFixed(fix);
  if (num === '...') return '...';
  let result = '0'
  if (Number(num) && fix > 0) {
    fix = +fix || 2
    num = num + ''
    if (/e/.test(num)) {
      num = Number(num);
      let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      result = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    } else if (!/\./.test(num)) {
      result = num + `.${Array(fix + 1).join('0')}`
    } else {
      num = num + `${Array(fix + 1).join('0')}`
      let reg = new RegExp(`-?\\d*.\\d{0,${fix}}`)
      result = reg.exec(num)[0]
    }
  }
  let min = 1 / eval(`1e${fix}`);
  if (Number(result) < min && Number(result) > 0) {
    return 0;
  }
  if (Number(result) > min && Number(result) < 0) {
    return 0;
  }

  return result
}

export const hiddenAddress = (e) => {
  if (e && e.length > 0) {
    let left = e.substring(0, 4);
    let right = e.substring(e.length - 4, e.length)
    return left + '...' + right;
  } else {
    return '';
  }
}

export const hiddenNftId = (e) => {
  if (e && e.length > 6) {
    let left = e.substring(0, 2);
    let right = e.substring(e.length - 2, e.length)
    return left + '...' + right;
  } else {
    return e;
  }
}


export const formatDate = (time, format) => {
  if (!time) {
    return '--';
  }
  Date.prototype.format = function (format) {
    var o = {
      'M+': this.getMonth() + 1,
      // month
      'd+': this.getDate(),
      // day
      'h+': this.getHours(),
      // hour
      'm+': this.getMinutes(),
      // minute
      's+': this.getSeconds(),
      // second
      'q+': Math.floor((this.getMonth() + 3) / 3),
      // quarter
      'S': this.getMilliseconds()
      // millisecond
    };
    if (/(y+)/.test(format) || /(Y+)/.test(format)) {
      format = '20' + format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return format;
  };
  return (new Date(time)).format(format);
}

export const toNonExponential = (num) => {
  if (isNaN(num)) {
    return num;
  }
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}


const str = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const generateMixed = (n) =>{
  let res = "";
  for(let i = 0; i < n ; i ++) {
    const id = Math.ceil(Math.random() * 9);
    res += str[id];
  }
  return res;
}

export const showColl = (name) =>{
  return name.length > 9 ? name.substring(0,8) + '...' : name;
}


export const formatDateEN = (e) =>{
  if(!e) return "-";
  let date = e.split(" ")[0]
  let time = e.split(" ")[1]

  date = new Date(date);
  let monthArr = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec");

  let year = date.getFullYear();
  let month = monthArr[date.getMonth()];
  let ddate = date.getDate();
  if(ddate<10){
    ddate = "0"+ddate
  }

  return month + " " + ddate +" " + year + ", " + time;
}
