import { Modal ,ModalProps} from "antd";

function InteractionModal(props:ModalProps) {
    return (
        <Modal {...props}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
}

export default InteractionModal;