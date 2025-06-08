import '../stylesheets/PosMenu.css';
import { MdOutlinePointOfSale, MdOutlineInventory, MdOutlineSettings } from "react-icons/md";
import { BiArchiveOut } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa6";

const MenuOptions: 'ventas' | 'egresos' | 'inventario' | 'usuarios' | 'configuracion' = 'ventas';

interface PosMenuProps {
  className?: string;
  menuSelected?: string;
  onSalesClicked: () => void,
  onEgressClicked: () => void,
  onInventoryClicked: () => void,
  onUsersClicked: () => void,
  onSettingsClicked: () => void,
}

function PosMenu(props: PosMenuProps) {
  return (
    <div className={props.className}>
      <div className="menu-container">
        <PosMenuItem
          icon={<MdOutlinePointOfSale />}
          label="Ventas"
          isSelected={false}
          onClick={props.onSalesClicked} />
        <PosMenuItem
          icon={<BiArchiveOut />}
          label="Egresos"
          isSelected={false}
          onClick={props.onEgressClicked} />
        <PosMenuItem
          icon={<MdOutlineInventory />}
          label="Inventario"
          isSelected={false}
          onClick={props.onInventoryClicked} />
        <PosMenuItem
          icon={<FaUserTie />}
          label="Usuarios"
          isSelected={true}
          onClick={props.onUsersClicked} />
        <PosMenuItem
          icon={<MdOutlineSettings />}
          label="Configuración"
          isSelected={false}
          onClick={props.onSettingsClicked} />
      </div>
    </div>
  );
}

function PosMenuItem(props: { icon: React.ReactNode, label: string, isSelected: boolean, onClick: () => void }) {
  return (
    <div className={`menu-item ${props.isSelected ? 'selected' : ''}`.trim()} onClick={props.onClick}>
      <div className="trailing-icon">{props.icon ? props.icon : <></>}</div>
      <p className="menu-item-label">{props.label}</p>
    </div>
  );
}

export default PosMenu;