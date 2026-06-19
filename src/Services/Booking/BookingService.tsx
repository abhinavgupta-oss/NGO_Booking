import BaseService from "../BasicServices/BassicService";
import { API } from "../BasicServices/endpoints";


export const BookingRoomList = async (payload: any) => {
    try {
        console.log(" Room Search API payload", payload);
        const response = await BaseService.post(API.ROOMS.List, payload);
        console.log("Room booking Response:", response);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const BookingRoomDetails = async (payload: any) => {
    try {
        console.log(" Room Search API payload", payload);
        const response = await BaseService.get(API.ROOMS.DETAILS(payload));
        console.log("Room Destails Response:", response);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const RoomBookingRequest = async (payload: any) => {
    try {
        console.log("RoomBookingRequest API payload", payload);
        const response = await BaseService.post(API.ROOMS.BOOKING,payload);
        console.log("RoomBookingRequest Response:", response);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};

export const BookingPaymentUpdate = async (payload: any) => {
    try {
        console.log("BookingPaymentUpdate API payload", payload);
        const response = await BaseService.post(API.ROOMS.PAYMENT_BOOKING,payload);
        console.log("BookingPaymentUpdate Response:", response);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


// ================================== MY BOOKING =====================


export const myRoomBooking = async (payload: any) => {
    try {
        console.log("BookingPaymentUpdate API payload", payload);
        const response = await BaseService.post(API.ROOMS.MY_BOOKINGS,payload);
        console.log("BookingPaymentUpdate Response:", response);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const myBookingDetails = async (payload: any) => {
    try {
        console.log("BookingPaymentUpdate API payload", payload);
        const response = await BaseService.get(API.ROOMS.MY_BOOKINGS_DETAILS(payload));
        console.log("BookingPaymentUpdate Response:", response);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const myBookingPayment = async (payload: any) => {
    try {
        console.log("BookingPaymentUpdate API payload", payload);
        const response = await BaseService.post(API.ROOMS.PAYMENT_TRANSACTION,payload);
        console.log("BookingPaymentUpdate Response:", response);
        return response?.result;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const mybookingInvoice = async (payload: any) => {
    try {
        console.log("BookingPaymentUpdate API payload", payload);
        const response = await BaseService.get(API.ROOMS.PAYMENT_INVOICE(payload));
        console.log("BookingPaymentUpdate Response:", response);
        return response;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};


export const myBalancePayment = async (payload: any) => {
    try {
        console.log("BookingPaymentUpdate API payload", payload);
        const response = await BaseService.post(API.ROOMS.BALANCE_PAYMENT,payload);
        console.log("BookingPaymentUpdate Response:", response);
        return response?.result;
    } catch (error: any) {
        console.log(error)
        console.log(error?.customMessage)
        throw error;
    }
};






// ================= ROOM TYPES =================

export const getRoomTypes = async () => {
    try {

        const response = await BaseService.get(API.ROOMS.TYPE);
        console.log("Room Types", response);
        return response;

    } catch (error: any) {

        console.log(error);
        throw error;
    }
};