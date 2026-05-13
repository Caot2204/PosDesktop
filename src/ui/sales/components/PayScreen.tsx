import '../stylesheets/PayScreen.css';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel, MdOutlineCheck } from "react-icons/md";
import { BsTicketDetailed } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import PosButton from '../../common/components/PosButton';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';
import { showErrorNotify } from '../../utils/NotifyUtils';
import { useTranslation } from 'react-i18next';

interface PayScreenProps {
  isShowed: boolean;
  totalSale: number;
  onCancel: () => void;
  onPaySale: (paymentType: string, amountPayed: number, amountPayedWithCard: number | null, paymentFolio: string | null) => void;
}

function PayScreen(props: PayScreenProps) {
  const { t } = useTranslation('global');
  const paymentTypeOptionRef = useRef<HTMLOptionElement>(null);
  const paymentInputRef = useRef<HTMLInputElement>(null);
  const paymentWithCardRef = useRef<HTMLInputElement>(null);
  const paymentFolioRef = useRef<HTMLInputElement>(null);

  const [payAmount, setPayAmount] = useState(0.0);
  const [paymentType, setPaymentType] = useState("Efectivo");
  const [paymentFolio, setPaymentFolio] = useState<string | null>(null);
  const [payWithCard, setPayWithCard] = useState(0.0);
  const [readyForPay, setReadyForPay] = useState(true);

  const handlePayClicked = () => {
    if (paymentType === 'Efectivo') {
      if (payAmount >= props.totalSale) {
        props.onPaySale(paymentType, payAmount, payWithCard, paymentFolio);
      } else {
        showErrorNotify(t('screens.paySale.errorAmountMin'));
      }
    } else if (paymentType === 'Tarjeta') {
      if (paymentFolio && paymentFolio.length > 1) {
        props.onPaySale(paymentType, payAmount, payWithCard, paymentFolio);
      } else {
        showErrorNotify(t('screens.paySale.errorFolioTransaction'));
      }
    } else if (paymentType === 'Hibrido') {
      if ((paymentFolio && paymentFolio.length > 1) && ((payAmount + payWithCard) - props.totalSale) >= 0) {
        props.onPaySale(paymentType, payAmount, payWithCard, paymentFolio);
      } else {
        showErrorNotify(t('screens.paySale.errorPayHibrid'));
      }
    }
  };

  useEffect(() => {
    if (props.isShowed) {
      paymentInputRef.current?.focus();
    } else {
      if (paymentInputRef.current) {
        paymentInputRef.current.value = "";
      }
      if (paymentTypeOptionRef) {
        paymentTypeOptionRef.current.selected = true;
      }
      setPayAmount(0.0);
      setPayWithCard(0.0);
      setPaymentType("Efectivo");
      setPaymentFolio(null);
    }
  }, [props.isShowed]);

  useEffect(() => {
    if (paymentType === "Efectivo") {
      setReadyForPay(payAmount < props.totalSale);
    } else if (paymentType === "Tarjeta") {
      setReadyForPay(!paymentFolio || paymentFolio.length <= 1);
    } else if (paymentType === "Hibrido") {
      setReadyForPay(!paymentFolio || paymentFolio.length <= 1 || (payAmount + payWithCard) < props.totalSale);
    }
  }, [payAmount, payWithCard, paymentFolio, paymentType, props.totalSale, props.isShowed]);

  useEffect(() => {
    setPayAmount(0.0);
    setPayWithCard(0.0);
    setPaymentFolio(null);
    if (paymentInputRef.current) {
      paymentInputRef.current.value = "";
    }
    if (paymentFolioRef.current) {
      paymentFolioRef.current.value = "";
    }
    if (paymentWithCardRef.current) {
      paymentWithCardRef.current.value = "";
    }
  }, [paymentType]);

  return (
    <div className="payscreen-container">
      <h1>{t('screens.paySale.title')}</h1>
      <div className="payment-inputs">
        <select onChange={(e) => setPaymentType(e.target.value)}>
          <option value="Efectivo" ref={paymentTypeOptionRef}>{t('screens.paySale.cashLabel')}</option>
          <option value="Tarjeta">{t('screens.paySale.cardLabel')}</option>
          <option value="Hibrido">{t('screens.paySale.hibridLabel')}</option>
        </select>
        {
          paymentType === "Tarjeta" || paymentType === "Hibrido" ?
            <div className="payment-tarjeta-container">
              <BsTicketDetailed />
              <input
                ref={paymentFolioRef}
                autoFocus
                className="payamount-input"
                type="text"
                onChange={(e) => setPaymentFolio(e.target.value)}
                placeholder={t('screens.paySale.folioTransactionLabel')} />
              {
                paymentType === "Hibrido" ?
                  <>
                    <FaDollarSign className="payment-icon" />
                    <input
                      ref={paymentWithCardRef}
                      autoFocus
                      className="payamount-input"
                      type="number"
                      min={0}
                      onChange={(e) => setPayWithCard(Number(e.target.value))}
                      placeholder={t('screens.paySale.amountPayCashLabel')} />
                  </>
                  :
                  <></>
              }
            </div>
            :
            <></>
        }
        {
          paymentType === "Efectivo" || paymentType === "Hibrido" ?
            <div className="payamount-input-container">
              <FaDollarSign className="payment-icon" />
              <input
                ref={paymentInputRef}
                autoFocus
                className="payamount-input"
                type="number"
                min={0}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                placeholder={t('screens.paySale.amountPayLabel')} />
            </div>
            :
            <></>
        }
      </div>
      <div className="money-container">
        <div className="money-label">
          <span className="payment-label">{t('screens.paySale.totalLabel')}</span>
          <span className="total-sale-label">{formatNumberToCurrentPrice(props.totalSale)}</span>
        </div>
        {
          paymentType === "Tarjeta" ?
            <></>
            :
            <div className="money-label">
              <span className="payment-label">{t('screens.paySale.cambioLabel')}</span>
              <span className="cambio-label">{formatNumberToCurrentPrice(((payAmount + payWithCard) - props.totalSale) < 0 ? 0 : ((payAmount + payWithCard) - props.totalSale))}</span>
            </div>
        }
      </div>
      <div className="buttons-container">
        <PosButton
          className="cancel-button"
          icon={<MdOutlineCancel />}
          label={t('screens.paySale.cancelPayLabel')}
          onClick={props.onCancel} />
        <PosButton
          disabled={readyForPay}
          label={paymentType === "Tarjeta" ? t('screens.paySale.registerPayLabel') : t('screens.paySale.payLabel')}
          icon={<MdOutlineCheck />}
          onClick={handlePayClicked} />
      </div>
    </div>
  );
}

export default PayScreen;