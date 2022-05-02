/* global $ */
const fs = require('fs')
const crypto = require('crypto')
const { ethers } = require('ethers')
const clipboard = require('clipboardy') // 版本<=2.3.0支持 require

const ENCODE = 'base64'

function createWallet (n = 1) {
  // export NODE_OPTIONS=--openssl-legacy-provider
  // 或者降级到Node16
  // 默认path path = "m/44'/60'/0'/0/0"
  let jArr = []
  for (let i = 0; i < n; i++) {
    let r = ethers.Wallet.createRandom()

    jArr.push({
      addr: r.address,
      pk: r.privateKey,
      mnemonic: r.mnemonic.phrase
    })
  }
  return jArr
}
function initAddrList (n) {
  if (fs.existsSync('./wallet-gen.json')) {
    console.log($.c.y('wallet-gen.json'), `Exist pls move it to another place!`)
    process.exit(1)
  }
  let r = createWallet(n)
  fs.writeFileSync('wallet-gen.json', JSON.stringify(r, null, 2))
  console.log(
    $.c.y('wallet-gen.json'),
    `has been created pls take care off them!`
  )
}

function initEkList () {
  if (!fs.existsSync('./wallet-gen.json')) {
    console.log(
      $.c.y('wallet-gen.json'),
      `isn't Exist pls use "dn wallet init" first!`
    )
    process.exit(1)
  }
  if (fs.existsSync('./ek-wallet-gen.json')) {
    console.log($.c.y('ek-wallet-gen.json'), `is Exist pls Del or Move it`)
    process.exit(1)
  }
  let f = fs.readFileSync('./wallet-gen.json')
  let r = JSON.parse(f.toString())
  let key = crypto.randomBytes(32).toString(ENCODE) // 32位的共享密钥
  let iv = crypto.randomBytes(16).toString(ENCODE) // 初始向量，16 字节
  let addrList = r.map(item => {
    let c = new $.Crypto({
      key: Buffer.from(key, ENCODE),
      iv: Buffer.from(iv, ENCODE)
    })
    let rst = c.encrypt(item.pk)
    return {
      addr: item.addr,
      ek: rst.r,
      tag: rst.tag.toString(ENCODE)
    }
  })

  //console.log(JSON.stringify({ key, iv, addrList }))
  let outStr = JSON.stringify({ key, iv, addrList }, null, 2)
  fs.writeFileSync('ek-wallet-gen.json', outStr)
  console.log(
    $.c.y('ek-wallet-gen.json'),
    `has been created pls take care off`,
    $.c.y('wallet-gen.json')
  )
  console.log('Content copy to clipboard!')
  clipboard.writeSync(JSON.stringify({ key, iv, addrList }))
}

//curl http://local:PORT/signer/cmd -X POST -d '{evt:"setPassword",args:"密码明文字符串"' --header "Content-Type: application/json"
module.exports = {
  init: initAddrList,
  gen: initEkList
}
