'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Axios = exports.HttpClient = exports.Vue = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HttpClient = {
    install: function install(Vue) {
        var _this = this;

        for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            options[_key - 1] = arguments[_key];
        }

        var interceptors = options[0],
            axiosConfig = options[1];


        var helper = {};

        if (!interceptors) {
            interceptors = this.ignorePermissionVerify;
        }

        var config = {
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
        };

        var token = window.sessionStorage.getItem(this.sessionKey) || '';
        if (token) {
            config.headers.common[this.requestHeaderName] = (this.tokenHeader ? this.tokenHeader + ' ' : '') + token;
        }

        helper = {
            getAuthorization: function getAuthorization() {
                return Vue.prototype.$http.defaults.headers.common[_this.requestHeaderName] || '';
            },
            setAuthorization: function setAuthorization(token) {
                if (token) {
                    window.sessionStorage.setItem(_this.sessionKey, token);
                    Vue.prototype.$http.defaults.headers.common[_this.requestHeaderName] = (_this.tokenHeader ? _this.tokenHeader + ' ' : '') + token;
                } else {
                    window.sessionStorage.removeItem(_this.sessionKey);
                    delete Vue.prototype.$http.defaults.headers.common[_this.requestHeaderName];
                }
            },
            setAuthorizationHeader: function setAuthorizationHeader(value) {
                _this.tokenHeader = value;
            },
            setContentType: function setContentType(value) {
                Vue.prototype.$http.defaults.headers.common['Content-Type'] = value;
            },
            setPostContentType: function setPostContentType(value) {
                Vue.prototype.$http.defaults.headers.post['Content-Type'] = value;
            },
            setValidateStatus: function setValidateStatus(value) {
                Vue.prototype.$http.defaults.validateStatus = value;
            },
            setResponseType: function setResponseType(value) {
                Vue.prototype.$http.defaults.responseType = value;
            },
            setWithCredentials: function setWithCredentials(value) {
                Vue.prototype.$http.defaults.withCredentials = value;
            },
            setBaseURL: function setBaseURL(value) {
                Vue.prototype.$http.defaults.baseURL = value;
            },
            setTimeout: function setTimeout(value) {
                Vue.prototype.$http.defaults.timeout = value;
            }
        };

        this.prototype = Vue.http = Vue.prototype.$http = Object.assign(helper, _axios2.default, _axios2.default.create(Object.assign(config, axiosConfig || {})));
    },

    sessionKey: '__TOKEN__',
    tokenHeader: 'Bearer',
    requestHeaderName: 'Authorization',
    ignorePermissionVerify: function ignorePermissionVerify(data) {
        return data;
    },
    validateStatus: function validateStatus(status) {
        return status >= 200 && status <= 300;
    },
    transformRequest: function transformRequest(data) {
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
            data = {};
        }
        return data instanceof FormData ? data : JSON.stringify(data);
    },
    transformResponse: function transformResponse(data) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (typeof interceptors === 'function') {
            return interceptors(data);
        } else {
            throw new Error('[Axios Error]: Install error');
        }
    }
};

exports.Vue = _vue2.default;
exports.HttpClient = HttpClient;
exports.Axios = _axios2.default;
