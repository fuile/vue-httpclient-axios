"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Axios", {
  enumerable: true,
  get: function get() {
    return _axios["default"];
  }
});
exports.HttpClient = void 0;
Object.defineProperty(exports, "Vue", {
  enumerable: true,
  get: function get() {
    return _vue["default"];
  }
});
var _vue = _interopRequireDefault(require("vue"));
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var HttpClient = exports.HttpClient = {
  install: function install(Vue) {
    var _this = this;
    for (var _len = arguments.length, options = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      options[_key - 1] = arguments[_key];
    }
    var store = options[0],
      interceptors = options[1],
      sessionKey = options[2],
      axiosConfig = options[3];
    var helper = {};
    if (!sessionKey) {
      sessionKey = '__TOKEN__';
    }
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
        post: {
          'Content-Type': 'application/json'
        },
        put: {
          'Content-Type': 'application/json'
        }
      },
      responseType: 'json',
      validateStatus: function validateStatus(status) {
        return status >= 200 && status <= 300;
      },
      transformResponse: [function (data) {
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (typeof interceptors === 'function') {
          return interceptors(data);
        } else {
          throw new Error('[Axios Error]: Install error');
        }
      }],
      transformRequest: [function (data) {
        if (_typeof(data) !== 'object') {
          data = {};
        }
        return data instanceof FormData ? data : JSON.stringify(data);
      }]
    };
    var token = window.sessionStorage.getItem(sessionKey) || '';
    if (token) {
      config.headers.common[this.requestHeaderName] = (this.tokenHeader ? this.tokenHeader + ' ' : '') + token;
    }
    if (store) {
      helper = {
        getResponseData: function getResponseData(res) {
          return res.data;
        },
        getAuthorization: function getAuthorization() {
          return Vue.prototype.$http.defaults.headers.common[_this.requestHeaderName] || '';
        },
        setAuthorization: function setAuthorization(token) {
          if (token) {
            window.sessionStorage.setItem(sessionKey, token);
            Vue.prototype.$http.defaults.headers.common[_this.requestHeaderName] = (_this.tokenHeader ? _this.tokenHeader + ' ' : '') + token;
          } else {
            window.sessionStorage.removeItem(sessionKey);
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
    }
    HttpClient.prototype = Vue.prototype.$http = Object.assign(helper, _axios["default"], _axios["default"].create(Object.assign(config, axiosConfig || {})));
    if (store) {
      store.http = Vue.prototype.$http;
    }
  },
  tokenHeader: 'Bearer',
  requestHeaderName: 'Authorization',
  ignorePermissionVerify: function ignorePermissionVerify(data) {
    return data;
  }
};
