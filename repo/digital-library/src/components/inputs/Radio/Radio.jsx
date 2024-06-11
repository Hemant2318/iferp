import "./Radio.scss";

const Radio = ({ onClick, checked, id, label }) => {
  return (
    <div id="radio-container" className="form-check">
      <input
        id={id}
        type="radio"
        checked={checked}
        onClick={onClick}
        onChange={() => {}}
        className="form-check-input"
      />
      {label && <label className="form-check-label">{label}</label>}
    </div>
  );
};

export default Radio;
