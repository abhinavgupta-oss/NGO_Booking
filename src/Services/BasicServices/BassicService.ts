import axios, {
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

import * as Keychain from "react-native-keychain";

import { API } from "./endpoints";


// ==========================================
// TYPES
// ==========================================

interface AuthData {
  token: string;

  refreshToken: string;

  tokenExpiry: string;

  isLoginActive: boolean;

  loginTime: number;
}


// ==========================================
// AXIOS INSTANCE
// ==========================================

const instance = axios.create({
  baseURL: API.BASE_URL.DEV_URL,

  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// REQUEST INTERCEPTOR
// ADD TOKEN IN HEADER
// ==========================================

instance.interceptors.request.use(
  async (config) => {
    try {

      const credentials =
        await Keychain.getGenericPassword();

      if (credentials?.password && config.headers) {

        // Parse stored auth object
        const authData: AuthData =
          JSON.parse(credentials.password);

        // Check token expiry
        const currentTime = Date.now();

        const expiryTime =
          new Date(authData.tokenExpiry).getTime();

        const isTokenValid =
          currentTime < expiryTime;

        if (isTokenValid) {

          config.headers.Authorization =
            `Bearer ${authData.token}`;

        } else {

          // Token expired
          await Keychain.resetGenericPassword();

          console.log("Token Expired");
        }
      }

    } catch (error) {

      console.log(
        "Token Fetch Error:",
        error
      );
    }

    return config;
  },

  (error) => Promise.reject(error)
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

instance.interceptors.response.use(

  (response) => response,

  async (error) => {

    const errorMessage =
      error?.response?.data?.Message ||
      error?.response?.data?.message ||
      "Something went wrong";

    error.customMessage = errorMessage;

    // Auto logout if unauthorized
    if (error?.response?.status === 401) {

      await Keychain.resetGenericPassword();

      console.log("Unauthorized - Logged Out");
    }

    return Promise.reject(error);
  }
);


// ==========================================
// BASE SERVICE
// ==========================================

const BaseService = {

  // ======================================
  // GET API
  // ======================================

  get: async <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {

    // console.log(
    //   "GET =>",
    //   API.BASE_URL.DEV_URL + url
    // );

    const response: AxiosResponse<T> =
      await instance.get(url, config);

    return response.data;
  },


  // ======================================
  // POST API
  // ======================================

  post: async <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {

    console.log(
      "POST =>",
      API.BASE_URL.DEV_URL + url
    );

    const response: AxiosResponse<T> =
      await instance.post(
        url,
        data,
        config
      );

    return response.data;
  },


  // ======================================
  // PUT API
  // ======================================

  put: async <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {

    console.log(
      "PUT =>",
      API.BASE_URL.DEV_URL + url
    );

    const response: AxiosResponse<T> =
      await instance.put(
        url,
        data,
        config
      );

    return response.data;
  },


  // ======================================
  // DELETE API
  // ======================================

  delete: async <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {

    console.log(
      "DELETE =>",
      API.BASE_URL.DEV_URL + url
    );

    const response: AxiosResponse<T> =
      await instance.delete(
        url,
        config
      );

    return response.data;
  },
};

export default BaseService;