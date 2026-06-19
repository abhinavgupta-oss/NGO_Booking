import AppEnvironment from "../../utility/AppEnvironment";
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

export const GetOngoingEvents = async () => {
    try {
        let branchCode = AppEnvironment.BRANCH_CODE
        const response = await BaseService.get(
            API.EVENT.LIVE_EVENT,
            {
                params: {
                    branchCode,
                },
            }
        );

        return response;
    } catch (error: any) {
        throw error;
    }
};

export const EventDetails = async (payload: any) => {
    try {
        console.log(" EventListFilter payload", payload);
        const response = await BaseService.get(API.EVENT.EVENT_DETAILS(payload.eventId));
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

