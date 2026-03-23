import '../stylesheets/LoginScreen.css';
import { useEffect, useState } from 'react';
import PosButton from '../../common/components/PosButton';
import UserSession from '../../../data/model/UserSession';
import { showErrorNotify } from '../../utils/NotifyUtils';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface LoginScreenProps {
  onLogin: (userSesion: UserSession) => void;
}

function LoginScreen(props: LoginScreenProps) {
  const { t } = useTranslation('global');
  const [bussinessName, setBussinessName] = useState('');
  const [bussinessLogoUrl, setBussinessLogoUrl] = useState('../icons/icon.png');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userSession = await window.userAPI?.login(username, password);
      props.onLogin(userSession);
    } catch (error) {
      showErrorNotify(t('screens.login.invalidData'));
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
      <img className="bussiness-logo" src={bussinessLogoUrl} alt={t('screens.login.altLogo')} />
      <h2>{bussinessName}</h2>
      <input
        className="loginscreen-input"
        type="text"
        placeholder={t('screens.login.userNameLabel')}
        onChange={(e) => setUsername(e.target.value)} />
      <input
        className="loginscreen-input"
        type="password"
        placeholder={t('screens.login.passwordLabel')}
        onChange={(e) => setPassword(e.target.value)} />
      <PosButton
        disabled={!username || !password}
        label={t('screens.login.loginLabel')}
        onClick={handleLogin} />
      <ToastContainer />
    </div>
  );
}

export default LoginScreen;