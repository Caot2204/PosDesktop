import '../stylesheets/PosInput.css';

interface PosInputProps {
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PosInput(props: PosInputProps) {
  return (
    <div className="pos-input">
      <label>{props.label}:</label>
      <input type="text" value={props.value} onChange={props.onChange} />
    </div>
  );
}

export default PosInput;