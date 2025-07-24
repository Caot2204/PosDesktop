import '../stylesheets/UserAvatar.css';
import { FaSignOutAlt } from "react-icons/fa";

interface UserAvatarProps {
  name: string;
  isAdmin: boolean;
  onLogout: () => void;
}

function UserAvatar(props: UserAvatarProps) {
  return (
    <div className="usersession-container">
      <p className="user-name"><strong>Atiende: </strong>{props.name || 'Usuario'}</p>
      <FaSignOutAlt
        className="logout-icon"
        onClick={props.onLogout} />
    </div>
  );
}

export default UserAvatar;