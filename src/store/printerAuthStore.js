import { create } from "zustand";

const usePrinterAuthStore = create((set) => ({
    printerAuthLoading: false,

    setPrinterAuthLoading: (value) =>
        set({ printerAuthLoading: value }),

    startLoading: () =>
        set({ printerAuthLoading: true }),

    stopLoading: () =>
        set({ printerAuthLoading: false }),
}));

export default usePrinterAuthStore;