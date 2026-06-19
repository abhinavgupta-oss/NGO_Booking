import BaseService from "../BasicServices/BassicService";
import { API } from "../BasicServices/endpoints";


export const getAppdetails = async () => {
    try {
        // console.log(" logout payload");
        const response = await BaseService.get(API.AUTH_URL.APP_BUILD);
        return response?.result;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const logout = async () => {
    try {
        // console.log(" logout payload");
        const response = await BaseService.get(API.UTILS.LOG_OUT);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const GetCityList = async (payload: any) => {
    try {
        // console.log(" logout payload");
        const response = await BaseService.post(API.UTILS.CITY, payload);
        console.log("city:", response.result);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};
