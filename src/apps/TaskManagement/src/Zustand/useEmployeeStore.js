import { create } from "zustand";

const useEmployeeStore = create((set) => ({
  adminData: [],
  userData: [],
  setAdminData: (Data) => set({ adminData: Data }),
  setUserData: (Data) => set({ userData: Data }),
}));

export default useEmployeeStore;
