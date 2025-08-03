import '../stylesheets/CashClosingItem.css';
import type CashClosing from '../../../data/model/CashClosing';
import { formatDate, formatNumberToCurrentPrice } from '../../utils/FormatUtils';

function CashClosingItem(props: CashClosing) {

  console.log(props.currentDate);
  return (
    <div className="cashclosingitem-container">
      <div className="cashclosingitem-header">
        <p><strong>Vendedor:</strong> {props.userName}</p>
        <p><strong>Fecha:</strong> {formatDate(props.currentDate)}</p>
      </div>
      <ul>
        <li>
          <strong>Ventas registradas:</strong> {formatNumberToCurrentPrice(props.totalOfDay)}
        </li>
        <li>
          <strong>Dinero físico:</strong> {formatNumberToCurrentPrice(props.physicalMoney)}
        </li>
      </ul>
    </div>
  );
}

export default CashClosingItem;