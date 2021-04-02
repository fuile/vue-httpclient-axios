import { PluginObject } from "vue";
import { AxiosStatic } from "axios";

declare interface HttpClient<T> extends PluginObject<T> {
    sessionKey: string;
    tokenHeader: string;
    requestHeaderName: string;
    ignorePermissionVerify(data?: any): any;
}

declare module "axios" {
    interface AxiosStatic {
        getAuthorization(): string;
        setAuthorization(token: string): void;
        setAuthorizationHeader(value: string): void;
        setContentType(value: string): void;
        setPostContentType(value: string): void;
        setValidateStatus(value: ((status: number) => boolean) | null): void;
        setResponseType(value: string): void;
        setWithCredentials(value: number): void;
        setBaseURL(value: string): void;
        setTimeout(value: number): void;
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $http: AxiosStatic;
    }
}

declare module "vuex/types" {
    interface Store<S> {
        http: AxiosStatic;
    }
}

declare var Axios: AxiosStatic;
declare var HttpClient: HttpClient<any>;