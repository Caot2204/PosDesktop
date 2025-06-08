import '../stylesheets/UserAvatar.css';
import userAvatarImg from '../../assets/react.svg';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { useState } from 'react';

interface UserAvatarProps {
  name?: string;
  isAdmin?: boolean;
  avatarUrl?: string;
}

function UserAvatar(props: UserAvatarProps) {

  const [menuExpanded, setMenuExpanded] = useState(false);

  return (
    <div className="user-avatar-container">
      <img className="user-avatar" src={props.avatarUrl || userAvatarImg} alt="user avatar" />
      <div className="user-data-container">
        <p className="user-name">{props.name || 'Usuario'}</p>
        <p className="user-role">{props.isAdmin ? "Admin" : "Cajero"}</p>
      </div>
      <div className="user-avatar-menu">
        {menuExpanded ? (
          <AiFillCaretUp onClick={() => setMenuExpanded(false)} />
        ) : (
          <AiFillCaretDown onClick={() => setMenuExpanded(true)} />
        )}
      </div>
    </div>
  );
}

export default UserAvatar;