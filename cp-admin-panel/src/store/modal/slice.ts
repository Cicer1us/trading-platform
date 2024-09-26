import { OpenModalInput } from './types';
import { createSlice } from '@reduxjs/toolkit';

export interface ModalState {
  currentModal: OpenModalInput | null;
}

const initialState: ModalState = {
  currentModal: null
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state: ModalState, { payload }: { payload: OpenModalInput }) => {
      state.currentModal = payload;
    },
    closeModal: (state: ModalState) => {
      state.currentModal = null;
    }
  }
});

export const { showModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
