import '../stylesheets/PayScreen.css';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel, MdOutlineCheck } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import PosButton from '../../common/components/PosButton';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';

interface PayScreenProps {
  isShowed: boolean;
  totalSale: number;
  onCancel: () => void;
  onPaySale: (paymentType: string, amountPayed: number) => void;
}

function PayScreen(props: PayScreenProps) {
  const paymentInputRef = useRef<HTMLInputElement>(null);

  const [payAmount, setPayAmount] = useState(0.0);
  const [paymentType, setPaymentType] = useState("cash");

  useEffect(() => {
    if (props.isShowed) {
      paymentInputRef.current?.focus();
    } else {
      if (paymentInputRef.current) {
        paymentInputRef.current.value = "";
      }
      setPayAmount(0.0);
      setPaymentType("cash");
    }
  }, [props.isShowed]);

  return (
    <div className="payscreen-container">
      <h1>Cobrar venta</h1>
      <div className="payment-inputs">
        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
          <option value="cash" selected>Efectivo</option>
          <option value="card">Tarjeta</option>
        </select>
        <div className="payamount-input-container">
          <FaDollarSign className="payment-icon" />
          <input
            ref={paymentInputRef}
            autoFocus
            className="payamount-input"
            type="number"
            onChange={(e) => setPayAmount(Number(e.target.value))}
            placeholder="Ingrese el monto pagado" />
        </div>
      </div>
      <div className="money-container">
        <div className="money-label">
          <span className="payment-label">Total: </span>
          <span className="total-sale-label">{formatNumberToCurrentPrice(props.totalSale)}</span>
        </div>
        <div className="money-label">
          <span className="payment-label">Cambio: </span>
          <span className="cambio-label">{formatNumberToCurrentPrice((payAmount - props.totalSale) < 0 ? 0 : (payAmount - props.totalSale))}</span>
        </div>
      </div>
      <div className="buttons-container">
        <PosButton
          className="cancel-button"
          icon={<MdOutlineCancel />}
          label="Cancelar (F4)"
          onClick={props.onCancel} />
        <PosButton
          disabled={props.totalSale === 0}
          label="Pagar (F1)"
          icon={<MdOutlineCheck />}
          onClick={() =>props.onPaySale(paymentType, payAmount)} />
      </div>
    </div>
  );
}

export default PayScreen;