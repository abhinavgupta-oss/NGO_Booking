import { create } from "zustand";
import { DonationListFilter } from "../Services/Donation/DonationService";

interface DonationState {
    donationList: any[];
    loading: boolean;
    error: any;
    fetchDonationList: (payload: any) => Promise<any>;
}

export const useDonationStore = create<DonationState>((set) => ({
    donationList: [],
    loading: false,
    error: null,

    // ----------------------- Donation List  -----------------------

    fetchDonationList: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await DonationListFilter(payload);
            set({
                donationList: response?.result || [],
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
