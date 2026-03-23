import { useEffect, useState } from 'react';
import '../stylesheets/CotizationPdfDialog.css';
import { GridLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';


interface CotizationPdfDialogProps {
  isShowed: boolean;
  cotizationId: number | null;
  onClose: () => void;
}

function CotizationPdfDialog(props: CotizationPdfDialogProps) {
  const { t } = useTranslation('global');
  const [isGenerating, setIsGenerating] = useState(true);

  const verifyPdfExists = async (cotizationId: number) => {
    setIsGenerating(true);
    const pdfPath = await window.cotizationAPI?.findCotizationPdf(cotizationId);
    if (pdfPath) {
      await window.cotizationAPI?.deleteCotizationPdf(cotizationId);
    }
    await window.cotizationAPI?.createCotizationPdf(cotizationId);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (props.isShowed && props.cotizationId != null) {
      verifyPdfExists(props.cotizationId);
    } else {
      setIsGenerating(true);
    }
  }, [props.isShowed, props.cotizationId]);

  return (
    <div className='cotization-pdf-dialog-container'>
      <button className='back-button' onClick={() => props.onClose()}>{t('buttons.close')}</button>
      {isGenerating ? (
        <div className="pdf-loading-message">
          <GridLoader
            className='image-loader'
            color="#4C662B" />
          {t('screens.cotizationPdfDialog.generatinPreview')}
        </div>
      ) : (
        <embed
          key={`${props.cotizationId}-${Date.now()}`}
          src={`pos-pdf:///${props.cotizationId}_cotization.pdf`}
          type="application/pdf"
          width="100%"
          height="100%" />
      )}
    </div>
  );
}

export default CotizationPdfDialog