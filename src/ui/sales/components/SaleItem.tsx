import '../stylesheets/SaleItem.css';
import { useTranslation } from 'react-i18next';

interface SaleItemProps { 
  saleId: number;
  onSaleClicked: () => void;
}

function SaleItem(props: SaleItemProps) {
  const { t } = useTranslation('global');
  return (
    <div className="sale-item-container" onClick={props.onSaleClicked}>
      <span>{t('items.saleItem.folioLabel', { saleId: props.saleId })}</span>
    </div>
  );
}

export default SaleItem;