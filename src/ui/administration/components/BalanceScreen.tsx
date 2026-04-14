import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import '../stylesheets/BalanceScreen.css';
import EgressesTable from "./EgressesTable";
import SalesTable from "./SalesTable";
import { showErrorNotify } from "../../../ui/utils/NotifyUtils";
import { formatNumberToCurrentPrice } from "../../../ui/utils/FormatUtils";
import { NavLink } from "react-router";
import { MdOutlineCancel } from "react-icons/md";
import { Chart } from "chart.js/auto";

function BalanceScreen() {
  const { t } = useTranslation('global');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [readyToDisplayInform, setReadyToDisplayInform] = useState(false);
  const [totalEgress, setTotalEgress] = useState(0.0);
  const [totalSale, setTotalSale] = useState(0.0);
  const [egresses, setEgresses] = useState([]);
  const [sales, setSales] = useState([]);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      showErrorNotify(t('screens.balance.errorInvalidDates'));
      return;
    }

    setLoadingData(true);

    // Fetch Egresses
    window.egressAPI?.getEgressesByRange(startDate, endDate)
      .then(egresses => {
        setEgresses(egresses);
        const total = egresses.reduce((acc, curr) => acc + curr.amount, 0);
        setTotalEgress(total);
      })
      .catch((e) => {
        showErrorNotify(t('screens.balance.errorGetEgresses'));
      });

    // Fetch Sales
    window.saleAPI?.getSalesByRange(startDate, endDate)
      .then(sales => {
        setSales(sales);
        const total = sales.reduce((acc, curr) => acc + curr.totalSale, 0);
        setTotalSale(total);
      })
      .catch((e) => {
        showErrorNotify(t('screens.balance.errorGetSales'));
      })
      .finally(() => {
        setLoadingData(false);
        setReadyToDisplayInform(true);
      });
  };

  const generateChart = async () => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(
      chartRef.current,
      {
        type: 'doughnut',
        data: {
          labels: [t('screens.balance.salesChartLabel'), t('screens.balance.egressesChartLabel')],
          datasets: [{
            label: `${startDate} - ${endDate}`,
            data: [totalSale, totalEgress],
            backgroundColor: [
              'rgba(99, 255, 146, 1)',
              'rgb(255, 99, 132)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    );
  };

  useEffect(() => {
    if (readyToDisplayInform) {
      generateChart();
    }
  }, [readyToDisplayInform, totalSale, totalEgress]);

  return (
    <div className="balance-screen-container">
      <div className="balance-header">
        <NavLink
          to="/administration" >
          <MdOutlineCancel className="close-button" />
        </NavLink>
        <h1>{t('screens.balance.title')}</h1>
      </div>
      <div className="range-dates-container">
        <div className="date-input-group">
          <label>{t('screens.balance.startDateLabel')}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setReadyToDisplayInform(false);
            }} />
        </div>
        <div className="date-input-group">
          <label>{t('screens.balance.endDateLabel')}</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setReadyToDisplayInform(false);
            }} />
        </div>
        <button
          className="search-button"
          onClick={fetchData}
          disabled={loadingData}
        >
          {loadingData ? t('screens.balance.loading') : t('screens.balance.searchButton')}
        </button>
      </div>

      {
        readyToDisplayInform ?
          <>
            <div className="totals-container">
              <div className="totals-summary-container">
                <div className="summary-card sales">
                  <h3>{t('screens.balance.totalSales')}</h3>
                  <p className="total-amount">{formatNumberToCurrentPrice(totalSale)}</p>
                </div>
                <div className="summary-card egresses">
                  <h3>{t('screens.balance.totalEgresses')}</h3>
                  <p className="total-amount">{formatNumberToCurrentPrice(totalEgress)}</p>
                </div>
                <div className="summary-card net">
                  <h3>{t('screens.balance.netTotal')}</h3>
                  <p className={`total-amount ${(totalSale - totalEgress) >= 0 ? 'positive' : 'negative'}`}>
                    {formatNumberToCurrentPrice(totalSale - totalEgress)}
                  </p>
                </div>
              </div>
              <div className="chart-container">
                <canvas className="totals-chart" ref={chartRef}></canvas>
              </div>
            </div>

            <div className="data-tables-container">
              <EgressesTable
                caption={`${startDate} - ${endDate}`}
                egresses={egresses} />
              <SalesTable
                caption={`${startDate} - ${endDate}`}
                sales={sales} />
            </div>
          </>
          :
          <p className="no-range-message"><em>{t('screens.balance.noRangeSelected')}</em></p>
      }
    </div>
  );
}

export default BalanceScreen;