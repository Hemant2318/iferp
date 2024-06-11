import "./Card.scss";

const Card = ({ children, className, style, onClick }) => {
  return (
    <div
      id="custom-card-container"
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default Card;
