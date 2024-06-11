const Label = ({ label, required, className }) => (
  <div id="field-label-container d-flex">
    <label
      className={`text-16-400 color-raisin-black ${className ? className : ""}`}
      htmlFor={`${label}`}
    >
      {label}
      {required && "*"}
    </label>
  </div>
);

export default Label;
