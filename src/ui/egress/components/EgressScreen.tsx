import '../stylesheets/EgressScreen.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import PosButton from '../../../ui/common/components/PosButton';
import { IoAddOutline } from 'react-icons/io5';
import { showErrorNotify, showSuccessNotify } from '../../../ui/utils/NotifyUtils';
import Egress from '../../../data/model/Egress';
import { parseLocalDate, toInputDateValue } from '../../utils/FormatUtils';
import EgressItem from './EgressItem';
import EgressForm from './EgressForm';
import PosConfirmDialog from '../../../ui/common/components/PosConfirmDialog';
import { ToastContainer } from 'react-toastify';
import { MdOutlineCancel } from 'react-icons/md';

interface EgressScreenProps {
  userName: string;
}

function EgressScreen(props: EgressScreenProps) {
  const egressFormDialogRef = useRef<HTMLDialogElement>(null);
  const [openDialog, setOpenDialog] = useState<null | 'egressForm'>(null);

  const [dateFilter, setDateFilter] = useState<Date | null>(new Date());
  const [egresses, setEgresses] = useState([]);
  const [egressToEdit, setEgressToEdit] = useState<Egress | undefined>(undefined);
  const [egressIdToDelete, setEgressIdToDelete] = useState<null | number>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchEgresses = async () => {
    const egressesDb = await window.egressAPI?.getAllEgresses();
    if (egressesDb) {
      const formatYMD = (d: Date) => {
        const y = d.getFullYear();
        const m = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      const normalized = egressesDb.map((eg: any) => {
        // ensure dateOfEgress is a local Date object
        let dateObj: Date | null = null;
        if (eg.dateOfEgress) {
          if (typeof eg.dateOfEgress === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(eg.dateOfEgress)) {
            dateObj = parseLocalDate(eg.dateOfEgress);
          } else {
            dateObj = new Date(eg.dateOfEgress);
          }
        }
        return {
          ...eg,
          dateOfEgress: dateObj
        };
      });

      const egressesFiltered = dateFilter
        ? normalized.filter((eg: any) => {
          const dateObj = eg.dateOfEgress as Date | null;
          if (!dateObj) return false;
          return formatYMD(dateObj) === formatYMD(dateFilter);
        })
        : normalized;

      setEgresses(egressesFiltered);
      setLoadingData(false);
    } else {
      showErrorNotify("Error al recuperar los egresos");
    }
  };

  const handleEdit = async (egress: Egress) => {
    setEgressToEdit(egress);
    setOpenDialog('egressForm');
  };

  const handleDelete = async () => {
    try {
      if (egressIdToDelete) {
        await window.egressAPI?.deleteEgress(egressIdToDelete);
        showSuccessNotify("Egreso eliminado");
        setShowConfirmDialog(false);
        setLoadingData(true);
      }
    } catch (error) {
      showErrorNotify("Error al eliminar el egreso");
    }
  };

  const handleCloseDialog = () => {
    setEgressToEdit(undefined);
    setOpenDialog(null);
  };

  useEffect(() => {
    fetchEgresses();
  }, [loadingData, dateFilter]);

  return (
    <>
      <div className='egressescreen-container'>
        <div className={openDialog ? 'egress-actions-container filter-blur' : 'egress-actions-container'}>
          <PosButton
              className="add-egress-button"
              icon={<IoAddOutline />}
              label="Nuevo egreso"
              onClick={() => {
                setOpenDialog('egressForm');
              }} />
          <div className='date-filter-input'>
            <input
              type='date'
              value={toInputDateValue(dateFilter)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value;
                setDateFilter(v ? parseLocalDate(v) : null);
              }} />
            <MdOutlineCancel
              onClick={() => setDateFilter(null)} />
          </div>
        </div>
        <div className={openDialog ? 'egresses-list filter-blur' : 'egresses-list'}>
          <table className='egresses-items'>
            <thead>
              <tr>
                <th scope='col'>Fecha</th>
                <th scope='col'>Monto</th>
                <th scope='col'>Usuario que registró:</th>
                <th scope='col'>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {
                egresses.map((egress: Egress) => (
                  <EgressItem
                    key={egress.id}
                    dateOfEgress={egress.dateOfEgress}
                    amount={egress.amount}
                    description={egress.description}
                    userToRegister={egress.userToRegister}
                    currentUserName={props.userName}
                    onDelete={() => {
                      setEgressIdToDelete(egress.id);
                      setShowConfirmDialog(true);
                    }}
                    onUpdate={() => handleEdit(egress)} />
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <dialog className='pos-dialog' ref={egressFormDialogRef} open={openDialog === 'egressForm'}>
        <EgressForm
          id={egressToEdit ? egressToEdit.id : null}
          dateOfEgress={egressToEdit ? egressToEdit.dateOfEgress : new Date()}
          amount={egressToEdit ? egressToEdit.amount : 0}
          description={egressToEdit ? egressToEdit.description : ""}
          userName={egressToEdit ? egressToEdit.userToRegister : props.userName}
          forEdit={egressToEdit ? true : false}
          onSaveSuccess={() => {
            setLoadingData(true);
            handleCloseDialog();
          }}
          onCancel={() => {
            handleCloseDialog();
          }} />
      </dialog>
      <PosConfirmDialog
        message="¿Desea eliminar este egreso?"
        isShowed={showConfirmDialog}
        onCancel={() => {
          setShowConfirmDialog(false);
          setEgressIdToDelete(null);
        }}
        onOk={() => handleDelete()} />
      <ToastContainer />
    </>
  );
}

export default EgressScreen;