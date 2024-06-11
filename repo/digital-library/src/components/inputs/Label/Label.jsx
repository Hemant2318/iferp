const Label = ({ label, required, className }) => (
  <div id="field-label-container d-flex">
    <label
      className={`text-15-400 color-3d3d ${className ? className : ""}`}
      htmlFor={`${label}`}
    >
      {label}
      {required && "*"}
    </label>
  </div>
);

export default Label;
