import BaseService from "../BasicServices/BassicService";
import { API } from "../BasicServices/endpoints";

export const EventListFilter = async (payload: any) => {
    try {
        console.log(" EventListFilter payload", payload);
        const response = await BaseService.post(API.EVENT.EVENT_LIST, payload);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};
