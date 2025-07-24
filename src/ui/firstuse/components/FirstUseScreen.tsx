import '../stylesheets/FirstUseScreen.css';
import { useState } from 'react';
import PosButton from '../../common/components/PosButton';

interface FirstUseScreenProps {
  onSuccessfullyCreateAccount: () => void;
}

function FirstUseScreen(props: FirstUseScreenProps) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateFirstUser = async () => {
    await window.userAPI?.saveUser(userName, password, true);
    props.onSuccessfullyCreateAccount();
  };

  return (
    <div className="first-use-screen-container">
      <div className="form-container">
        <h2>Cree su primer cuenta de administrador</h2>
        <label><strong>Nombre de usuario:</strong></label>
        <input
          type="text"
          onChange={(e) => setUserName(e.target.value)} />
        <label><strong>Contraseña:</strong></label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)} />
        <PosButton
          disabled={!userName || !password}
          label="Crear cuenta"
          onClick={handleCreateFirstUser} />
      </div>
      <div className="data-software">
        <p>PosDesktop v1.0 - LastDreamSoft</p>
      </div>
    </div>
  );
}

export default FirstUseScreen;