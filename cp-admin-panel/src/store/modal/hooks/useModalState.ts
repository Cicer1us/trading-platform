import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from 'src/store/hooks/reduxHooks';
import { showModal, closeModal as closeModalAction } from '../slice';
import { OpenModalInput } from '../types';

type UseModalStateResult = {
  openModal: (modalType: OpenModalInput) => void;
  closeModal: () => void;
  currentModal: OpenModalInput | null;
};

export function useModalState(): UseModalStateResult {
  const currentModal = useAppSelector(({ modal }) => modal.currentModal);

  const dispatch = useAppDispatch();

  const openModal = useCallback(
    (modalInput: OpenModalInput) => {
      dispatch(showModal(modalInput));
    },
    [dispatch]
  );

  const closeModal = useCallback(() => {
    dispatch(closeModalAction());
  }, [dispatch]);

  return {
    currentModal,
    openModal,
    closeModal
  };
}
