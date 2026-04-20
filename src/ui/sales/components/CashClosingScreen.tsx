import '../stylesheets/CashClosingScreen.css';
import { useEffect, useRef, useState } from 'react';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';
import OkCancelButtons from '../../common/components/OkCancelButtons';
import { showErrorNotify, showSuccessNotify } from '../../utils/NotifyUtils';
import PosConfirmDialog from '../../common/components/PosConfirmDialog';
import { useTranslation } from 'react-i18next';

interface CashClosingScreenProps {
  isShowed: boolean;
  currentUser: string;
  onClose: () => void;
}

function CashClosingScreen(props: CashClosingScreenProps) {
  const { t } = useTranslation('global');
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
          showSuccessNotify(t('screens.cashClosings.cashClosingOk'));
          props.onClose();
        } catch (error) {
          console.log(error);
          showErrorNotify(t('screens.cashClosings.errorCashClosing'));
        }
      }
    }
  };

  useEffect(() => {
    if (props.isShowed) {
      window.saleAPI?.getSalesByDate(new Date()).then(sales => {
        const salesOfCurrentUser = sales.filter(sale => sale.userToGenerateSale === props.currentUser);
        let tempTotal = 0.0;
        salesOfCurrentUser.forEach(sale => {
          tempTotal += sale.totalSale;
        });
        setTotalOfDay(tempTotal);
      });
    }
    if (physicalMoneyInputRef.current) {
      physicalMoneyInputRef.current.value = "";
      physicalMoneyInputRef.current.focus();
    }
  }, [props.isShowed]);

  return (
    <div className="cash-closing-container">
      <h2>{t('screens.cashClosings.title')}</h2>
      <p><strong>{t('screens.cashClosings.saleOfDayLabel')}</strong>&emsp;&ensp;{formatNumberToCurrentPrice(totalOfDay)}</p>
      <div className="physicalmoney-input">
        <p><strong>{t('screens.cashClosings.moneyOnCashLabel')}</strong></p>
        <input type="number" ref={physicalMoneyInputRef} onChange={(e) => setPhysicalMoney(Number(e.target.value))} />
      </div>
      <OkCancelButtons
        labelForOkButton={t('buttons.accept')}
        onCancel={props.onClose}
        onSave={handleCashClosing} />
      <PosConfirmDialog
        message={t('screens.cashClosings.diffMoney')}
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