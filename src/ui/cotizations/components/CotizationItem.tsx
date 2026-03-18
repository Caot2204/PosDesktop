import '../stylesheets/CotizationItem.css';
import { formatOnlyDate } from '../../../ui/utils/FormatUtils';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegFilePdf } from "react-icons/fa6";

interface CotizationItemProps {
  id: number;
  dateOfCotization: Date;
  client: string;
  userToRegister: string;
  currentUserName: string;
  onExportPdf: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

function CotizationItem(props: CotizationItemProps) {
  return (
    <tr className='cotization-data-row'>
      <td>{props.id}</td>
      <td>{props.client}</td>
      <td>{formatOnlyDate(props.dateOfCotization)}</td>
      <td className='cotization-action-cell'>
        {
          props.currentUserName === props.userToRegister
            ?
            <div className="cotization-button-actions">
              <FaRegFilePdf className='cotization-pdf-button' onClick={props.onExportPdf} />
              <AiOutlineEdit className="cotization-edit-button" onClick={props.onUpdate} />
              <RiDeleteBin6Line className="cotization-delete-button" onClick={props.onDelete} />
            </div>
            :
            <></>
        }
      </td>
    </tr>
  );
}

export default CotizationItem;