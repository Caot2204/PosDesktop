import { useTranslation } from "react-i18next";
import Egress from "../../../data/model/Egress";
import { formatDate } from "../../../ui/utils/FormatUtils";
import { formatNumberToCurrentPrice } from "../../../ui/utils/FormatUtils";

interface EgressesTableProps {
  caption: string;
  egresses: Egress[]
}

function EgressesTable(props: EgressesTableProps) {
  const { t } = useTranslation('global');

  return (
    <table>
      <caption>{t('screens.egressesTable.caption', { tiempoString: props.caption })}</caption>
      <thead>
        <tr>
          <th scope="col">{t('screens.egressesTable.idTh')}</th>
          <th scope="col">{t('screens.egressesTable.dateTh')}</th>
          <th scope="col">{t('screens.egressesTable.descriptionTh')}</th>
          <th scope="col">{t('screens.egressesTable.amountTh')}</th>
        </tr>
      </thead>
      <tbody>
        {
          props.egresses ?
            props.egresses.map((egress) =>
              <tr>
                <td>{egress.id}</td>
                <td>{formatDate(egress.dateOfEgress)}</td>
                <td>{egress.description}</td>
                <td>{formatNumberToCurrentPrice(egress.amount)}</td>
              </tr>
            )
            :
            <></>
        }
      </tbody>
    </table>
  );
}

export default EgressesTable;