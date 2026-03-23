import '../stylesheets/OkCancelButtons.css';
import PosButton from './PosButton';
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { useTranslation } from 'react-i18next';

interface OkCancelButtonsProps {
  labelForOkButton?: string;
  onSave: () => void;
  onCancel: () => void;
}

function OkCancelButtons(props: OkCancelButtonsProps) {
  const { t } = useTranslation('global');

  return (
    <div className="buttons-container">
      <PosButton
        className="cancel-button"
        icon={<MdOutlineCancel />}
        label={t('buttons.cancel')}
        onClick={props.onCancel} />
      <PosButton
        icon={<FiSave />}
        label={props.labelForOkButton ? props.labelForOkButton : t('buttons.save')}
        onClick={props.onSave} />
    </div>
  );
}

export default OkCancelButtons;