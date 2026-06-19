import BaseService from "../BasicServices/BassicService";
import { API } from "../BasicServices/endpoints";

export const DonationListFilter = async (payload: any) => {
    try {
        console.log(" EventListFilter payload", payload);
        const response = await BaseService.post(API.DONATION.DONATION_LIST, payload);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const DonationPayment = async (payload: any) => {
    try {
        console.log(" EventListFilter payload", payload);
        const response = await BaseService.post(API.DONATION.DONATION_PAYMENT, payload);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const DonationPaymentVerify = async (payload: any) => {
    try {
        console.log(" EventListFilter payload", payload);
        const response = await BaseService.post(API.DONATION.DONATION_VERIFY, payload);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const DevoteeUpdateDetails = async (payload: any) => {
    try {
        console.log(" DevoteeUpdateDetails payload", payload);
        const response = await BaseService.put(API.DONATION.DEVOTEE_DETAILS_UPDATE, payload);
        console.log(response)
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const DevoteeInVoiceDetails = async (payload: any) => {
    try {
        console.log(" DevoteeUpdateDetails payload", payload);
        const response = await BaseService.get(API.DONATION.DONATION_INVOICE(payload));
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


