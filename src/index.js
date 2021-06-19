import Vue from "vue"
import Axios from 'axios'

const HttpClient = {
    install(Vue, ...options) {
        let [store, interceptors, sessionKey, axiosConfig] = options

        let helper = {}

        if (!sessionKey) {
            sessionKey = '__TOKEN__'
        }

        if (!interceptors) {
            interceptors = this.ignorePermissionVerify
        }

        let config = {
            withCredentials: true,
            baseURL: process.env.VUE_APP_API_BASEURL || '/',
            headers: {
                common: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                post: { 'Content-Type': 'application/json' },
                put: { 'Content-Type': 'application/json' }
            },
            responseType: 'json',
            validateStatus: status => status >= 200 && status <= 300,
            transformResponse: [data => {
                if (typeof data === 'string') {
                    data = JSON.parse(data)
                }
                if (typeof interceptors === 'function') {
                    return interceptors(data)
                } else {
                    throw new Error('[Axios Error]: Install error')
                }
            }],
            transformRequest: [data => {
                if (typeof data !== 'object') {
                    data = {}
                }
                return data instanceof FormData ? data : JSON.stringify(data)
            }]
        }

        const token = window.sessionStorage.getItem(sessionKey) || ''
        if (token) {
            config.headers.common[this.requestHeaderName] = (this.tokenHeader ? this.tokenHeader + ' ' : '') + token
        }
        if (store) {
            helper = {
                getResponseData: res => res.data,
                getAuthorization: () => {
                    return Vue.prototype.$http.defaults.headers.common[this.requestHeaderName] || ''
                },
                setAuthorization: token => {
                    if (token) {
                        window.sessionStorage.setItem(sessionKey, token)
                        Vue.prototype.$http.defaults.headers.common[this.requestHeaderName] = (this.tokenHeader ? this.tokenHeader + ' ' : '') + token
                    } else {
                        window.sessionStorage.removeItem(sessionKey)
                        delete Vue.prototype.$http.defaults.headers.common[this.requestHeaderName]
                    }
                },
                setAuthorizationHeader: value => { this.tokenHeader = value },
                setContentType: value => { Vue.prototype.$http.defaults.headers.common['Content-Type'] = value },
                setPostContentType: value => { Vue.prototype.$http.defaults.headers.post['Content-Type'] = value },
                setValidateStatus: value => { Vue.prototype.$http.defaults.validateStatus = value },
                setResponseType: value => { Vue.prototype.$http.defaults.responseType = value },
                setWithCredentials: value => { Vue.prototype.$http.defaults.withCredentials = value },
                setBaseURL: value => { Vue.prototype.$http.defaults.baseURL = value },
                setTimeout: value => { Vue.prototype.$http.defaults.timeout = value }
            }
        }

        HttpClient.prototype = Vue.prototype.$http = Object.assign(helper, Axios, Axios.create(Object.assign(config, axiosConfig || {})))
        if (store) {
            store.http = Vue.prototype.$http
        }
    },
    tokenHeader: 'Bearer',
    requestHeaderName: 'Authorization',
    ignorePermissionVerify: data => data,
}

export { Vue, HttpClient, Axios }