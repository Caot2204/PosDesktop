import './App.css';
import UsersScreen from './users/components/UsersScreen';
import PosMenu from './common/components/PosMenu';
import UserAvatar from './common/components/UserAvatar';


function App() {
  return (
    <>
      <div className="pos-header">
        <PosMenu
          className="pos-menu"
          onSalesClicked={() => console.log('Ventas clicked')}
          onEgressClicked={() => console.log('Egresos clicked')}
          onInventoryClicked={() => console.log('Inventario clicked')}
          onUsersClicked={() => console.log('Usuarios clicked')}
          onSettingsClicked={() => console.log('Configuración clicked')} />
        <UserAvatar />
      </div>
      <UsersScreen />
    </>
  )
}

export default App
