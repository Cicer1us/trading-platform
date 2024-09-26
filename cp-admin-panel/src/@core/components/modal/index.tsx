import { useModalState } from 'src/store/modal/hooks/useModalState';
import { ModalType } from 'src/store/modal/types';
import { AddEndpointModal } from './AddEndpointModal';
import { SharedSecretModal } from './SharedSecretModal';
import { ConnectWalletModal } from './ConnectWalletModal';
import { WalletAddressModal } from './WalletAddressModal';
import { SetupTwoFactorAuthModal } from './SetupTwoFactorAuthModal';
import { StyledModal } from './styled';

const modalComponents = {
  [ModalType.MERCHANT_ADD_ENDPOINT]: AddEndpointModal,
  [ModalType.MERCHANT_SHARED_SECRET]: SharedSecretModal,
  [ModalType.MERCHANT_WALLET_ADDRESS]: WalletAddressModal,
  [ModalType.PAYMENT_CONNECT_WALLET]: ConnectWalletModal,
  [ModalType.SETUP_TWO_FACTOR_AUTH]: SetupTwoFactorAuthModal
};

interface ModalContainerProps {
  modalProps?: any;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ modalProps }) => {
  const { currentModal, closeModal } = useModalState();

  const Modal = currentModal ? modalComponents[currentModal.modalType] : null;

  return (
    <StyledModal open={!!currentModal} onClose={closeModal}>
      <>{Modal && <Modal {...modalProps} />}</>
    </StyledModal>
  );
};
