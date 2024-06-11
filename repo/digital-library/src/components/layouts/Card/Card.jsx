import "./Card.scss";

const Card = ({ children, className, style }) => {
  return (
    <div id="custom-card-container" className={className} style={style}>
      {children}
    </div>
  );
};
export default Card;
