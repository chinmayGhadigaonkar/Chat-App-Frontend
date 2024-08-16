import { createSlice } from "@reduxjs/toolkit";

export interface AlertMessage {
  chatId: string;
  count: number;
}

const initialState = {
  AlertMessage: [] as AlertMessage[], // Typing the array correctly
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAlertMessage(state, action) {
      const { chatId, count } = action.payload;
      const index = state.AlertMessage.findIndex(
        (alert) => alert.chatId === chatId
      );
      if (index !== -1) {
        state.AlertMessage[index].count += 1; // Increment by the provided count
      } else {
        state.AlertMessage.push({ chatId, count });
      }
    },
  },
});

export const { setAlertMessage } = chatSlice.actions;
export default chatSlice.reducer;
