import axios from 'axios'
import { baseUrl } from './url'
import qs from 'qs'

axios.defaults.timeout = 60000;
axios.defaults.baseURL = baseUrl;
//axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'; --application/x-www-form-urlencoded;charset=UTF-8
axios.defaults.headers.post['Content-Type'] =  'application/json';
axios.defaults.headers.put['Content-Type'] =  'application/json';
axios.defaults.aes_key = '1234567890123456' ;

// 请求拦截
axios.interceptors.request.use(function (config) {
  let token = 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMTI4R0NNIn0.M00vfJ1DOHXkAXeqj2nIe1z31K8q_s9c2bIr6sA4W13YDLlfCyXQgTFBcJsNACf2kWOp5tO7XZyYsljsBwgX041iJdncs_NnFAuqCgUlbOkD4Eh_A60pyT08Zhn3NYHBo9E63aR_woftTl3WVwFySE6qXlo4fs6Bcg5g8e0Xgms.pSfuvtlBvp13k7dx.gv898p2_cwivsGbyBXFq9WuCbXUleoY5k_l-XWVWlqH5b4vqbt8v81gtkVJYjlTAJVe7Ig5U5uNJy3xOGBMTFbNd0H0CeyOjopWMSzXvbPBKunEYtMdkeYHm1-KuWM0h3Q_Cq4zuW9e6JSBXpAs4mEm-GBcW6du6vwzn2P2F1fPkQso8QY-GhbaJUWFgd8OsNXJS-APkAHBfr9ISkITu2UMXx8-6fmokEIymNwOy5jMY9e9qk3_6eQIRvu73f5rmwJJo0PkVtoPG9Qrtgg3W6nHvgQAA1GFA2sgKqiEh1bz36j9rKGL-xXv1nRk6qsSdUsSaS9KA99k9Pc_nygi0ts6tHmNYikCyLKre7TKitVfM_Q3KzNu0wM2Tkst9EPmfUyo3hvxIEUJ0v773cnJcFiQaKcHuvNSaZPzXsyGE2symjYtWcHUxX1FQARVKX9mBx58P9jxhGu-r4Am1t3DeHRisyP_PIxg82-gNrZe8greY6gWltK5fyBRLW5SKJTPY6PYr8yi0pZgXi2EbB829fMsPpfNAbRxMIySsyvFcYR_jVsWRSrA06w2SZmplBAF7eOD4qqeOVGdSaGK1mhczJ0_BaZpUudTOoVvPqU7UiE3dZNk70OS2NgdtTtGUlJsA1Qw2Wud5xvDS2T18MFflfMRavfj4M6_0vuBk3n9GR3VjqXk_JKOD296ORad09e56IrWSuB_4jwNe7M2_hE5WWxvrdhtb3hvUQtpoVMqAeUF39BKHeSSt5SpspigzznhHrfVsrKVft7ARVF1GRd7AtopTqe_GY-3aTN_46-Rt-HAT_NLF4Wq4RznTwZh_aTNA3U2sUM_GQbmrVmceLbwIIEQtzuaZPDgWn5n8nHnfkdYvYuk7HINKgySfj6zLpAYqAeKa2uTHUK42C6RCiWKcwTsbVPPBRciXaT889JTbbyXly7-JM049LqJAWlFcWtb_zzcvvOOUsOoPLL_SRly3FIFOWR2ebri69P0jdr4HHAsYdPad4LRg-ub_G6cxF8uucnyN64TZSktoL_M8EdG5Jg4EMEQ-Y81hav91nhSXIuyILz8zSNOuZ4irCQLwkTPIB32yfB8GpEz8h44dZSpSbXWwPrBAmMu6irrudJqA-w0zH3gMQd8dHW9rSCE0dlHaJETiRKjhpa7inhtkF8PjIc8wDbhn3FCtaVCSHu4OxdwZWgfEhOoorH7zcRAD9cXy0_3FwhGdhFVjkq2ItimqCnx-ACS4RLDa61DyNYM0ZN0907K5SN8Ctqo1XHNMtuJsLhzCd-WqZQRs2CNeCDsNJLsz8LbscVaiVoAG_aRveVu37GSdtX3Zf1SeU8ZJYiNu_YqAKLQ79NSa32dVQ6ShLGxfgGPKhknGl7d7v7MrooYBZnpeKFXmyztJOxZHfXtvsR2scW053MYYxbNMlOrKDiiKV3czOAnD-6Pgl6Fn6m3HeK_CuFhShjBGsJOWLdTmw5O4qnzpU7oC00o1.r5Co08hR1TbLmMxYYuiLaQ';

    config.data = JSON.stringify(config.data);
    config.headers.Authorization = token;
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 响应拦截
axios.interceptors.response.use(function (response) {
    if (response.data.errCode === 2) {
        window.location.href = 'http://127.0.0.1:8080'//地址重定向
    }
    return response;
}, function (error) {
    return Promise.reject(error.response.data);
});

/**
 * 封装 加密的算法，根据传入的token值进行加解密，如果没有传值则根据配置去 vuex中去取*
 * @export
 * @param {*} data
 * @param {*} encryptSecretKey
 * @returns
 */
export  function encrypto (data, encryptSecretKey){
        var key = CryptoJS.enc.Utf8.parse(encryptSecretKey);
        var encryptedData = CryptoJS.AES.encrypt(data, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData.ciphertext.toString());
        var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        return encryptedBase64Str;

}

/**
 *封装 解密的算法，根据传入的token值进行加解密，如果没有传值则根据配置去 vuex中去取*
 * @export
 * @param {*} encryptedBase64Str
 * @param {*} encryptSecretKey
 * @returns
 */
export  function decrypto(encryptedBase64Str, encryptSecretKey) {
    var key = CryptoJS.enc.Utf8.parse(encryptSecretKey);
    var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decryptedData.toString(CryptoJS.enc.Utf8);
}



// 封装axios的get请求
export function fetch (url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(response => {
                console.log("response.data",response.data)
                resolve(response.data)
            })
            .catch((error) => {
              console.log("cuowu",error)
                reject(error)
            })
    });
}

// 封装axios的delete请求
export function deleteAxios (url, params) {
  return new Promise((resolve, reject) => {
      axios.delete(url, {
              params: params
          })
          .then(response => {
              console.log("delete：response.data",response.data)
              resolve(response.data)
          })
          .catch((error) => {
            console.log("cuowu",error)
              reject(error)
          })
  });
}

// 封装axios的post请求
export function post(url, data = {}, Origin, openLoading) {
    return new Promise((resolve, reject) => {
        //对数据进行加密
        //console.log(axios.defaults.aes_key) ;
        let reqDataQs = JSON.stringify(data) ;
        console.log("加密前 ：",data) ;
       // let reqData = encrypto(reqDataQs,axios.defaults.aes_key) ;
       // console.log("加密后 ：",reqData) ;
        axios.post(url, data)
            .then(response => {
              console.log("response.data",response.data)
                resolve(response.data);
            })
            .catch((error) => {
              console.log("cuowu",error)
                reject(error);
            })
    });
}


// 封装axios的post请求
export function put(url, data = {}, Origin, openLoading) {
  return new Promise((resolve, reject) => {
      //对数据进行加密
      //console.log(axios.defaults.aes_key) ;
      let reqDataQs = JSON.stringify(data) ;
      console.log("put方法加密前 ：",data) ;
     // let reqData = encrypto(reqDataQs,axios.defaults.aes_key) ;
     // console.log("加密后 ：",reqData) ;
      axios.put(url, data)
          .then(response => {
            console.log("put方法response.data",response.data)
              resolve(response.data);
          })
          .catch((error) => {
            console.log("cuowu",error)
              reject(error);
          })
  });
}


//封装统一的得到加密数据的方法 即得到加密的秘钥
export function secret(url, data = {}, Origin, openLoading) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                var decryptSecretKey = response.data.data.decryptSecretKey   ;
                axios.defaults.aes_key  = decryptSecretKey ;
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            })
    });
}
