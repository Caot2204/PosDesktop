import '../stylesheets/SalesProductList.css';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';
import type SaleProductModel from '../model/SalesProductModel';
import { showErrorNotify } from '../../utils/NotifyUtils';

interface SalesProductItemProps {
  product: SaleProductModel;
  ref: any | undefined;
  onModifyProductUnits: (code: string, units: number) => void;
  onDeleteProductOfSale: (code: string) => void;
}

interface SalesProductListProps {
  products: SaleProductModel[];
  onModifyProductUnits: (code: string, units: number) => void;
  onDeleteProductOfSale: (code: string) => void;
}

function SalesProductItem(props: SalesProductItemProps) {
  const [unitsToSale, setUnitsToSale] = useState(String(props.product.unitsToSale));

  useEffect(() => {
    setUnitsToSale(String(props.product.unitsToSale));
  }, [props.product.unitsToSale]);

  return (
    <tr className="product-sale-item" ref={props.ref}>
      <td>{props.product.code}</td>
      <td>{props.product.name}</td>
      <td>{formatNumberToCurrentPrice(props.product.unitPrice)}</td>
      <td>
        <div className="units-input-container">
          <FaMinus className="units-icon" onClick={() => {
            if (props.product.unitsToSale > 1) {
              props.onModifyProductUnits(props.product.code, (props.product.unitsToSale - 1));
            } else {
              showErrorNotify("Las unidades vendidadas no pueden ser 0");
            }
          }} />
          <input
            className="units-input"
            min={1}
            value={unitsToSale}
            type="number"
            max={9999}
            onChange={(e) => setUnitsToSale(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const units = Number(unitsToSale);
                if (units > 9999) {
                  showErrorNotify("Las unidades vendidas no pueden ser mas de 9999");
                  setUnitsToSale(String(props.product.unitsToSale));
                } else {
                  if (units >= 1 && (props.product.stock === 'infinity' || typeof props.product.stock === 'number' && units <= props.product.stock)) {
                    props.onModifyProductUnits(props.product.code, units);
                  } else {
                    showErrorNotify("Las unidades vendidas no pueden ser 0 o mayor al stock");
                    setUnitsToSale(String(props.product.unitsToSale));
                  }
                }
              }
            }} />
          <MdOutlineAdd className="units-icon" onClick={() => {
            if (props.product.unitsToSale + 1 > 9999) {
              showErrorNotify("Las unidades vendidas no pueden ser mas de 9999");
              setUnitsToSale(String(props.product.unitsToSale));
            } else {
              if (props.product.stock === 'infinity' || (typeof props.product.stock === 'number' && ((props.product.unitsToSale + 1) <= props.product.stock))) {
                props.onModifyProductUnits(props.product.code, (props.product.unitsToSale + 1))
              }
            }
          }} />
        </div>
      </td>
      <td>{formatNumberToCurrentPrice(props.product.unitPrice * props.product.unitsToSale)}</td>
      <td>
        <RiDeleteBin6Line className="delete-button" onClick={() => props.onDeleteProductOfSale(props.product.code)} />
      </td>
    </tr>
  );
}

function SalesProductList(props: SalesProductListProps) {
  const lastProductRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (lastProductRef.current) {
      lastProductRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [props.products.length]);

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
            props.products.map((product, index) => (
              <SalesProductItem
                key={product.code}
                product={product}
                onModifyProductUnits={props.onModifyProductUnits}
                onDeleteProductOfSale={props.onDeleteProductOfSale}
                ref={index === props.products.length - 1 ? lastProductRef : undefined} />
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default SalesProductList;