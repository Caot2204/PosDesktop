import { useRef } from "react";
import PosButton from "../../../ui/common/components/PosButton";

interface CotizationShareDialogProps {
  isShowed: boolean;
  onExportPdf: () => void;
  onEmailShare: () => void;
}

function CotizationShareDialog(props: CotizationShareDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (props.isShowed) {
    dialogRef.current?.showModal();
  }

  const handleExportPdf = () => {
    dialogRef.current?.close();
    props.onExportPdf();
  }

  const handleEmailShare = () => {
    dialogRef.current?.close();
    props.onEmailShare();
  }

  return (
    <dialog className="message-container" ref={dialogRef}>
      <p className="message">¿Desea compartir la cotización?</p>
      <div className="buttons-container">
        <PosButton
          className="sharepdf-button"
          label="Exportar PDF"
          onClick={handleExportPdf} />
        <PosButton
          className="shareemail-button"
          label="Enviar por correo"
          onClick={handleEmailShare} />
      </div>
    </dialog>
  );
}

export default CotizationShareDialog;