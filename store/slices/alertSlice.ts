import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
  id: string;
  type: string;
  message: string;
  location?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'resolved';
}

interface AlertState {
  alerts: Alert[];
}

const initialState: AlertState = {
  alerts: [
    {
      id: '1',
      type: 'SOS',
      message: 'Emergency: I need help!',
      location: 'Latitude: 6.7106, Longitude: 79.9074',
      timestamp: '2023-06-15T14:30:00Z',
      status: 'resolved'
    },
    {
      id: '2',
      type: 'Alert',
      message: 'I feel unsafe in this area',
      location: 'Latitude: 6.7106, Longitude: 79.9074',
      timestamp: '2023-06-20T18:45:00Z',
      status: 'sent'
    }
  ],
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    sendAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.push(action.payload);
    },
    updateAlertStatus: (state, action: PayloadAction<{ id: string; status: 'sent' | 'delivered' | 'resolved' }>) => {
      const { id, status } = action.payload;
      const alert = state.alerts.find(alert => alert.id === id);
      if (alert) {
        alert.status = status;
      }
    },
    deleteAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
  },
});

export const { sendAlert, updateAlertStatus, deleteAlert } = alertSlice.actions;
export default alertSlice.reducer;