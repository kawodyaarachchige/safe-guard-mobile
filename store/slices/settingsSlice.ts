import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  pushNotifications: boolean;
  soundAlerts: boolean;
  vibration: boolean;
  locationTracking: boolean;
  autoSOS: boolean;
  language: string;
  theme: 'light' | 'dark';
}

const initialState: SettingsState = {
  pushNotifications: true,
  soundAlerts: true,
  vibration: true,
  locationTracking: true,
  autoSOS: false,
  language: 'en',
  theme: 'light',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
    resetSettings: () => {
      return initialState;
    },
  },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;