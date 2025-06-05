import { create } from 'zustand';

const useAlertStore = create((set) => ({
  Alert: {
    message: '',
    severity: 'success',
    isOpen: false,
  },
  handleAlert: (Alert) => set({ Alert }),
}));

export default useAlertStore;
