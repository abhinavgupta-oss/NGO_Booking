import { create } from "zustand";
import { DonationListFilter } from "../Services/Donation/DonationService";
import { DevoteemyDonation } from "../Services/Devotee/DevoteeServices";

interface DonationState {
    donationList: any[];
    MydonationList: any[];
    loading: boolean;
    error: any;

    fetchDonationList: (
        payload: any,
        isLoadMore?: boolean
    ) => Promise<any>;

    fetchMyDonationList: (
        payload: any,
        isLoadMore?: boolean
    ) => Promise<any>;

    clearMyDonationList: () => void;
}

export const useDonationStore = create<DonationState>((set) => ({
    donationList: [],
    MydonationList: [],
    loading: false,
    error: null,

    // ---------------- Donation List ----------------

    fetchDonationList: async (
        payload,
        isLoadMore = false
    ) => {
        try {
            set({ loading: true, error: null });

            const response = await DonationListFilter(payload);

            set((state) => ({
                donationList: isLoadMore
                    ? [
                        ...state.donationList,
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

    // ---------------- My Donation List ----------------

    fetchMyDonationList: async (
        payload,
        isLoadMore = false
    ) => {
        try {
            set({ loading: true, error: null });

            const response = await DevoteemyDonation(payload);

            set((state) => ({
                MydonationList: isLoadMore
                    ? [
                        ...state.MydonationList,
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

    clearMyDonationList: () => {
        set({
            MydonationList: [],
        });
    },
}));