/**
 * 自定义基于 axios 的异步文件下载器
 * @author Tianlong Liu
 */
import request from '@/utils/request'
import { Message } from 'element-ui'

const globalDownloadLinkId = 'downloader_link_' + (new Date().getTime())
const defaultRequestConfig = {
  responseType: 'blob'
}
const downloader = {

  /**
   * get方式下载
   * @param {*} url
   * @param {*} fileName
   * @param {*} config
   */
  get(url, fileName, config) {
    config = Object.assign(config || {}, { method: 'get' })
    this.request(url, fileName, config)
  },

  /**
   * post方式下载
   * @param {*} url
   * @param {*} fileName
   * @param {*} config
   */
  post(url, fileName, config) {
    config = Object.assign(config || {}, { method: 'post' })
    this.request(url, fileName, config)
  },

  /**
   * 请求
   * @param  url
   * @param {*} fileName
   * @param {*} config
   */
  request(url, fileName, config) {
    const cfg = Object.assign(config, { url: url }, defaultRequestConfig)
    request(cfg).then(res => {
      if (res.status === 200) {
        const urlObj = window.URL || window.webkitURL || window.mozURL
        const downloadUrl = urlObj.createObjectURL(new Blob([res.data]))
        let link = document.querySelector('#' + globalDownloadLinkId)
        if (!link) {
          link = document.createElement('a')
          link.setAttribute('id', globalDownloadLinkId)
          link.style.display = 'none'
          document.body.appendChild(link)
        }
        link.href = downloadUrl
        link.setAttribute('download', fileName)
        link.click()
      } else {
        Message({
          showClose: true,
          message: '下载失败',
          type: 'error'
        })
        console.log(res)
      }
    }).catch(err => {
      let msg = `下载失败`
      if (err.response && err.response.status === 404) {
        msg += '，资源不存在'
      }
      Message({
        showClose: true,
        message: msg,
        type: 'error'
      })
      console.log(err)
    })
  }
}

export default downloader
