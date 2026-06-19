import { create } from "zustand";
import { EventDetails, EventListFilter } from "../Services/Event/EventService";

interface EventState {
    eventList: any[];
    loading: boolean;
    error: any;
    fetchEventList: (payload: any) => Promise<any>;
    eventDetails: any;
    fetchEventDetails: (payload: any) => Promise<any>;
}

export const useEventStore = create<EventState>((set) => ({
    eventList: [],
    eventDetails: null,
    loading: false,
    error: null,

    // ----------------------- Event List  -----------------------

    fetchEventList: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await EventListFilter(payload);
            set({
                eventList: response?.result || [],
            });
            return response?.result;
        } catch (error: any) {
            set({ error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    fetchEventDetails: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await EventDetails(payload);
            set({ eventDetails: response?.result });
            return response;
        } catch (error: any) {
            set({ error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));
