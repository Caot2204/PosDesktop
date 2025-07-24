import '../stylesheets/PosMenu.css';
import { MdOutlinePointOfSale, MdOutlineInventory, MdOutlineSettings } from "react-icons/md";
import { BiArchiveOut } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa6";
import { NavLink } from 'react-router';
import type UserSession from '../../../data/model/UserSession';

interface PosMenuProps {
  className?: string;
  userSession: UserSession;
}

function PosMenu(props: PosMenuProps) {
  return (
    <div className={props.className}>
      <div className="menu-container">
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<MdOutlinePointOfSale />}
            label="Ventas" />
        </NavLink>
        <NavLink
          to="/egress"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<BiArchiveOut />}
            label="Egresos" />
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<MdOutlineInventory />}
            label="Inventario" />
        </NavLink>
        {
          props.userSession.isAdmin ?
            <>
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
                to="/configuration"
                className={({ isActive }) =>
                  isActive ? "menu-item selected" : "menu-item"
                }
              >
                <PosMenuItem
                  icon={<MdOutlineSettings />}
                  label="Configuración" />
              </NavLink>
            </>
            :
            <></>
        }
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