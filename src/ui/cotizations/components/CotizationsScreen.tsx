import '../stylesheets/CotizationsScreen.css';
import PosButton from '../../../ui/common/components/PosButton';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Cotization from '../../../data/model/Cotization';
import CotizationItem from './CotizationItem';
import { showErrorNotify, showSuccessNotify } from '../../../ui/utils/NotifyUtils';
import { ToastContainer } from 'react-toastify';
import CotizationScreen from './CotizationScreen';
import PosConfirmDialog from '../../../ui/common/components/PosConfirmDialog';
import CotizationPdfDialog from './CotizationPdfDialog';
import SaleProductModel from '../../../ui/sales/model/SalesProductModel';
import CotizationProduct from '../../../data/model/CotizationProduct';
import { useTranslation } from 'react-i18next';

interface CotizationsScreenProps {
  currentUserName: string;
  navigateToSaleScreen: (products: SaleProductModel[] | CotizationProduct[]) => void;
}

function CotizationsScreen(props: CotizationsScreenProps) {
  const { t } = useTranslation('global');
  const newCotizationFormRef = useRef<HTMLDialogElement>(null);
  const pdfDialogRef = useRef<HTMLDialogElement>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState<null | 'newCotization' | 'cotizationPdfViewer'>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [cotizationIdForSearch, setCotizationIdForSearch] = useState<null | number>(null);
  const [cotizations, setCotizations] = useState<Cotization[]>([]);
  const [cotizationToEdit, setCotizationToEdit] = useState<null | Cotization>(null);
  const [cotizationIdToDelete, setCotizationIdToDelete] = useState<null | number>(null);
  const [cotizationIdForShow, setCotizationIdForShow] = useState<null | number>(null);

  const fetchCotizations = async () => {
    try {
      let cotizations = await window.cotizationAPI?.getAllCotizations();
      if (cotizations) {
        if (cotizationIdForSearch) {
          cotizations = cotizations.filter((c: Cotization) => c.id === cotizationIdForSearch);
        }
        setCotizations(cotizations);
        setLoadingData(false);
      }
    } catch (error) {
      showErrorNotify(t('screens.cotizations.errorLoadCotizations'));
    }
  };

  const handleEdit = (cotization: Cotization) => {
    setCotizationToEdit(cotization);
    setOpenDialog('newCotization');
  };

  const handleDelete = async () => {
    try {
      await window.cotizationAPI?.deleteCotization(cotizationIdToDelete);
      showSuccessNotify(t('screens.cotizations.cotizationDeleted'));
      setCotizationIdToDelete(null);
      setShowConfirmDialog(false);
      setLoadingData(true);
    } catch (error) {
      showErrorNotify(t('screens.cotizations.errorCotizationDelete'));
    }
  };

  const handleConfirmCotizationCreate = () => {
    setCotizationToEdit(null);
    setCotizationIdForShow(null);
    setOpenDialog(null);
    setLoadingData(true);
  };

  useEffect(() => {
    fetchCotizations();
  }, [loadingData, cotizationIdForSearch]);

  return (
    <>
      <div className={openDialog ? 'cotizations-screen-container filter-blur' : 'cotizations-screen-container'}>
        <div className='cotizations-screeen-actions'>
          <PosButton
            label={t('screens.cotizations.newCotization')}
            onClick={() => setOpenDialog('newCotization')} />
          <div className='cotizations-input-id-container'>
            <label>
              {t('screens.cotizations.folioLabel')}
            </label>
            <input
              type='number'
              value={cotizationIdForSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCotizationIdForSearch(e.target.value ? Number(e.target.value) : null)} />
          </div>
        </div>
        <table className='cotizations-items'>
          <thead>
            <tr>
              <th scope='col'>{t('screens.cotizations.folioLabel')}</th>
              <th scope='col'>{t('screens.cotizations.clientLabel')}</th>
              <th scope='col'>{t('screens.cotizations.dateLabel')}</th>
            </tr>
          </thead>
          <tbody>
            {
              cotizations.map((c: Cotization) =>
                <CotizationItem
                  key={c.id}
                  id={c.id}
                  dateOfCotization={c.dateOfCotization}
                  client={c.client}
                  userToRegister={c.userToRegister}
                  currentUserName={props.currentUserName}
                  onBuyCotization={() => {
                    props.navigateToSaleScreen(c.products);
                  }}
                  onExportPdf={() => {
                    setCotizationIdForShow(c.id);
                    setOpenDialog('cotizationPdfViewer')
                  }}
                  onUpdate={() => handleEdit(c)}
                  onDelete={() => {
                    setCotizationIdToDelete(c.id);
                    setShowConfirmDialog(true);
                  }} />)
            }
          </tbody>
        </table>
      </div>
      <dialog className='cotization-pos-dialog' ref={newCotizationFormRef} open={openDialog === 'newCotization'}>
        <CotizationScreen
          key={cotizationToEdit ? cotizationToEdit.id : 'new'}
          id={cotizationToEdit ? cotizationToEdit.id : null}
          dateOfCotization={cotizationToEdit ? cotizationToEdit.dateOfCotization : new Date()}
          client={cotizationToEdit ? cotizationToEdit.client : ""}
          userToRegister={cotizationToEdit ? cotizationToEdit.userToRegister : props.currentUserName}
          products={cotizationToEdit ? cotizationToEdit.products : []}
          isForEdit={cotizationToEdit ? true : false}
          navigateToBuyCotization={(products) => {
            setOpenDialog(null);
            props.navigateToSaleScreen(products);
          }}
          onSuccess={(cotizationId: number) => {
            showSuccessNotify(t('screens.cotizations.cotizationSaved'));
            setCotizationIdForShow(cotizationId);
            setOpenDialog('cotizationPdfViewer');
          }}
          onCancel={() => {
            setCotizationToEdit(null);
            setCotizationIdForShow(null);
            setOpenDialog(null);
          }} />
      </dialog>
      <dialog className='cotization-pdf-dialog' ref={pdfDialogRef} open={openDialog === 'cotizationPdfViewer'}>
        <CotizationPdfDialog
          isShowed={openDialog === 'cotizationPdfViewer' && cotizationIdForShow != null}
          cotizationId={cotizationIdForShow}
          onClose={() => {
            handleConfirmCotizationCreate();
          }} />
      </dialog>
      <PosConfirmDialog
        message={t('screens.cotizations.deleteMessage')}
        isShowed={showConfirmDialog}
        onCancel={() => {
          setShowConfirmDialog(false);
          setCotizationIdToDelete(null);
        }}
        onOk={() => handleDelete()} />
      <ToastContainer />
    </>
  );
}

export default CotizationsScreen;