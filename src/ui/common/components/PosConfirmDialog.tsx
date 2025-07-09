import '../stylesheets/PosConfirmDialog.css';
import { useRef } from 'react';
import { MdOutlineCancel, MdOutlineCheck } from "react-icons/md";
import PosButton from './PosButton';

interface PosConfirmDialogProps {
  message: string;
  isShowed: boolean;
  onCancel: () => void;
  onOk: () => void;
}

function PosConfirmDialog(props: PosConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleCancel = () => {
    dialogRef.current?.close();
    props.onCancel();
  }

  if (props.isShowed) {
    dialogRef.current?.showModal();
  }

  const handleOk = () => {
    dialogRef.current?.close();
    props.onOk();
  };

  return (
    <dialog className="message-container" ref={dialogRef}>
      <p className="message">{props.message}</p>
      <div className="buttons-container">
        <PosButton
          className="cancel-button"
          icon={<MdOutlineCancel />}
          label="Cancelar"
          onClick={handleCancel} />
        <PosButton
          label="Aceptar"
          icon={<MdOutlineCheck />}
          onClick={handleOk} />
      </div>
    </dialog>
  );
}

export default PosConfirmDialog;