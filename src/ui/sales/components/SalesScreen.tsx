import '../stylesheets/SalesScreen.css';
import { useEffect, useState } from 'react';
import type Sale from '../../../data/model/Sale';
import SaleItem from './SaleItem';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';

interface SalesScreenProps {
  isShowed: boolean;
}

function SalesScreen(props: SalesScreenProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [dateToSearch, setDateToSearch] = useState(formatDateForSearch(new Date()));
  const [saleToShow, setSaleToShow] = useState<Sale | null>(null);

  function formatDate(dateToFormat: Date): string {
    const minutes = dateToFormat.getMinutes() < 10 ? "0" + dateToFormat.getMinutes() : dateToFormat.getMinutes();
    const seconds = dateToFormat.getSeconds() < 10 ? "0" + dateToFormat.getSeconds() : dateToFormat.getSeconds();
    return dateToFormat.getDate() + "-" +
      (dateToFormat.getMonth() + 1) + "-" +
      dateToFormat.getFullYear() + " " +
      dateToFormat.getHours() + ":" +
      minutes + ":" +
      seconds;
  }

  function formatDateForSearch(dateToFormat: Date): string {
    const month = dateToFormat.getMonth() + 1 < 10 ? "0" + (dateToFormat.getMonth() + 1) : dateToFormat.getMonth() + 1;
    return dateToFormat.getFullYear() + "-" + month + "-" + dateToFormat.getDate();
  }

  const handleGetSaleById = (saleId: number) => {
    window.saleAPI?.getSaleById(saleId).then(sale => {
      if (sale) { setSales([sale]); }
      else { setSales([]); }
    });
  };

  const handleGetSalesByDate = (dateOfSales: Date) => {
    window.saleAPI?.getSalesByDate(dateOfSales).then(sales => {
      setSales(sales);
    });
  };

  useEffect(() => {
    handleGetSalesByDate(new Date(dateToSearch));
  }, [dateToSearch]);

  useEffect(() => {
    handleGetSalesByDate(new Date());
  }, [props.isShowed]);

  return (
    <div className="salesscreen-container">
      <div className="sales-list-container">
        <input
          className="sales-folio-input"
          type="number"
          min={1}
          placeholder="Folio de la venta..."
          onChange={(e) => {
            setSaleToShow(null);
            handleGetSaleById(Number(e.target.value));
          }} />
        <input
          className="sale-date-input"
          type="date"
          placeholder="Fecha de la venta..."
          value={dateToSearch}
          onChange={(e) => {
            setSaleToShow(null);
            setDateToSearch(e.target.value);
          }} />
        <h3 className="sales-label">Ventas:</h3>
        <div className="sales-list">
          {
            sales.map(sale => (
              <SaleItem
                key={sale.id}
                saleId={sale.id}
                onSaleClicked={() => setSaleToShow(sale)} />
            ))
          }
        </div>
      </div>
      <div className="ticket-container">
        <h2>Detalles de la venta </h2>
        <p><strong>Folio:</strong> {saleToShow?.id}</p>
        <p><strong>Fecha/Hora:</strong> {saleToShow ? formatDate(saleToShow.dateOfSale) : ''}</p>
        <p><strong>Le atendío:</strong> {saleToShow?.userToGenerateSale}</p>
        <p><strong>Forma de pago:</strong> {saleToShow?.paymentType}</p>
        <hr />
        {
          saleToShow?.productsSold.map(product => (
            <div key={saleToShow?.id + product.name} className="ticket-product-sold">
              <span className="ticket-product-detail">{product.name}</span>
              <div className="product-sold-container">
                <span className="ticket-product-detail">{formatNumberToCurrentPrice(product.unitPrice)} x {product.unitsSold}</span>
                <span className="ticket-product-detail">Subtotal: {formatNumberToCurrentPrice(product.unitPrice * product.unitsSold)}</span>
              </div>
            </div>
          ))
        }
        <hr />
        <p className="ticket-total-label"><strong>Total: </strong>{saleToShow ? formatNumberToCurrentPrice(saleToShow.totalSale) : ''}</p>
        <p className="ticket-total-label"><strong>Monto pagado: </strong>{saleToShow ? formatNumberToCurrentPrice(saleToShow.amountPayed) : ''}</p>
        <p className="ticket-total-label"><strong>Cambio: </strong>{saleToShow ? formatNumberToCurrentPrice(saleToShow.amountPayed - saleToShow.totalSale) : ''}</p>
      </div>
    </div>
  );
}

export default SalesScreen;