import Sale from "../../../data/model/Sale";
import { useTranslation } from "react-i18next";
import { formatNumberToCurrentPrice } from "../../../ui/utils/FormatUtils";
import { formatDate } from "../../../ui/utils/FormatUtils";

interface SalesTableProps {
  caption: string;
  sales: Sale[];
}

function SalesTable(props: SalesTableProps) {
  const { t } = useTranslation('global');

  return (
    <table>
      <caption>{t('screens.salesTable.caption', { tiempoString: props.caption })}</caption>
      <thead>
        <tr>
          <th scope="col">{t('screens.salesTable.idTh')}</th>
          <th scope="col">{t('screens.salesTable.dateTh')}</th>
          <th scope="col">{t('screens.salesTable.totalTh')}</th>
        </tr>
      </thead>
      <tbody>
        {
          props.sales ?
            props.sales.map((sale) =>
              <tr>
                <td>{sale.id}</td>
                <td>{formatDate(sale.dateOfSale)}</td>
                <td>{formatNumberToCurrentPrice(sale.totalSale)}</td>
              </tr>
            )
            :
            <></>
        }
      </tbody>
    </table>
  );
}

export default SalesTable;