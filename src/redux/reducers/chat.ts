import { createSlice } from "@reduxjs/toolkit";
import { ALERT } from "../../utils/event";
import { StoreItemInStoreage } from "../../utils/Fetures";

export interface AlertMessage {
  chatId: string;
  count: number;
}

const initialState = {
  AlertMessage:
    StoreItemInStoreage({ key: ALERT, get: "get" }) || ([] as AlertMessage[]), // Typing the array correctly
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAlertMessage(state, action) {
      const { chatId } = action.payload;

      // Check if the chatId already exists in the AlertMessage array
      const existingAlert = state.AlertMessage.find(
        (alert) => alert.chatId === chatId
      );

      if (existingAlert) {
        // If the alert exists, increment its count
        existingAlert.count += 1;
      } else {
        // If the alert doesn't exist, add it with a count of 1
        state.AlertMessage.push({ chatId, count: 1 });
      }
    },

    resetAlertMessage(state, action) {
      state.AlertMessage = state.AlertMessage.filter(
        (alert) => alert.chatId !== action.payload
      );
    },
  },
});

export const { setAlertMessage, resetAlertMessage } = chatSlice.actions;
export default chatSlice.reducer;
