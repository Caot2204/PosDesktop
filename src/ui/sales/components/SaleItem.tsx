import '../stylesheets/SaleItem.css';

interface SaleItemProps { 
  saleId: number;
  onSaleClicked: () => void;
}

function SaleItem(props: SaleItemProps) {
  return (
    <div className="sale-item-container" onClick={props.onSaleClicked}>
      <span>Folio: {props.saleId}</span>
    </div>
  );
}

export default SaleItem;