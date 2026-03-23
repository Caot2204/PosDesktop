import '../stylesheets/CashClosingItem.css';
import type CashClosing from '../../../data/model/CashClosing';
import { formatDate, formatNumberToCurrentPrice } from '../../utils/FormatUtils';
import { useTranslation } from 'react-i18next';

function CashClosingItem(props: CashClosing) {
  const { t } = useTranslation('global');

  return (
    <div className="cashclosingitem-container">
      <div className="cashclosingitem-header">
        <p><strong>{t('items.cashClosingItem.cashier')}</strong> {props.userName}</p>
        <p><strong>{t('items.cashClosingItem.date')}</strong> {formatDate(props.currentDate)}</p>
      </div>
      <ul>
        <li>
          <strong>{t('items.cashClosingItem.salesRegistered')}</strong> {formatNumberToCurrentPrice(props.totalOfDay)}
        </li>
        <li>
          <strong>{t('items.cashClosingItem.phisicMoney')}</strong> {formatNumberToCurrentPrice(props.physicalMoney)}
        </li>
      </ul>
    </div>
  );
}

export default CashClosingItem;