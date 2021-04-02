import Axios from 'axios'
export { Axios }
export const HttpClient = {
    install(Vue, ...options) {
        let [store, interceptors, axiosConfig] = options

        let helper = {}

        if (!interceptors) {
            interceptors = this.ignorePermissionVerify
        }

        const transformResponse = data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (typeof interceptors === 'function') {
                return interceptors(data)
            } else {
                throw new Error('[Axios Error]: Install error')
            }
        }

        const transformRequest = data => {
            if (typeof data !== 'object') {
                data = {}
            }
            return data instanceof FormData ? data : JSON.stringify(data)
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
            transformResponse: [transformResponse],
            transformRequest: [transformRequest]
        }

        const token = window.sessionStorage.getItem(this.sessionKey) || ''
        if (token) {
            config.headers.common[this.requestHeaderName] = (this.tokenHeader ? this.tokenHeader + ' ' : '') + token
        }

        if (store) {
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
        }

        Vue.prototype.$http = Object.assign(helper, Axios, Axios.create(Object.assign(config, axiosConfig || {})))

        if (store) {
            store.http = Vue.prototype.$http
        }
    },
    sessionKey: '__TOKEN__',
    tokenHeader: 'Bearer',
    requestHeaderName: 'Authorization',
    ignorePermissionVerify: data => data
}