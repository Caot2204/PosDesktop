import '../stylesheets/CotizationsScreen.css';
import PosButton from '../../../ui/common/components/PosButton';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Cotization from '../../../data/model/Cotization';
import CotizationItem from './CotizationItem';
import { showErrorNotify, showSuccessNotify } from '../../../ui/utils/NotifyUtils';
import { ToastContainer } from 'react-toastify';
import CotizationScreen from './CotizationScreen';
import PosConfirmDialog from '../../../ui/common/components/PosConfirmDialog';
import CotizationShareDialog from './CotizationShareDialog';
import CotizationPdfDialog from './CotizationPdfDialog';

interface CotizationsScreenProps {
  currentUserName: string;
}

function CotizationsScreen(props: CotizationsScreenProps) {
  const newCotizationFormRef = useRef<HTMLDialogElement>(null);
  const pdfDialogRef = useRef<HTMLDialogElement>(null);


  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
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
      showErrorNotify("Error al recuperar las cotizaciones");
    }
  };

  const handleEdit = (cotization: Cotization) => {
    setCotizationToEdit(cotization);
    setOpenDialog('newCotization');
  };

  const handleDelete = async () => {
    try {
      await window.cotizationAPI?.deleteCotization(cotizationIdToDelete);
      showSuccessNotify("Cotización eliminada");
      setCotizationIdToDelete(null);
      setShowConfirmDialog(false);
      setLoadingData(true);
    } catch (error) {
      showErrorNotify("Error al eliminar la cotización, inténtelo de nuevo");
    }
  };

  const handleConfirmCotizationCreate = () => {
    setCotizationToEdit(null);
    setCotizationIdForShow(null);
    setShowShareDialog(false);
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
            label='Nueva cotización'
            onClick={() => setOpenDialog('newCotization')} />
          <div className='cotizations-input-id-container'>
            <label>
              Folio:
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
              <th scope='col'>Folio</th>
              <th scope='col'>Cliente</th>
              <th scope='col'>Fecha</th>
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
                  onSendEmail={() => { }}
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
          onSuccess={(cotizationId: number) => {
            showSuccessNotify("Cotizacion almacenada en el sistema");
            setCotizationIdForShow(cotizationId);
            setShowShareDialog(true);
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
        message="¿Desea eliminar esta cotización?"
        isShowed={showConfirmDialog}
        onCancel={() => {
          setShowConfirmDialog(false);
          setCotizationIdToDelete(null);
        }}
        onOk={() => handleDelete()} />
      <CotizationShareDialog
        isShowed={showShareDialog}
        onExportPdf={() => {
          setShowShareDialog(false);
          setOpenDialog('cotizationPdfViewer');
        }}
        onEmailShare={() => {

        }} />
      <ToastContainer />
    </>
  );
}

export default CotizationsScreen;