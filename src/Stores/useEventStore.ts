import { create } from "zustand";
import { EventListFilter } from "../Services/Event/EventService";

interface EventState {
    eventList: any[];
    loading: boolean;
    error: any;
    fetchEventList: (payload: any) => Promise<any>;
}

export const useEventStore = create<EventState>((set) => ({
    eventList: [],
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
            return response;
        } catch (error: any) {
            set({ error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));
