import '../stylesheets/OkCancelButtons.css';
import PosButton from './PosButton';
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";

interface OkCancelButtonsProps {
  labelForOkButton?: string;
  onSave: () => void;
  onCancel: () => void;
}

function OkCancelButtons(props: OkCancelButtonsProps) {
  return (
    <div className="buttons-container">
      <PosButton
        className="cancel-button"
        icon={<MdOutlineCancel />}
        label="Cancelar"
        onClick={props.onCancel} />
      <PosButton
        icon={<FiSave />}
        label={props.labelForOkButton ? props.labelForOkButton : "Guardar"}
        onClick={props.onSave} />
    </div>
  );
}

export default OkCancelButtons;