import "../stylesheets/AboutScreen.css";
import type AboutInfo from "../../../types/AboutInfo";
import PosButton from "../../../ui/common/components/PosButton";

export default function AboutScreen(props: AboutInfo) {
  return (
    <div className="about-container">
      <img className="logo-app" src="../icons/icon.png" alt="Icono de la aplicación" />
      <fieldset className="software-data">
        <legend>Punto de venta:</legend>
        <div className="name-update-container">
          <span><strong>{props.name}</strong> - {props.version}</span>
          <PosButton
            className="update-button"
            label="Buscar actualizaciones"
            onClick={() => { }} />
        </div>
        <span><strong>Repositorio:</strong> {props.repo.replace(".git", "")}</span>
      </fieldset>
      <fieldset className="author-container">
        <legend>Autor:</legend>
        <span>{props.author}</span>
        <span><strong>Github:</strong> {props.github}</span>
      </fieldset>
    </div>
  );
}