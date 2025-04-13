// store/spinnerStore.ts
import { create } from "zustand";

type SpinnerState = {
  loading: boolean;
  show: () => void;
  hide: () => void;
};

export const useSpinner = create<SpinnerState>((set) => ({
  loading: false,
  show: () => set({ loading: true }),
  hide: () => set({ loading: false }),
}));
