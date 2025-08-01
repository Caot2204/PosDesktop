import '../stylesheets/CashClosingScreen.css';
import { useEffect, useRef, useState } from 'react';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';
import OkCancelButtons from '../../common/components/OkCancelButtons';
import { showErrorNotify, showSuccessNotify } from '../../utils/NotifyUtils';
import PosConfirmDialog from '../../common/components/PosConfirmDialog';

interface CashClosingScreenProps {
  isShowed: boolean;
  currentUser: string;
  onClose: () => void;
}

function CashClosingScreen(props: CashClosingScreenProps) {
  const physicalMoneyInputRef = useRef<HTMLInputElement>(null);

  const [totalOfDay, setTotalOfDay] = useState(0.0);
  const [physicalMoney, setPhysicalMoney] = useState(0.0);
  const [openDialog, setOpenDialog] = useState<'confirmDialog' | null>(null);

  const handleCashClosing = () => {
    if (physicalMoney > 0.0) {
      if (physicalMoney !== totalOfDay) {
        setOpenDialog("confirmDialog");
      } else {
        try {
          window.cashClosingAPI?.saveCashClosing(
            physicalMoney,
            totalOfDay,
            props.currentUser
          );
          showSuccessNotify("Corte de caja realizado");
          props.onClose();
        } catch (error) {
          console.log(error);
          showErrorNotify("Error al realizar el corte de caja, inténtelo de nuevo");
        }
      }
    }
  };

  useEffect(() => {
    window.saleAPI?.getSalesByDate(new Date()).then(sales => {
      const salesOfCurrentUser = sales.filter(sale => sale.userToGenerateSale === props.currentUser);
      let tempTotal = 0.0;
      salesOfCurrentUser.forEach(sale => {
        tempTotal += sale.totalSale;
      });
      setTotalOfDay(tempTotal);
    });
    if (physicalMoneyInputRef.current) {
      physicalMoneyInputRef.current.value = "";
      physicalMoneyInputRef.current.focus();
    }
  }, [props.isShowed]);

  return (
    <div className="cash-closing-container">
      <h2>Corte de caja</h2>
      <p><strong>Venta del día:</strong>&emsp;&ensp;{formatNumberToCurrentPrice(totalOfDay)}</p>
      <div className="physicalmoney-input">
        <p><strong>Dinero en caja: </strong></p>
        <input type="number" ref={physicalMoneyInputRef} onChange={(e) => setPhysicalMoney(Number(e.target.value))} />
      </div>
      <OkCancelButtons
        labelForOkButton="Aceptar"
        onCancel={props.onClose}
        onSave={handleCashClosing} />
      <PosConfirmDialog
        message="El dinero físico no coincide con el total de la ventas, ¿Desea continuar?"
        isShowed={openDialog === "confirmDialog"}
        onCancel={() => {
          setOpenDialog(null);
          physicalMoneyInputRef.current?.focus();
        }}
        onOk={() => {
          setOpenDialog(null);
          handleCashClosing();
        }} />
    </div>
  );
}

export default CashClosingScreen;