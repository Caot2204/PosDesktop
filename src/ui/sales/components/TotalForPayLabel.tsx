import '../stylesheets/TotalForPayLabel.css';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';

interface TotalForPayLabelProps {
  total: number;
}

function TotalForPayLabel(props: TotalForPayLabelProps) {
  return (
    <div className="total-sale-container">
      <span className="total-label">Total: {formatNumberToCurrentPrice(props.total)}</span>
    </div>
  );
}

export default TotalForPayLabel;