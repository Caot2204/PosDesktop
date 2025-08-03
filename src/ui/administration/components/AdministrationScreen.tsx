import '../stylesheets/AdministrationScreen.css';
import { useState } from 'react';
import PosButton from '../../common/components/PosButton';
import CashClosingsListScreen from './CashClosingsListScreen';
import { MdOutlineCancel } from 'react-icons/md';

function AdministrationScreen() {
  const [openDialog, setOpenDialog] = useState<'cashClosingDialog' | null>(null);

  return (
    <div className="administrationscreen-container">
      <h3>Ventas</h3>
      <PosButton
        label="Ver cortes de caja"
        onClick={() => setOpenDialog("cashClosingDialog")} />
      <hr />
      <dialog className="pos-dialog" open={openDialog === "cashClosingDialog"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <CashClosingsListScreen
          isShowed={openDialog === "cashClosingDialog"} />
      </dialog>
    </div>
  );
}

export default AdministrationScreen;