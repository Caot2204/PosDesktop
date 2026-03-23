import '../stylesheets/PosConfirmDialog.css';
import { useRef } from 'react';
import { MdOutlineCancel, MdOutlineCheck } from "react-icons/md";
import PosButton from './PosButton';
import { useTranslation } from 'react-i18next';

interface PosConfirmDialogProps {
  message: string;
  isShowed: boolean;
  notShowCancelButton?: boolean;
  onCancel: () => void;
  onOk: () => void;
}

function PosConfirmDialog(props: PosConfirmDialogProps) {
  const { t } = useTranslation('global');
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
        {
          props.notShowCancelButton ?
            <></>
            :
            <PosButton
              className="cancel-button"
              icon={<MdOutlineCancel />}
              label={t('buttons.cancel')}
              onClick={handleCancel} />
        }
        <PosButton
          label={t('buttons.accept')}
          icon={<MdOutlineCheck />}
          onClick={handleOk} />
      </div>
    </dialog>
  );
}

export default PosConfirmDialog;