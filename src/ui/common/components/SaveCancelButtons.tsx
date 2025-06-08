import '../stylesheets/SaveCancelButtons.css';
import PosButton from './PosButton';
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";

interface SaveCancelButtonsProps {
  onSave: () => void;
  onCancel: () => void;
}

function SaveCancelButtons(props: SaveCancelButtonsProps) {
  return (
    <div className="buttons-container">
      <PosButton
        className="cancel-button"
        icon={<MdOutlineCancel />}
        label="Cancelar"
        onClick={props.onCancel} />
      <PosButton
        icon={<FiSave />}
        label="Guardar"
        onClick={props.onSave} />
    </div>
  );
}

export default SaveCancelButtons;