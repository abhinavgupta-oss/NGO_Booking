import { create } from "zustand";
import { DevoteemyProfile } from "../Services/Devotee/DevoteeServices";

interface ProfileStore {
    myProfile: any[];
    loading: boolean;
    error: any;
    fetchMyprofile: () => Promise<any>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    myProfile: [],
    loading: false,
    error: null,

    fetchMyprofile: async () => {
        try {
            set({ loading: true, error: null });
            const response = await DevoteemyProfile();
            set({
                myProfile: response?.result || [],
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
