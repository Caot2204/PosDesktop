import { ChangeEvent, useEffect, useState } from 'react';
import '../stylesheets/EgressForm.css';
import { MdErrorOutline } from 'react-icons/md';
import { formatOnlyDate, parseLocalDate, toInputDateValue } from '../../../ui/utils/FormatUtils';
import OkCancelButtons from '../../../ui/common/components/OkCancelButtons';
import { showSuccessNotify } from '../../../ui/utils/NotifyUtils';
import { handleErrorMessage } from '../../../ui/utils/ErrorUtils';

interface EgressFormProps {
  id?: number;
  dateOfEgress?: Date;
  amount?: number;
  description?: string;
  forEdit?: boolean;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

function EgressForm(props: EgressFormProps) {
  const [id, setId] = useState<number | null>(props.id ? props.id : null);
  const [dateOfEgress, setDateOfEgress] = useState(props.dateOfEgress ? props.dateOfEgress : new Date());
  const [amount, setAmount] = useState(props.amount > 0 ? props.amount.toString() : "");
  const [description, setDescription] = useState(props.description ? props.description : "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearForm = () => {
    setId(null);
    setDateOfEgress(new Date());
    setAmount("");
    setDescription("");
    setErrorMessage(null);
  }

  const handleSubmit = async () => {
    if (props.forEdit) {
      try {
        await window.egressAPI?.updateEgress(
          id,
          dateOfEgress,
          amount ? Number(amount) : 0,
          description
        );
        showSuccessNotify("Egreso actualizado");
        clearForm();
        props.onSaveSuccess();
      } catch (error) {
        handleErrorMessage(error, setErrorMessage);
      }
    } else {
      try {
        await window.egressAPI?.saveEgress(
          dateOfEgress,
          amount ? Number(amount) : 0,
          description
        );
        showSuccessNotify("Egreso guardado");
        clearForm()
        props.onSaveSuccess();
      } catch (error) {
        handleErrorMessage(error, setErrorMessage);
      }
    }
  };

  useEffect(() => {
    setId(props.id);
    if (props.dateOfEgress) {
      if (typeof props.dateOfEgress === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(props.dateOfEgress)) {
        const parsed = parseLocalDate(props.dateOfEgress);
        setDateOfEgress(parsed ? parsed : new Date());
      } else {
        setDateOfEgress(props.dateOfEgress as Date);
      }
    } else {
      setDateOfEgress(new Date());
    }
    setAmount(props.amount.toString());
    setDescription(props.description);
    setErrorMessage(null);
  }, [props.id, props.dateOfEgress, props.amount, props.description]);

  const handleCancel = () => {
    clearForm();
    props.onCancel();
  };

  return (
    <div className='egress-form'>
      <h2>Datos del egreso:</h2>
      {
        errorMessage
          ?
          <div className='error-message-container'>
            <MdErrorOutline />
            <span>{errorMessage}</span>
          </div>
          :
          <></>
      }
      <label>Fecha del egreso:</label>
      <input
        type="date"
        value={toInputDateValue(dateOfEgress)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          const parsed = parseLocalDate(v);
          setDateOfEgress(parsed ? parsed : new Date());
        }} />
      <label>Monto:</label>
      <input
        type="number"
        value={amount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} />
      <label>Descripción:</label>
      <input
        type="text"
        value={description}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
      <OkCancelButtons
        onSave={handleSubmit}
        onCancel={handleCancel} />
    </div>
  );
}

export default EgressForm;