import '../stylesheets/UserAvatar.css';
import { FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface UserAvatarProps {
  name: string;
  isAdmin: boolean;
  onLogout: () => void;
}

function UserAvatar(props: UserAvatarProps) {
  const { t } = useTranslation('global');
  
  return (
    <div className="usersession-container">
      <p className="user-name"><strong>{t('mainMenu.attend')}</strong>{props.name || t('mainMenu.userNameLabel')}</p>
      <FaSignOutAlt
        className="logout-icon"
        onClick={props.onLogout} />
    </div>
  );
}

export default UserAvatar;