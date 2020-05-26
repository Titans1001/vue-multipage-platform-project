import {
  KEY,
  IV
} from '@/config/config'
import CryptoJS from 'crypto-js' // 引用AES源码js
const key = CryptoJS.enc.Utf8.parse(KEY) // 十六位十六进制数作为秘钥
const iv = CryptoJS.enc.Utf8.parse(IV) // 十六位十六进制数作为秘钥偏移量
// 加密方法不可逆
function EncryptIrreversible(word) {
  let key = CryptoJS.enc.Utf8.parse(KEY)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: CryptoJS.enc.Utf8.parse(IV),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString().toUpperCase()
}
// 解密方法
function Decrypt(word, keys, ivs) {
  keys = keys || key
  ivs = ivs || iv
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, keys, {
    iv: ivs,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
// 加密方法
function Encrypt(word, keys, ivs) {
  keys = keys || key
  ivs = ivs || iv
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, keys, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString().toUpperCase()
}
// MD5加密方法
function MD5(words) {
  return CryptoJS.MD5(words).toString()
}
export default {
  Decrypt,
  Encrypt,
  EncryptIrreversible,
  MD5
}
