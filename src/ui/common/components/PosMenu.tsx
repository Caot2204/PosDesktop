import '../stylesheets/PosMenu.css';
import { MdOutlinePointOfSale, MdOutlineInventory, MdOutlineSettings } from "react-icons/md";
import { BiArchiveOut } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa6";
import { Link, NavLink } from 'react-router';
import { useEffect, useState } from 'react';

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

  const [currentScreen, setCurrentScreen] = useState("ventas");

  return (
    <div className={props.className}>
      <div className="menu-container">
        <NavLink
          to=""
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<MdOutlinePointOfSale />}
            label="Ventas" />
        </NavLink>
        <NavLink
          to=""
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<BiArchiveOut />}
            label="Egresos" />
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<MdOutlineInventory />}
            label="Inventario" />
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<FaUserTie />}
            label="Usuarios" />
        </NavLink>
        <NavLink
          to=""
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<MdOutlineSettings />}
            label="Configuración" />
        </NavLink>
      </div>
    </div >
  );
}

function PosMenuItem(props: { icon: React.ReactNode, label: string }) {
  return (
    <>
      <div className="trailing-icon">{props.icon ? props.icon : <></>}</div>
      <p className="menu-item-label">{props.label}</p>
    </>
  );
}

export default PosMenu;