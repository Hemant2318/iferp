import { ListGroup } from "react-bootstrap";
import Modal from "components/Layout/Modal";

const ViewAllFeedbackPopup = ({ list, onHide, categoryIcon, opinionIcon }) => {
  return (
    <Modal onHide={onHide} title={list[0]?.user_name}>
      <div className="cps-30 cpe-30 cpb-20 cmt-50">
        <ListGroup className="unset-br">
          {list.map((elm, index) => {
            const { message, category, opinion } = elm;
            return (
              <ListGroup.Item
                key={index}
                className="d-flex align-items-center flex-wrap"
              >
                <span> {message}</span>
                {category && (
                  <span className="pt-1 pb-1 ps-2 pe-2 ms-1 bg-title-navy color-white text-12-400 text-nowrap">
                    {categoryIcon[category]}
                    {category}
                  </span>
                )}
                {opinion && (
                  <span className="ms-2 text-18-400">
                    {opinionIcon[opinion]}
                  </span>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </Modal>
  );
};
export default ViewAllFeedbackPopup;
