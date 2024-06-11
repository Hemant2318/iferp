import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cloneDeep } from "lodash";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import {
  eventAbstarctPath,
  eventAcceptanceLetterPath,
  eventPlagiarismDocumentPath,
  icons,
  journalAcceptanceLetterPath,
  journalPlagiarismDocumentPath,
  journalsPaperPath,
} from "utils/constants";
import {
  fetchJournalPapersDetails,
  fetchSubmittedAbstractsDetails,
  resubmittedPapers,
  updateReSubmittAbstract,
} from "store/slices";
import {
  getFilenameFromUrl,
  formatDate,
  downloadFile,
  objectToFormData,
  generatePreSignedUrl,
} from "utils/helpers";
import "./Paper.scss";
import { useNavigate, useParams } from "react-router-dom";

const ViewPaper = ({ id, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, eventId } = params;
  const [btnLoader, setBtnLoader] = useState("");
  const [initialValue, setInitialValue] = useState({
    abstract_path: "",
    abstract_path_file_name: "",
    reviewing_file: "",
    reviewing_file_name: "",
  });
  const [data, setData] = useState({
    status: "1",
    paper: "",
    paperDate: "",
    plagiarismDate: "",
    plagiarismComment: "",
    plagiarismDocument: "",
    isRepublish: "",
    republishDate: "",
    reviewDate: "",
    reviewComment: "",
    acceptanceDate: "",
    acceptanceStatus: "",
    registrationDate: "",
    acceptanceLetter: "",
    is_remodify: "",
    reviewing_file: "",
    is_registered_status: "0",
  });
  const handelChange = (e) => {
    let newValue = cloneDeep(initialValue);
    const id = e.target.id;
    const value = e.target.value;
    newValue = { ...newValue, [id]: value };
    if (id === "abstract_path") {
      const fileName = e.target.fileName;
      newValue = { ...newValue, abstract_path_file_name: fileName };
    }
    if (id === "reviewing_file") {
      const fileName = e.target.fileName;
      newValue = { ...newValue, reviewing_file_name: fileName };
    }
    setInitialValue(newValue);
  };
  const handelSave = async (status) => {
    setBtnLoader(status);
    let payloadData = {
      id: id,
    };
    switch (status) {
      case "2":
        if (type === "abstract") {
          payloadData = {
            ...payloadData,
            abstract_path: initialValue.abstract_path,
          };
        } else {
          payloadData = {
            ...payloadData,
            paper_image: initialValue.abstract_path,
          };
        }
        break;
      case "3":
        if (type === "abstract") {
          payloadData = {
            ...payloadData,
            is_remodify: "1",
            reviewing_file: initialValue.reviewing_file,
          };
        } else {
          payloadData = {
            ...payloadData,
            is_remodify: "1",
            reviewing_file: initialValue.reviewing_file,
          };
        }
        break;
      default:
        break;
    }
    handelUpdate(payloadData);
  };
  const handelUpdate = async (object) => {
    const payload = objectToFormData(object);
    if (type === "abstract") {
      let response = await dispatch(updateReSubmittAbstract(payload));
      if (response?.status === 200) {
        getAbstractDetails();
      }
    } else {
      let response = await dispatch(resubmittedPapers(payload));
      if (response?.status === 200) {
        getPaperDetails();
      }
    }
    setBtnLoader("");
  };
  const getPaperDetails = async () => {
    const response = await dispatch(fetchJournalPapersDetails(id));
    const { paperImage, submittedPapersStatus } = response?.data;
    handelData(paperImage, submittedPapersStatus);
  };
  const getAbstractDetails = async () => {
    const response = await dispatch(fetchSubmittedAbstractsDetails(id));
    const { abstractPath, submittedPapersStatus, is_event_registered } =
      response?.data;
    handelData(abstractPath, submittedPapersStatus, is_event_registered);
  };
  const handelData = (file, paperStatusData, is_event_registered = "") => {
    const {
      paper_submitted_date,
      paper_submitted_status,
      plagiarism_comment,
      plagiarism_date,
      plagiarism_document,
      is_republish_by_admin,
      republish_date,
      review_date,
      review_comment,
      acceptance_date,
      acceptance_status,
      registration_date,
      registration_acceptance_letter,
      is_remodify,
      reviewing_file,
      is_registered_status,
    } = paperStatusData;
    setData({
      paper: file,
      status: +paper_submitted_status || 1,
      paperDate: paper_submitted_date,
      isRepublish: is_republish_by_admin,
      republishDate: republish_date,
      plagiarismDate: plagiarism_date,
      plagiarismComment: plagiarism_comment,
      plagiarismDocument: plagiarism_document,
      reviewDate: review_date,
      reviewComment: review_comment,
      acceptanceDate: acceptance_date,
      acceptanceStatus: acceptance_status,
      registrationDate: registration_date,
      acceptanceLetter: registration_acceptance_letter,
      is_remodify: is_remodify,
      reviewing_file: reviewing_file,
      is_event_registered: is_event_registered,
      is_registered_status: is_registered_status,
    });
  };
  useEffect(() => {
    if (type === "paper") {
      getPaperDetails();
    } else if (type === "abstract") {
      getAbstractDetails();
    } else {
      // nothing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    status,
    paper,
    paperDate,
    plagiarismDate,
    plagiarismComment,
    plagiarismDocument,
    isRepublish,
    republishDate,
    reviewDate,
    reviewComment,
    acceptanceDate,
    acceptanceStatus,
    registrationDate,
    acceptanceLetter,
    is_remodify,
    reviewing_file: reviewingFile,
    is_event_registered,
    is_registered_status,
  } = data;
  const {
    abstract_path,
    abstract_path_file_name,
    reviewing_file,
    reviewing_file_name,
  } = initialValue;
  return (
    <div id="common-paper-container">
      <div className="graph-flow-container">
        {/* STEP 1  */}
        <div className="d-flex justify-content-start">
          <div className="flow-icon-block">
            <img src={icons.paperSubmitted} alt="submit" />
          </div>
          <div>
            <div className="text-12-400 color-dark-silver">STEP 01</div>
            <div className="text-15-500 color-black-olive">Paper Submitted</div>
            {paperDate && (
              <div className="lable-button-block mt-2">
                {formatDate(paperDate)}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <div className="sparator-block">
            <span className="hr-line" />
          </div>
          <div className="d-flex flex-column cmt-30 cmb-30">
            {status === 1 && (
              <div>
                <span className="me-1 text-15-500">Status:</span>
                <span className="text-14-400">Pending</span>
              </div>
            )}
            {/* {[1, 2].includes(status) && ( */}
            <div className="mt-3">
              <Button
                isRounded
                text="Download"
                btnStyle={"primary-outline"}
                onClick={async () => {
                  if (paper) {
                    let downloadContent = "";
                    if (type === "abstract") {
                      downloadContent = await generatePreSignedUrl(
                        paper,
                        eventAbstarctPath
                      );
                    } else {
                      downloadContent = await generatePreSignedUrl(
                        paper,
                        journalsPaperPath
                      );
                    }
                    dispatch(downloadFile(downloadContent));
                  }
                }}
              />
            </div>
          </div>
        </div>
        {/* STEP 2  */}
        <div className="d-flex justify-content-start cmt-12">
          <div className="flow-icon-block">
            <img src={icons.paperCheck} alt="submit" />
          </div>
          <div>
            <div className="text-12-400 color-dark-silver">STEP 02</div>
            <div className="text-15-500 color-black-olive">
              Plagiarism Check
            </div>
            {plagiarismDate && (
              <div className="lable-button-block mt-2">
                {formatDate(plagiarismDate)}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <div className="sparator-block">
            <span className="hr-line" />
          </div>
          <div className="d-flex align-items-center w-100">
            <div className="w-75">
              {status >= 2 && (
                <div className="mt-3 ms-2">
                  <div className="cmt-30 cmb-20">
                    <span className="me-1 text-15-500">Comment:</span>
                    <span className="text-14-400">{plagiarismComment}</span>
                  </div>
                  {plagiarismDocument && (
                    <div className="mt-3 d-flex cmb-10">
                      <Button
                        isRounded
                        text="Download"
                        btnStyle={"primary-outline"}
                        onClick={async () => {
                          let downloadContent = "";
                          if (type === "abstract") {
                            downloadContent = await generatePreSignedUrl(
                              plagiarismDocument,
                              eventPlagiarismDocumentPath
                            );
                          } else {
                            downloadContent = await generatePreSignedUrl(
                              plagiarismDocument,
                              journalPlagiarismDocumentPath
                            );
                          }
                          dispatch(downloadFile(downloadContent));
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              {isRepublish === "1" && plagiarismDate && (
                <div className="ms-2 cmb-20">
                  {republishDate && (
                    <div className="lable-button-block cmt-30 cmb-20">
                      Resubmission Deadline - {formatDate(republishDate)}
                    </div>
                  )}
                  <div className="cmb-22">
                    <FileUpload
                      label="Document*"
                      id="abstract_path"
                      value={abstract_path}
                      onChange={handelChange}
                      labelClass="text-15-500 mb-1"
                      fileText={getFilenameFromUrl(abstract_path_file_name)}
                    />
                  </div>

                  <div className="d-flex gap-3">
                    <Button
                      isRounded
                      text="Resubmit"
                      btnStyle="primary-dark"
                      className="cps-40 cpe-40"
                      btnLoading={btnLoader === "2"}
                      disabled={!abstract_path}
                      onClick={() => {
                        handelSave("2");
                      }}
                    />
                  </div>
                </div>
              )}
              {status < 2 && (
                <div className="cmt-20 cmb-30 ms-2">
                  <span className="me-1 text-15-500">Status:</span>
                  <span className="text-14-400">Plagiarism Check</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* STEP 3  */}
        <div className="d-flex justify-content-start cmt-12">
          <div className="flow-icon-block">
            <img src={icons.paperReview} alt="submit" />
          </div>
          <div>
            <div className="text-12-400 color-dark-silver">STEP 03</div>
            <div className="text-15-500 color-black-olive">Review</div>
            {reviewDate && (
              <div className="lable-button-block mt-2">
                {formatDate(reviewDate)}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <div className="sparator-block">
            <span className="hr-line" />
          </div>
          <div className="d-flex align-items-center w-75">
            <div className="w-100 cmb-20 cmt-20">
              {status >= 3 && (
                <>
                  {reviewingFile && (
                    <div className="d-flex mb-3">
                      <Button
                        isRounded
                        text="Download"
                        btnStyle="primary-outline"
                        className="cps-30 cpe-30"
                        onClick={async () => {
                          let downloadContent = "";
                          if (type === "abstract") {
                            downloadContent = await generatePreSignedUrl(
                              reviewingFile,
                              eventAbstarctPath
                            );
                          } else {
                            downloadContent = await generatePreSignedUrl(
                              reviewingFile,
                              journalsPaperPath
                            );
                          }
                          dispatch(downloadFile(downloadContent));
                        }}
                      />
                    </div>
                  )}
                  {reviewComment && (
                    <div>
                      <span className="me-1 text-15-500">Comment:</span>
                      <span className="text-14-400">{reviewComment}</span>
                    </div>
                  )}
                  {is_remodify === "1" && (
                    <div className="cmt-20">
                      <div className="cmb-22">
                        <FileUpload
                          label="Document*"
                          id="reviewing_file"
                          value={reviewing_file}
                          onChange={handelChange}
                          labelClass="text-15-500 mb-1"
                          fileText={getFilenameFromUrl(reviewing_file_name)}
                        />
                      </div>

                      <div className="d-flex gap-3">
                        <Button
                          isRounded
                          text="Resubmit"
                          btnStyle="primary-dark"
                          className="cps-30 cpe-30"
                          btnLoading={btnLoader === "3"}
                          disabled={!reviewing_file}
                          onClick={() => {
                            handelSave("3");
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              {(status <= 2 || !reviewComment) && (
                <div>
                  <span className="me-1 text-15-500">Status:</span>
                  <span className="text-14-400">Under Review</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* STEP 4  */}
        <div className="d-flex justify-content-start cmt-12">
          <div className="flow-icon-block">
            <img src={icons.paperAccepted} alt="submit" />
          </div>
          <div>
            <div className="text-12-400 color-dark-silver">STEP 04</div>
            <div className="text-15-500 color-black-olive">
              Acceptance Status
            </div>
            {acceptanceDate && (
              <div className="lable-button-block mt-2">
                {formatDate(acceptanceDate)}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <div className="sparator-block">
            <span className="hr-line" />
          </div>
          <div className="cmt-30 cmb-30">
            {status >= 4 && (
              <div>
                <span className="me-1 text-15-500">Status:</span>
                <span className="text-14-400">
                  {acceptanceStatus === "0" ? "Rejected" : "Accepted"}
                </span>
              </div>
            )}
            {status <= 3 && (
              <div>
                <span className="me-1 text-15-500">Status:</span>
                <span className="text-14-400">Acceptance Status</span>
              </div>
            )}
            {status === 5 && (
              <div className="cmt-30 d-flex">
                <Button
                  isRounded
                  icon={<i className="bi bi-download me-2" />}
                  text="Acceptance Letter"
                  btnStyle="primary-dark"
                  className="cps-30 cpe-30"
                  onClick={async () => {
                    let downloadContent = "";
                    if (type === "abstract") {
                      downloadContent = await generatePreSignedUrl(
                        acceptanceLetter,
                        eventAcceptanceLetterPath
                      );
                    } else {
                      downloadContent = await generatePreSignedUrl(
                        acceptanceLetter,
                        journalAcceptanceLetterPath
                      );
                    }
                    dispatch(downloadFile(downloadContent));
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {/* STEP 5  */}
        <div className="d-flex justify-content-start cmt-12">
          <div className="flow-icon-block">
            <img src={icons.paperRegister} alt="submit" />
          </div>
          <div>
            <div className="text-12-400 color-dark-silver">STEP 05</div>
            <div className="text-15-500 color-black-olive">
              Registration Status
            </div>
            {registrationDate && (
              <div className="lable-button-block mt-2">
                {formatDate(registrationDate)}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <div className="sparator-block"></div>
          <div className="w-75 cmb-16">
            {type === "abstract" ? (
              acceptanceLetter ? (
                <div className="d-flex mt-3">
                  <Button
                    onClick={() => {
                      localStorage.isRedirectToRegister = 1;
                      localStorage.prevRoute = window.location.pathname;
                      navigate(
                        `/${memberType}/conferences-and-events/event-details/${eventId}/conference-details`
                      );
                    }}
                    text={is_event_registered ? "Registered" : "Register"}
                    btnStyle="primary-dark"
                    className={`text-14-500 ${
                      is_event_registered ? "cps-24 cpe-24" : "cps-32 cpe-32"
                    }`}
                    disabled={type === "abstract" ? is_event_registered : true}
                    isRounded
                  />
                </div>
              ) : (
                <div className="text-15-400 color-black-olive">
                  Not Registered
                </div>
              )
            ) : (
              <div
                className={`text-15-400 color-black-olive ${
                  registrationDate ? "mt-3" : ""
                }`}
              >
                {is_registered_status === "1" ? "Registered" : "Not Registered"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewPaper;
