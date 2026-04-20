import '../stylesheets/PosMenu.css';
import { MdOutlinePointOfSale, MdOutlineInventory } from "react-icons/md";
import { BiArchiveOut } from "react-icons/bi";
import { FaUserTie, FaShop } from "react-icons/fa6";
import { NavLink } from 'react-router';
import type UserSession from '../../../data/model/UserSession';
import { AiFillFileText } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

interface PosMenuProps {
  className?: string;
  userSession: UserSession;
}

function PosMenu(props: PosMenuProps) {
  const { t } = useTranslation('global');
  const location = useLocation();

  return (
    <div className={props.className}>
      <div className="menu-container">
        <NavLink
          to="/sales"
          className={({ isActive }) => {
            const manualActive = location.pathname === "/" || location.pathname.includes("sales");
            return isActive || manualActive ? "menu-item selected" : "menu-item";
          }}
        >
          <PosMenuItem
            icon={<MdOutlinePointOfSale />}
            label={t('mainMenu.sales')} />
        </NavLink>
        <NavLink
          to="/egress"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<BiArchiveOut />}
            label={t('mainMenu.egresses')} />
        </NavLink>
        <NavLink
          to="/cotizations"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<AiFillFileText />}
            label={t('mainMenu.cotizations')} />
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive ? "menu-item selected" : "menu-item"
          }
        >
          <PosMenuItem
            icon={<MdOutlineInventory />}
            label={t('mainMenu.inventory')} />
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
                  label={t('mainMenu.users')} />
              </NavLink>
              <NavLink
                to="/administration"
                className={({ isActive }) => {
                  const isInBalanceScreen = location.pathname.includes("balance");
                  return isActive || isInBalanceScreen ? "menu-item selected" : "menu-item";
                }}
              >
                <PosMenuItem
                  icon={<FaShop />}
                  label={t('mainMenu.administration')} />
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