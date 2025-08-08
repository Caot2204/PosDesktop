import '../stylesheets/LoginScreen.css';
import { useEffect, useState } from 'react';
import userAvatarImg from '../../assets/react.svg';
import PosButton from '../../common/components/PosButton';
import UserSession from '../../../data/model/UserSession';
import { showErrorNotify } from '../../utils/NotifyUtils';

interface LoginScreenProps {
  onLogin: (userSesion: UserSession) => void;
}

function LoginScreen(props: LoginScreenProps) {
  const [bussinessName, setBussinessName] = useState("");
  const [bussinessLogoUrl, setBussinessLogoUrl] = useState('../assets/react.svg');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userSession = await window.userAPI?.login(username, password);
      if (userSession) {
        props.onLogin(userSession);
      } else {
        showErrorNotify("Usuario o contraseña inválidos");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      window.posConfigAPI?.getPosConfig()
        .then(posConfig => {
          setBussinessName(posConfig?.bussinessName);
          setBussinessLogoUrl(posConfig?.bussinessLogoUrl);
        });    
    }, []);

  return (
    <div className="loginscreen-container">
      <img className="bussiness-logo" src={bussinessLogoUrl} alt="logo del negocio" />
      <h2>{bussinessName}</h2>
      <input
        className="loginscreen-input"
        type="text"
        placeholder='Nombre de usuario'
        onChange={(e) => setUsername(e.target.value)} />
      <input
        className="loginscreen-input"
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)} />
      <PosButton
        disabled={!username || !password}
        label="Iniciar sesión"
        onClick={handleLogin} />
    </div>
  );
}

export default LoginScreen;