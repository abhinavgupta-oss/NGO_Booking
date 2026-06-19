import { create } from "zustand";

import {
    BookingRoomDetails,
    BookingRoomList,
    myBookingDetails,
    myRoomBooking
} from "../Services/Booking/BookingService";

interface BookingState {
    roomList: any[];
    myBookingList: any[];
    loading: boolean;
    error: any;
    fetchRoomList: (payload: any) => Promise<any>;
    roomDetails: any;
    fetchRoomDetails: (payload: any) => Promise<any>;
    fetchMyBookingList: (
        payload: any,
        isLoadMore?: boolean
    ) => Promise<any>;
    fetchMyBookingDetails: (payload: any) => Promise<any>;
    BookingmyDetails: any;

}

export const useBookingStore = create<BookingState>((set) => ({

    roomList: [],
    myBookingList: [],
    BookingmyDetails:null,
    roomDetails: null,
    loading: false,
    error: null,

    // ----------------------- Room List -----------------------

    fetchRoomList: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await BookingRoomList(payload);
            set({
                roomList: [...(response?.result || [])],
            });
            return response;
        } catch (error: any) {
            set({ error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    fetchRoomDetails: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await BookingRoomDetails(payload);
            console.log("Room Details in Store:", response);
            set({ roomDetails: response?.result });
            return response?.result;
        } catch (error: any) {
            set({ error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    fetchMyBookingList: async (
        payload,
        isLoadMore = false
    ) => {
        try {
            set({ loading: true, error: null });

            const response = await myRoomBooking(payload);

            set((state) => ({
                myBookingList: isLoadMore
                    ? [
                        ...state.myBookingList,
                        ...(response?.result || []),
                    ]
                    : response?.result || [],
            }));

            return response;
        } catch (error: any) {
            set({ error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    clearMyBookingList: () => {
        set({
            myBookingList: [],
        });
    },

    fetchMyBookingDetails: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await myBookingDetails(payload);
            console.log("Room Details in Store:", response);
            set({ BookingmyDetails: response?.result });
            return response?.result;
        } catch (error: any) {
            set({ error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },


}));