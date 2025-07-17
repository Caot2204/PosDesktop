import '../stylesheets/SalesProductList.css';
import { MdOutlineAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';
import type SaleProductModel from '../model/SalesProductModel';

interface SalesProductItemProps {
  product: SaleProductModel;
  onModifyProductUnits: (code: string, units: number) => void;
  onDeleteProductOfSale: (code: string) => void;
}

interface SalesProductListProps {
  products: SaleProductModel[];
  onModifyProductUnits: (code: string, units: number) => void;
  onDeleteProductOfSale: (code: string) => void;
}

function SalesProductItem(props: SalesProductItemProps) {
  return (
    <tr className="product-sale-item">
      <td>{props.product.code}</td>
      <td>{props.product.name}</td>
      <td>{formatNumberToCurrentPrice(props.product.unitPrice)}</td>
      <td>
        <div className="units-input-container">
          <FaMinus className="units-icon" onClick={() => {
            if (props.product.unitsToSale > 1) {
              props.onModifyProductUnits(props.product.code, (props.product.unitsToSale - 1));
            }
          }} />
          <input className="units-input" min={1} value={props.product.unitsToSale} type="number" />
          <MdOutlineAdd className="units-icon" onClick={() => {
            if (props.product.stock === 'infinity' || (typeof props.product.stock === 'number' && ((props.product.unitsToSale + 1) <= props.product.stock))) {
              props.onModifyProductUnits(props.product.code, (props.product.unitsToSale + 1))
            }
          }} />
        </div>
      </td>
      <td>{formatNumberToCurrentPrice(props.product.unitPrice * props.product.unitsToSale)}</td>
      <td>
        <RiDeleteBin6Line className="delete-button" onClick={() => props.onDeleteProductOfSale(props.product.code)}/>
      </td>
    </tr>
  );
}

function SalesProductList(props: SalesProductListProps) {
  return (
    <div className="sales-product-container">
      <table className="sales-product-list">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Unidades a vender</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {
            props.products.map(product => (
              <SalesProductItem
                key={product.code}
                product={product}
                onModifyProductUnits={props.onModifyProductUnits}
                onDeleteProductOfSale={props.onDeleteProductOfSale} />
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default SalesProductList;