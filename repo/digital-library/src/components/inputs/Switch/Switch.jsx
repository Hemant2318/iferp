import "./Switch.scss";

const Switch = ({ id, name, label, checked, value, onChange, disabled }) => {
  return (
    <div id="switch-container">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          value={value}
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      </div>
    </div>
  );
};

export default Switch;
