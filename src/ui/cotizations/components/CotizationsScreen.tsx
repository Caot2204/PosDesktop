import '../stylesheets/CotizationsScreen.css';
import PosButton from '../../../ui/common/components/PosButton';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Cotization from '../../../data/model/Cotization';
import CotizationItem from './CotizationItem';
import { showErrorNotify, showSuccessNotify } from '../../../ui/utils/NotifyUtils';
import { ToastContainer } from 'react-toastify';
import CotizationScreen from './CotizationScreen';
import PosConfirmDialog from '../../../ui/common/components/PosConfirmDialog';

interface CotizationsScreenProps {
  currentUserName: string;
}

function CotizationsScreen(props: CotizationsScreenProps) {
  const newCotizationFormRef = useRef<HTMLDialogElement>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState<null | 'newCotization'>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [cotizationIdForSearch, setCotizationIdForSearch] = useState<null | number>(null);
  const [cotizations, setCotizations] = useState<Cotization[]>([]);
  const [cotizationToEdit, setCotizationToEdit] = useState<null | Cotization>(null);
  const [cotizationIdToDelete, setCotizationIdToDelete] = useState<null | number>(null);

  const fetchCotizations = async () => {
    try {
      const cotizations = await window.cotizationAPI?.getAllCotizations();
      if (cotizations) {
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

  useEffect(() => {
    fetchCotizations();
  }, [loadingData]);

  return (
    <>
      <div className={openDialog ? 'cotizations-screen-container filter-blur' : 'cotizations-screen-container'}>
        <div className='cotizations-screeen-actions'>
          <div className='cotizations-input-id-container'>
            <label>
              Folio:
            </label>
            <input
              type='number'
              value={cotizationIdForSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCotizationIdForSearch(e.target.value ? Number(e.target.value) : null)} />
          </div>
          <PosButton
            label='Nueva cotización'
            onClick={() => setOpenDialog('newCotization')} />
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
                  onExportPdf={() => { }}
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
          onSuccess={(message: string) => {
            showSuccessNotify(message);
            setCotizationToEdit(null);
            setOpenDialog(null);
            setLoadingData(true);
          }}
          onCancel={() => {
            setCotizationToEdit(null);
            setOpenDialog(null);
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
      <ToastContainer />
    </>
  );
}

export default CotizationsScreen;