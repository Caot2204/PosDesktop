import '../stylesheets/EgressItem.css';
import { formatOnlyDate } from '../../../ui/utils/FormatUtils';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import { formatNumberToCurrentPrice } from '../../../ui/utils/FormatUtils';

interface EgressDataProps {
  dateOfEgress: Date;
  amount: number;
  description: string;
  userToRegister: string;
  currentUserName: string;
  onUpdate: () => void;
  onDelete: () => void;
}

function EgressItem(props: EgressDataProps) {
  return (
    <tr className='egress-data-container'>
      <td>{formatOnlyDate(props.dateOfEgress)}</td>
      <td>{formatNumberToCurrentPrice(props.amount)}</td>
      <td>{props.userToRegister}</td>
      <td>{props.description}</td>
      <td className="egress-actions-cell">
        {
          props.currentUserName === props.userToRegister
            ?
            <div className="egress-button-actions">
              <AiOutlineEdit className="egress-edit-button" onClick={props.onUpdate} />
              <RiDeleteBin6Line className="egress-delete-button" onClick={props.onDelete} />
            </div>
            :
            <></>
        }
      </td>
    </tr>
  );
}

export default EgressItem;