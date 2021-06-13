import Vue from "vue"
import Axios from 'axios'

const HttpClient = {
    install(Vue, ...options) {
        let [interceptors, axiosConfig] = options

        let helper = {}

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
            validateStatus: this.validateStatus,
            transformResponse: [this.transformResponse],
            transformRequest: [this.transformRequest]
        }

        const token = window.sessionStorage.getItem(this.sessionKey) || ''
        if (token) {
            config.headers.common[this.requestHeaderName] = (this.tokenHeader ? this.tokenHeader + ' ' : '') + token
        }

        helper = {
            getAuthorization: () => {
                return Vue.prototype.$http.defaults.headers.common[this.requestHeaderName] || ''
            },
            setAuthorization: token => {
                if (token) {
                    window.sessionStorage.setItem(this.sessionKey, token)
                    Vue.prototype.$http.defaults.headers.common[this.requestHeaderName] = (this.tokenHeader ? this.tokenHeader + ' ' : '') + token
                } else {
                    window.sessionStorage.removeItem(this.sessionKey)
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

        HttpClient.prototype = Vue.http = Vue.prototype.$http = Object.assign(helper, Axios, Axios.create(Object.assign(config, axiosConfig || {})))
    },
    sessionKey: '__TOKEN__',
    tokenHeader: 'Bearer',
    requestHeaderName: 'Authorization',
    ignorePermissionVerify: data => data,
    validateStatus: status => status >= 200 && status <= 300,
    transformRequest: data => {
        if (typeof data !== 'object') {
            data = {}
        }
        return data instanceof FormData ? data : JSON.stringify(data)
    },
    transformResponse: data => {
        if (typeof data === 'string') {
            data = JSON.parse(data)
        }
        if (typeof interceptors === 'function') {
            return interceptors(data)
        } else {
            throw new Error('[Axios Error]: Install error')
        }
    }
}

export { Vue, HttpClient, Axios }