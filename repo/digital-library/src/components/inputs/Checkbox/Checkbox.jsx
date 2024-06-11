import "./Checkbox.scss";

const Checkbox = ({ id, onClick, label, checked }) => {
  return (
    <div id="checkbox-container" className="form-check">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onClick={onClick}
        onChange={() => {}}
        className="form-check-input"
      />
      {label && <label className="form-check-label">{label}</label>}
    </div>
  );
};

export default Checkbox;
