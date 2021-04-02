# vue-httpclient-axios
The Wrapper for integrating Axios into vue

## Usage

### Install

```
    npm i vue-httpclient-axios
```

### Register plugin
- Options explain
    - null do not set option

```js

Vue.use(
    HttpClient,
    Vuex, // Vuex object
    interceptors, // interceptors
    axiosConfig // Axios config option
 )

```

```js

import {
    HttpClient,
    Axios // Axios object
} from 'vue-httpclient-axios'

Vue.use(HttpClient) // The ignorepermissionverify method is used by default

// custom
Vue.use(HttpClient, store, data => {
    if (data.status == 401) {
        // Unauthenticated
        //  return
    }

    else if (data.code == 403) {
        // NoPermissions
        //  return
    }

    return data
})

// In Vue
this.$http
// ...

// In Vuex
this.http
// ...

```

## Method

- HttpClient
    - sessionKey: '__TOKEN__',
    - tokenHeader: 'Bearer',
    - requestHeaderName: 'Authorization',
    - ignorePermissionVerify(data);

- this.$http and this.http
    - getAuthorization()
    - setAuthorization(value: string)
    - setAuthorizationHeader(value: string)
    - setContentType(value: string)
    - setPostContentType(value: string)
    - setValidateStatus(value: ((status: number) => boolean) | null)
    - setResponseType(value: string)
    - setWithCredentials(value: boolean)
    - setBaseURL(value: string)
    - setTimeout(value: number)

