import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import Dropdown from "components/form/Dropdown";
import { objectToFormData } from "utils/helpers";
import {
  allocateJournalAbstract,
  fetchReviewrJournal,
  fetchReviewrJournalPaper,
} from "store/slices";

const AllocateProject = ({ onHide, handelSuccess, editData = {} }) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(true);
  const [journalList, setJournalList] = useState([]);
  const [abstarctLoading, setAbstarctLoading] = useState(false);
  const [paperList, setPaperList] = useState([]);
  const { id, name, email_id, phone_number } = editData;
  const handelSave = async (values) => {
    setBtnLoading(true);
    const response = await dispatch(
      allocateJournalAbstract(objectToFormData(values))
    );
    if (response?.status === 200) {
      handelSuccess();
    }
    setBtnLoading(false);
  };
  const getJournalPaper = async (paperID) => {
    setAbstarctLoading(true);
    const response = await dispatch(
      fetchReviewrJournalPaper(
        objectToFormData({
          journal_id: paperID,
        })
      )
    );
    let listData = response?.data || [];
    listData = listData?.filter((o) => `${o?.user_id}` !== `${id}`);
    setPaperList(listData);
    setAbstarctLoading(false);
  };
  const getReviewerJournals = async () => {
    const response = await dispatch(
      fetchReviewrJournal(objectToFormData({ user_id: id }))
    );
    setJournalList(response?.data || []);
    setEventLoading(false);
  };
  useEffect(() => {
    getReviewerJournals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    journals_id: Yup.string().required("Journal is required."),
    journal_paper_id: Yup.string().required("Journal paper is required."),
  });
  const initialValues = {
    user_id: id,
    journals_id: "",
    journal_paper_id: "",
  };
  return (
    <Modal onHide={onHide} title="Allocate Project" size="md">
      <div className="cmt-34 cms-20 cme-20 cmb-10">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handelSave}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit } = props;
            return (
              <form>
                <div className="row">
                  <div className="cmb-22">
                    <TextInput placeholder="Name" value={name} disabled />
                  </div>
                  <div className="cmb-22">
                    <TextInput
                      placeholder="Email ID"
                      value={email_id}
                      disabled
                    />
                  </div>
                  <div className="cmb-22">
                    <TextInput
                      placeholder="Phone Number"
                      value={phone_number}
                      disabled
                    />
                  </div>
                  <div className="cmb-22">
                    <Dropdown
                      id="journals_id"
                      options={journalList}
                      optionValue="journal_name"
                      value={values.journals_id}
                      error={errors.journals_id}
                      placeholder="Select journals"
                      isLoading={eventLoading}
                      onChange={(e) => {
                        getJournalPaper(e.target.value);
                        handleChange(e);
                      }}
                    />
                  </div>
                  <div className="cmb-22">
                    <Dropdown
                      options={paperList}
                      optionValue="paper_id"
                      extraDisplayKey="paper_title"
                      onChange={handleChange}
                      value={values.journal_paper_id}
                      error={errors.journal_paper_id}
                      disabled={!values.journals_id}
                      id="journal_paper_id"
                      placeholder="Select journal Paper"
                      isLoading={abstarctLoading}
                    />
                  </div>
                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <Button
                      isRounded
                      text="Cancel"
                      onClick={onHide}
                      btnStyle="light-outline"
                      className="cps-30 cpe-30"
                    />
                    <Button
                      isRounded
                      text="Done"
                      onClick={handleSubmit}
                      btnStyle="primary-dark"
                      btnLoading={btnLoading}
                      className="cps-30 cpe-30"
                      disabled={isEqual(values, initialValues)}
                    />
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AllocateProject;
