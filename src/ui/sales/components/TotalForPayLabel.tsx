import '../stylesheets/TotalForPayLabel.css';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';
import { useTranslation } from 'react-i18next';

interface TotalForPayLabelProps {
  total: number;
}

function TotalForPayLabel(props: TotalForPayLabelProps) {
  const { t } = useTranslation('global');
  return (
    <div className="total-sale-container">
      <span className="total-label">{t('screens.totalLabel.total', { totalString: formatNumberToCurrentPrice(props.total) })}</span>
    </div>
  );
}

export default TotalForPayLabel;