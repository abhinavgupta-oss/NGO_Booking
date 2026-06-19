import BaseService from "../BasicServices/BassicService";
import { API } from "../BasicServices/endpoints";
import { saveAuthData } from "../../Stores/AuthStore/AuthStorage";

export const DevoteeSendOTP = async (payload: any) => {
    try {
        console.log(" deviceManagerLogin payload", payload);
        const response = await BaseService.post(API.AUTH_URL.DEVOTEE_SEND_OTP, payload);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const DevoteeLogin = async (payload: any) => {
    try {
        console.log(" deviceManagerLogin payload", payload);
        const response = await BaseService.post(API.AUTH_URL.DEVOTEE_LOGIN, payload);
        console.log("reporst", response)
        if (response?.result?.token) {
            console.log("in serverside",response?.result)
            await saveAuthData(response?.result);
            await DevoteemyProfile()
        }
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const DevoteeLoginwithPass = async (payload: any) => {
    try {
        console.log(" deviceManagerLogin payload", payload);
        const response = await BaseService.post(API.AUTH_URL.DEVOTEE_LOGIN_WITHPASS, payload);
        console.log("reporst", response)
        if (response?.result?.token) {
            console.log("in serverside",response?.result)
            await saveAuthData(response?.result);
            await DevoteemyProfile()
        }
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const DevoteeRegister = async (payload: any) => {
    try {
        console.log(" DevoteeRegister payload", payload);
        const response = await BaseService.post(API.AUTH_URL.DEVOTEE_REGISTER, payload);
        console.log("reporst", response)
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const DevoteemyProfile = async () => {
    try {
        console.log(" deviceManagerLogin payload");
        const response = await BaseService.get(API.AUTH_URL.MY_PROFILE);
        console.log("reporst", response)
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const DevoteeUpdateProfile = async (UserId:string,payload:any) => {
    try {
        console.log(" deviceManagerLogin payload");
        const response = await BaseService.put(API.AUTH_URL.UPDATE_PROFILE(UserId),payload);
        console.log("reporst", response)
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};





export const DevoteemyDonation = async (payload:any) => {
    try {
        console.log(" deviceManagerLogin payload",payload);
        const response = await BaseService.post(API.DEVOTEE_INFO.DEVOTEE_MYDONATION,payload);
        console.log("reporst", response)
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

