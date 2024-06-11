import "./Radiobutton.scss";

const Radiobutton = ({
  id,
  name,
  label,
  checked,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div id="radiobutton-container">
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
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

export default Radiobutton;
