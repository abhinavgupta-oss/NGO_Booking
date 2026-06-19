import AppEnvironment from "../../utility/AppEnvironment";
import BaseService from "../BasicServices/BassicService";
import { API } from "../BasicServices/endpoints";

export const ForgetPasswordSendOTP = async (payload: any) => {
    try {
        console.log(" EventListFilter payload", payload);
        const response = await BaseService.post(API.AUTH_URL.FORGET_PASSWORD, payload);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const ForgetVerifySendOTP = async (payload: any) => {
    try {
        console.log(" EventListFilter payload", payload);
        const response = await BaseService.post(API.AUTH_URL.FORGET_VERIFY_OTP, payload);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const ForgetReSendOTP = async (payload: any) => {
    try {
        console.log(" ForgetReSendOTP payload", payload);
        const response = await BaseService.post(API.AUTH_URL.FORGET_RESEND_OTP, payload);
        console.log("ForgetReSendOTP",response)
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const ForgetResetPass = async (payload: any) => {
    try {
        console.log(" ForgetReSendOTP payload", payload);
        const response = await BaseService.post(API.AUTH_URL.FORGET_RESET_PASS, payload);
        console.log("ForgetReSendOTP",response)
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

