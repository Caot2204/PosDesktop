import '../stylesheets/UserSection.css';
import User from '../../../data/model/User.ts';
import UserItem from './UserItem.tsx';

interface UserSectionProps {
  role: string;
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

function UserSection(prop: UserSectionProps) {
  return (
    <div className="user-section-container">
      <h2>{prop.role}</h2>
      {
        prop.users.map((user) => (
          <UserItem 
            key={user.id} 
            userId={user.id}
            name={user.name}
            onUpdate={() => prop.onUpdateUser(user)}
            onDelete={() => prop.onDeleteUser(user.id!!)} />
        ))
      }
    </div>
  );
}

export default UserSection;