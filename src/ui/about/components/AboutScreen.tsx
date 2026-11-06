import "../stylesheets/AboutScreen.css";
import type AboutInfo from "../../../types/AboutInfo";
import PosButton from "../../../ui/common/components/PosButton";
import { FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function AboutScreen(props: AboutInfo) {
  const { t } = useTranslation('global');

  return (
    <div className="about-container">
      <img className="logo-app" src="../icons/icon.png" alt="Icono de la aplicación" />
      <fieldset className="software-data">
        <legend>{t('screens.aboutPos.softwareData')}</legend>
        <div className="name-update-container">
          <span><strong>{props.name}</strong> - {props.version}</span>
          <PosButton
            className="update-button"
            label={t('screens.aboutPos.checkUpdates')}
            onClick={() => window.posSystemApi?.checkUpdates()} />
        </div>
        <span><strong>{t('screens.aboutPos.repository')}</strong> {props.repo.replace(".git", "")}</span>
      </fieldset>
      <fieldset className="author-container">
        <legend>{t('screens.aboutPos.authorData')}</legend>
        <span>{props.author}</span>
        <div className="github-container">
          <FaGithub className="github-icon" />
          <span><strong>Github:</strong> {props.github}</span>
        </div>
      </fieldset>
    </div>
  );
}