import { useState } from "react";
import Button from "../../form/Button";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { throwError, throwSuccess } from "store/slices";
import Dropdown from "components/form/Dropdown";
import { Formik } from "formik";
import { titleCaseString } from "utils/helpers";
import { useParams } from "react-router-dom";

const DeletePopup = ({
  message = "Are you sure you want to delete this record?",
  onHide,
  handelSuccess,
  handelDelete,
  list,
  data,
}) => {
  const params = useParams();
  const { type } = params;
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();
  const deleteRecord = async (values) => {
    setBtnLoading(true);
    const response = await handelDelete(values);
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      handelSuccess();
    } else if (response?.status === 400) {
      const errRes = { message: response?.message };
      dispatch(throwError(errRes));
    } else {
      dispatch(throwError(response?.message));
    }
    setBtnLoading(false);
  };

  const initialValues = {
    id: "",
  };

  return (
    <Modal
      onHide={onHide}
      title={titleCaseString(data?.topics) || "Delete Record"}
    >
      <div className="center-flex text-20-400 cmt-30">{message}</div>

      <Formik initialValues={initialValues} onSubmit={deleteRecord}>
        {(props) => {
          const { values, handleChange, handleSubmit } = props;
          return (
            <form>
              <div className="row cmt-34 cms-10 cme-10 cmb-24">
                <div className="col-md-6 cmb-22">
                  <Dropdown
                    label={`For Assign ${
                      type === "topics" ? "Topic" : "Department"
                    }`}
                    id="id"
                    placeholder={`Select ${
                      type === "topics" ? "Topic" : "Department"
                    } for the assign`}
                    value={values?.id}
                    options={list}
                    optionValue={type === "topics" ? "topics" : "department"}
                    optionKey="id"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-4 cmt-30">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-30 cpe-30"
                  onClick={onHide}
                />
                <Button
                  isRounded
                  text={type === "topics" ? "Map" : "Delete"}
                  btnStyle={type === "topics" ? "primary-dark" : "danger-dark"}
                  className={
                    type === "topics" ? "cps-40 cpe-40" : "cps-30 cpe-30"
                  }
                  onClick={handleSubmit}
                  btnLoading={btnLoading}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default DeletePopup;
