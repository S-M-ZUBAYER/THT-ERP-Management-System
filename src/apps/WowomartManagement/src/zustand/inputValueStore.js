import { create } from "zustand";

const useStore = create((set) => ({
  inputValue: [],

  addInputValue: (newString) =>
    set((state) => ({
      inputValue: [...state.inputValue, newString],
    })),

  clearInputValues: () => set({ inputValue: [] }),
  tag: "",
  setTag: (newTag) =>
    set({
      tag: newTag,
    }),
}));

export default useStore;
