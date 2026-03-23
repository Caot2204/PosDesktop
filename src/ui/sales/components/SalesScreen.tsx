import '../stylesheets/SalesScreen.css';
import { useEffect, useState } from 'react';
import type Sale from '../../../data/model/Sale';
import SaleItem from './SaleItem';
import { formatDate, formatNumberToCurrentPrice, parseLocalDate, toInputDateValue } from '../../utils/FormatUtils';
import { useTranslation } from 'react-i18next';

interface SalesScreenProps {
  isShowed: boolean;
}

function SalesScreen(props: SalesScreenProps) {
  const { t } = useTranslation('global');
  const [sales, setSales] = useState<Sale[]>([]);
  const [dateToSearch, setDateToSearch] = useState<string>(toInputDateValue(new Date()));
  const [saleToShow, setSaleToShow] = useState<Sale | null>(null);

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
    const parsed = parseLocalDate(dateToSearch);
    if (parsed) handleGetSalesByDate(parsed);
    else handleGetSalesByDate(new Date());
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
          placeholder={t('screens.sales.saleFolio')}
          onChange={(e) => {
            setSaleToShow(null);
            handleGetSaleById(Number(e.target.value));
          }} />
        <input
          className="sale-date-input"
          type="date"
          placeholder={t('screens.sales.dateSale')}
          value={dateToSearch}
          onChange={(e) => {
            setSaleToShow(null);
            setDateToSearch(e.target.value);
          }} />
        <h3 className="sales-label">{t('screens.sales.title')}</h3>
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
        <h2>{t('screens.sales.ticketTitle')}</h2>
        <p><strong>{t('screens.sales.ticketFolio')}</strong> {saleToShow?.id}</p>
        <p><strong>{t('screens.sales.ticketDate')}</strong> {saleToShow ? formatDate(saleToShow.dateOfSale) : ''}</p>
        <p><strong>{t('screens.sales.ticketAttend')}</strong> {saleToShow?.userToGenerateSale}</p>
        <p><strong>{t('screens.sales.ticketPayType')}</strong> {saleToShow?.paymentType}</p>
        {
          saleToShow?.paymentFolio ?
            <p><strong>{t('screens.sales.ticketFolioTransaction')}</strong> {saleToShow?.paymentFolio}</p>
            :
            <></>
        }
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
        <p className="ticket-total-label"><strong>{t('screens.sales.ticketTotal')}</strong>{saleToShow ? formatNumberToCurrentPrice(saleToShow.totalSale) : ''}</p>
        <p className="ticket-total-label"><strong>{t('screens.sales.ticketAmountPayed')}</strong>{saleToShow ? formatNumberToCurrentPrice(saleToShow.amountPayed) : ''}</p>
        <p className="ticket-total-label"><strong>{t('screens.sales.ticketCambio')}</strong>{saleToShow ? formatNumberToCurrentPrice(saleToShow.amountPayed - saleToShow.totalSale) : ''}</p>
      </div>
    </div>
  );
}

export default SalesScreen;