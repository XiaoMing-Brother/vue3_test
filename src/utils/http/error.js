import { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { ApiStatus } from './status'

/**
 * @typedef {Object} ErrorResponse
 * @property {number} code - 错误代码
 * @property {string} msg - 错误消息
 * @property {*} [data] - 错误数据
 */

/**
 * @typedef {Object} ErrorLogData
 * @property {number} code - 错误代码
 * @property {string} message - 错误消息
 * @property {*} [data] - 错误数据
 * @property {string} timestamp - 时间戳
 * @property {string} [url] - 请求URL
 * @property {string} [method] - 请求方法
 * @property {string} [stack] - 错误堆栈
 */

// 自定义 HttpError 类
export class HttpError extends Error {
  constructor(message, code, options = {}) {
    super(message)
    this.name = 'HttpError'
    this.code = code
    this.data = options.data
    this.timestamp = new Date().toISOString()
    this.url = options.url
    this.method = options.method
  }

  toLogData() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
      url: this.url,
      method: this.method,
      stack: this.stack
    }
  }
}

/**
 * 获取错误消息
 * @param {number} status 错误状态码
 * @returns {string} 错误消息
 */
const getErrorMessage = (status) => {
  const errorMap = {
    [ApiStatus.unauthorized]: '未授权访问',
    [ApiStatus.forbidden]: '禁止访问',
    [ApiStatus.notFound]: '资源不存在',
    [ApiStatus.methodNotAllowed]: '请求方法不允许',
    [ApiStatus.requestTimeout]: '请求超时',
    [ApiStatus.internalServerError]: '服务器内部错误',
    [ApiStatus.badGateway]: '网关错误',
    [ApiStatus.serviceUnavailable]: '服务不可用',
    [ApiStatus.gatewayTimeout]: '网关超时'
  }

  return errorMap[status] || '服务器内部错误'
}

/**
 * 处理错误
 * @param {AxiosError} error 错误对象
 * @returns {never} 错误对象
 */
export function handleError(error) {
  // 处理取消的请求
  if (error.code === 'ERR_CANCELED') {
    console.warn('Request cancelled:', error.message)
    throw new HttpError('请求已取消', ApiStatus.error)
  }

  const statusCode = error.response?.status
  const errorMessage = error.response?.data?.msg || error.message
  const requestConfig = error.config

  // 处理网络错误
  if (!error.response) {
    throw new HttpError('网络连接错误', ApiStatus.error, {
      url: requestConfig?.url,
      method: requestConfig?.method?.toUpperCase()
    })
  }

  // 处理 HTTP 状态码错误
  const message = statusCode
    ? getErrorMessage(statusCode)
    : errorMessage || '请求失败'
  throw new HttpError(message, statusCode || ApiStatus.error, {
    data: error.response.data,
    url: requestConfig?.url,
    method: requestConfig?.method?.toUpperCase()
  })
}

/**
 * 显示错误消息
 * @param {HttpError} error 错误对象
 * @param {boolean} showMessage 是否显示错误消息
 */
export function showError(error, showMessage = true) {
  if (showMessage) {
    ElMessage.error(error.message)
  }
  // 记录错误日志
  console.error('[HTTP Error]', error.toLogData())
}

/**
 * 判断是否为 HttpError 类型
 * @param {*} error 错误对象
 * @returns {boolean} 是否为 HttpError 类型
 */
export const isHttpError = (error) => {
  return error instanceof HttpError
}
