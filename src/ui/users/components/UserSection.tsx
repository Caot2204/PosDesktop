import '../stylesheets/UserSection.css';
import User from '../../../data/model/User';
import UserItem from './UserItem';

interface UserSectionProps {
  role: string;
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string, isAdmin: boolean) => void;
}

function UserSection(prop: UserSectionProps) {
  return (
    <div className="user-section-container">
      <h2>{prop.role}</h2>
      {
        prop.users.map((user) => (
          <UserItem 
            key={user.id} 
            name={user.name}
            onUpdate={() => prop.onUpdateUser(user)}
            onDelete={() => prop.onDeleteUser(user.id!!, user.isAdmin)} />
        ))
      }
    </div>
  );
}

export default UserSection;