import { useEffect, useState } from 'react';
import '../stylesheets/BalancePdfDialog.css';
import { GridLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import Sale from '../../../data/model/Sale';
import Egress from '../../../data/model/Egress';


interface BalancePdfDialogProps {
  isShowed: boolean;
  startDate: string;
  endDate: string;
  sales: Sale[];
  egresses: Egress[];
  chartUrl: string;
  onClose: () => void;
}

function BalancePdfDialog(props: BalancePdfDialogProps) {
  const { t } = useTranslation('global');
  const [isGenerating, setIsGenerating] = useState(true);

  const verifyPdfExists = async (rangeDate: string) => {
    setIsGenerating(true);
    const pdfPath = await window.balanceAPI?.findBalancePdf(rangeDate);
    if (pdfPath) {
      await window.balanceAPI?.deleteBalancePdf(rangeDate);
    }
    await window.balanceAPI?.createBalancePdf(props.startDate, props.endDate, props.sales, props.egresses, props.chartUrl);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (props.isShowed && props.startDate && props.endDate && props.sales && props.egresses && props.chartUrl) {
      verifyPdfExists(`${props.startDate}-${props.endDate}`);
    } else {
      setIsGenerating(true);
    }
  }, [props.isShowed, props.startDate, props.endDate, props.sales, props.egresses, props.chartUrl]);

  return (
    <div className='balance-pdf-dialog-container'>
      <button className='back-button' onClick={() => props.onClose()}>{t('buttons.close')}</button>
      {isGenerating ? (
        <div className="pdf-loading-message">
          <GridLoader
            className='image-loader'
            color="#4C662B" />
          {t('screens.balancePdfDialog.generatinPreview')}
        </div>
      ) : (
        <embed
          key={`${props.startDate}-${props.endDate}`}
          src={`pos-balances-pdf:///Balance_${props.startDate}-${props.endDate}.pdf`}
          type="application/pdf"
          width="100%"
          height="100%" />
      )}
    </div>
  );
}

export default BalancePdfDialog;