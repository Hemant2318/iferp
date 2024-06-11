import { useEffect, useState } from "react";
import moment from "moment";
import { cloneDeep } from "lodash";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import DatePicker from "components/form/DatePicker";
import RadioInput from "components/form/RadioInput";
import FileUpload from "components/form/FileUpload";
import Loader from "components/Layout/Loader";
import Card from "components/Layout/Card";
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
  formatDate,
  downloadFile,
  objectToFormData,
  getFilenameFromUrl,
  getDataFromLocalStorage,
  generatePreSignedUrl,
} from "utils/helpers";
import {
  updateSubmittedPapers,
  fetchJournalPapersDetails,
  fetchSubmittedAbstractsDetails,
  updateEventsSubmittedAbstractStatus,
  journalRegisteredStatusChange,
} from "store/slices";
import "./Paper.scss";

const Paper = () => {
  const isEvent =
    window.location.pathname.includes("event-management") ||
    window.location.pathname.includes("my-events") ||
    window.location.pathname.includes("my-profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [paperData, setPaperData] = useState(null);
  const params = useParams();
  const [data, setData] = useState({
    paper_submitted_status: "",
    plagiarism_comment: "",
    plagiarism_document: "",
    review_comment: "",
    acceptance_status: "",
    registration_acceptance_letter: "",
    acceptance_date: "",
    paper_submitted_date: "",
    plagiarism_date: "",
    review_date: "",
    registration_date: "",
    plagiarism_document_file_name: "",
    acceptance_letter_file_name: "",
    republish_date: "",
    is_republish_by_admin: "0",
    is_remodify: "2",
    reviewing_file: "",
    reviewing_file_file_name: "",
  });
  const handleRedirect = () => {
    navigate(-1);
  };
  const getPaperDetails = async () => {
    let response = null;
    if (isEvent) {
      response = await dispatch(fetchSubmittedAbstractsDetails(params.paperId));
    } else {
      response = await dispatch(fetchJournalPapersDetails(params.paperId));
    }
    const resData = response?.data || null;

    const statusData = resData?.submittedPapersStatus || {};
    setPaperData(resData);
    setData({
      ...data,
      ...statusData,
      plagiarism_document_file_name: getFilenameFromUrl(
        statusData?.plagiarism_document
      ),
      acceptance_letter_file_name: getFilenameFromUrl(
        statusData?.registration_acceptance_letter
      ),
    });
    setLoading(false);
    setBtnLoader("");
  };
  const handelChange = (e) => {
    let newValue = cloneDeep(data);
    const id = e.target.id;
    const value = e.target.value;
    newValue = { ...newValue, [id]: value };

    if (id === "plagiarism_document") {
      const fileName = e.target.fileName;
      newValue = { ...newValue, plagiarism_document_file_name: fileName };
    }
    if (id === "registration_acceptance_letter") {
      const fileName = e.target.fileName;
      newValue = { ...newValue, acceptance_letter_file_name: fileName };
    }
    setData(newValue);
  };
  const handelSave = (status) => {
    setBtnLoader(status);
    let payloadData = {
      id: params.paperId,
    };
    switch (status) {
      case "1":
        payloadData = {
          ...payloadData,
          paper_submitted_date: data.paper_submitted_date,
          paper_submitted_status: "1",
        };
        break;
      case "2":
        payloadData = {
          ...payloadData,
          paper_submitted_status: "2",
          republish_date: data.republish_date,
          plagiarism_comment: data.plagiarism_comment,
          plagiarism_document: data.plagiarism_document,
          is_republish_by_admin: data.is_republish_by_admin,
        };
        break;
      case "3":
        payloadData = {
          ...payloadData,
          paper_submitted_status: "3",
          is_remodify: data.is_remodify,
          review_comment: data.review_comment,
        };
        break;
      case "4-0":
        payloadData = {
          ...payloadData,
          paper_submitted_status: "4",
          acceptance_status: 0,
        };
        break;
      case "4-1":
        payloadData = {
          ...payloadData,
          paper_submitted_status: "4",
          acceptance_status: 1,
        };
        break;
      case "5":
        payloadData = {
          ...payloadData,
          paper_submitted_status: "5",
          registration_acceptance_letter: data.registration_acceptance_letter,
        };
        break;

      default:
        break;
    }
    handelUpdate(payloadData);
  };
  const handelUpdate = async (object) => {
    const payload = objectToFormData(object);
    let response = null;
    if (isEvent) {
      response = await dispatch(updateEventsSubmittedAbstractStatus(payload));
    } else {
      response = await dispatch(updateSubmittedPapers(payload));
    }
    if (response?.status === 200) {
      getPaperDetails();
    } else {
      setBtnLoader("");
    }
  };
  useEffect(() => {
    getPaperDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    abstractPath,
    authorName,
    memberId,
    paperId,
    paperTitle,
    conference,
    journalName,
    journalType,
    is_event_registered,
    paperImage,
    submission_type,
    presentation_type,
    comments,
    source,
    email,
    contact_number,
    whatapp_number,
    country,
    state,
    city,
    course,
    department,
    university,
    institution,
    co_author_details,
  } = paperData || {};
  const {
    paper_submitted_status,
    paper_submitted_date: paperSubmittedDate,
    plagiarism_date: plagiarismDate,
    plagiarism_comment: plagiarismComment,
    plagiarism_document: plagiarismDocument,
    plagiarism_document_file_name: plagiarismDocumentFileName,
    republish_date: republishDate,
    is_republish_by_admin: isRepublish,
    review_date: reviewDate,
    review_comment: reviewComment,
    acceptance_status: acceptanceStatus,
    registration_acceptance_letter: registrationAcceptanceLetter,
    acceptance_letter_file_name: acceptanceLetterFileName,
    registration_date: registrationDate,
    acceptance_date: acceptanceDate,
    is_remodify: isRemodify,
    reviewing_file: reviewingFile,
    is_registered_status,
  } = data || {};
  const coAuthor = co_author_details?.filter((o) => o.name);
  const iCoAuthor = co_author_details?.filter((o) => o.co_author_email_invite);
  const status = +paper_submitted_status || 1;
  const isAdmin = ["0", "6"].includes(getDataFromLocalStorage("user_type"));
  const paperURL = isEvent ? abstractPath || "" : paperImage || "";
  const isAbstract = paperData?.submission_type;
  return (
    <div id="common-paper-container">
      {!isLoading && (
        <Card className="cps-24 cpt-12 cpb-12 d-flex align-items-center cmb-12 ">
          <span className="d-flex" onClick={handleRedirect}>
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>
          <span className="text-16-400 color-black-olive">
            {paperData?.paperId}
          </span>
        </Card>
      )}
      <Card className="cps-24 cpe-24 cpt-20 cpb-20">
        {isLoading ? (
          <div className="pt-5 pb-5">
            <Loader size="md" />
          </div>
        ) : (
          <div className="row">
            {authorName && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Author Name
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {authorName}
                </div>
              </div>
            )}
            {email && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  {isAbstract ? "Author Email Id" : "Email Id"}
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {email}
                </div>
              </div>
            )}
            {contact_number && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  {isAbstract ? "Author Contact Number" : "Contact Number"}
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {contact_number}
                </div>
              </div>
            )}
            {whatapp_number && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Author Whatsapp Number
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {whatapp_number}
                </div>
              </div>
            )}
            {country && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  {isAbstract ? "Author Country" : "Country"}
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {country}
                </div>
              </div>
            )}
            {state && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  State
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {state}
                </div>
              </div>
            )}
            {city && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  City
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {city}
                </div>
              </div>
            )}
            {course && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Course
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {course}
                </div>
              </div>
            )}
            {department && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Department
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {department}
                </div>
              </div>
            )}
            {university && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  University
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {university}
                </div>
              </div>
            )}
            {institution && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Institution
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {institution}
                </div>
              </div>
            )}
            {coAuthor?.length > 0 && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Co Author
                </div>
                <div className="col-md-8 text-16-500 color-black-olive d-flex gap-2">
                  {coAuthor.map((elm, index) => {
                    return (
                      <span
                        key={index}
                        className="ps-2 pe-2 pt-1 pb-1 text-12-400 bg-navy-light rounded color-navy-title"
                      >
                        {elm.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {iCoAuthor?.length > 0 && (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Invited Co Author
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {iCoAuthor.map((elm, index) => {
                    return (
                      <span
                        key={index}
                        className="ps-2 pe-2 pt-1 pb-1 text-12-400 bg-navy-light rounded color-navy-title"
                      >
                        {elm.co_author_email_invite}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="row cmb-20">
              <div className="col-md-4 text-16-400 color-black-olive">
                Member ID
              </div>
              <div className="col-md-8 text-16-500 color-black-olive">
                {memberId}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-4 text-16-400 color-black-olive">
                Paper ID
              </div>
              <div className="col-md-8 text-16-500 color-black-olive">
                {paperId}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-4 text-16-400 color-black-olive">
                Paper Title
              </div>
              <div className="col-md-8 text-16-500 color-black-olive">
                {paperTitle}
              </div>
            </div>
            {isAbstract === "Abstract Submission" ? (
              <>
                <div className="row cmb-20">
                  <div className="col-md-4 text-16-400 color-black-olive">
                    Submission Type
                  </div>
                  <div className="col-md-8 text-16-500 color-black-olive">
                    {submission_type}
                  </div>
                </div>
                <div className="row cmb-20">
                  <div className="col-md-4 text-16-400 color-black-olive">
                    Presentation Type
                  </div>
                  <div className="col-md-8 text-16-500 color-black-olive">
                    {presentation_type}
                  </div>
                </div>
                {source && (
                  <div className="row cmb-20">
                    <div className="col-md-4 text-16-400 color-black-olive">
                      Source Type
                    </div>

                    <div className="col-md-8 text-16-500 color-black-olive">
                      {source}
                    </div>
                  </div>
                )}
                {comments && (
                  <div className="row cmb-20">
                    <div className="col-md-4 text-16-400 color-black-olive">
                      Comments
                    </div>
                    <div className="col-md-8 text-16-500 color-black-olive">
                      {comments}
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {isEvent ? (
              <div className="row cmb-20">
                <div className="col-md-4 text-16-400 color-black-olive">
                  Conference Name
                </div>
                <div className="col-md-8 text-16-500 color-black-olive">
                  {conference}
                </div>
              </div>
            ) : (
              <>
                <div className="row cmb-20">
                  <div className="col-md-4 text-16-400 color-black-olive">
                    Journal Name
                  </div>
                  <div className="col-md-8 text-16-500 color-black-olive">
                    {journalName}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 text-16-400 color-black-olive">
                    Journal Type
                  </div>
                  <div className="col-md-8 text-16-500 color-black-olive">
                    {journalType}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
      {!isLoading && (
        <>
          <Card className="cmt-20 cps-24 cpt-12 cpb-12 d-flex justify-content-between align-items-center cmb-12 ">
            <span className="text-18-400 color-black-olive">Status</span>
            {/* <span
              className="text-14-400 color-silver-gray pointer"
              onClick={() => {
                getPaperDetails();
              }}
            >
              <i className="bi bi-arrow-clockwise" />
            </span>
            <span className="me-3">
              <div
                className="text-14-400 color-silver-gray pointer"
                onClick={() => {
                  handelSave("1");
                }}
              >
                <i className="bi bi-pencil me-2" />
                Edit
              </div>
            </span> */}
          </Card>
          <Card className="cps-46 cpt-46 cpe-46 cpb-46">
            <div className="graph-flow-container">
              {/* STEP 1  */}
              <div className="d-flex justify-content-start">
                <div className="flow-icon-block">
                  <img src={icons.paperSubmitted} alt="submit" />
                </div>
                <div>
                  <div className="text-12-400 color-dark-silver">STEP 01</div>
                  <div className="text-15-500 color-black-olive">
                    Paper Submitted
                  </div>
                  {paperSubmittedDate && (
                    <div className="lable-button-block mt-2">
                      {formatDate(paperSubmittedDate)}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-start">
                <div className="sparator-block">
                  <span className="hr-line" />
                </div>
                <div className="d-flex flex-column cmt-30">
                  {paperURL ? (
                    <div className="mb-3">
                      <Button
                        isRounded
                        btnStyle="primary-outline"
                        className="cps-20 cpe-20"
                        text={isEvent ? "View Abstract" : "View Journal"}
                        onClick={async () => {
                          let downloadContent = "";
                          if (isEvent) {
                            downloadContent = await generatePreSignedUrl(
                              paperURL,
                              eventAbstarctPath
                            );
                          } else {
                            downloadContent = await generatePreSignedUrl(
                              paperURL,
                              journalsPaperPath
                            );
                          }
                          dispatch(downloadFile(downloadContent));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <span className="me-1 text-15-500">Status:</span>
                      <span className="text-14-400">Pending</span>
                    </div>
                  )}
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
                {/* {isAdmin ? ( */}
                <div className="d-flex align-items-center w-100">
                  <div className="w-75 ms-2">
                    {status === 1 ? (
                      <div>
                        <div className="d-flex gap-3 cmb-16">
                          <Label label="Abstract Plagiarized?" />
                          <div className="d-flex gap-3">
                            <RadioInput
                              value="1"
                              label="Yes"
                              onChange={handelChange}
                              id="is_republish_by_admin"
                              checked={isRepublish === "1"}
                            />
                            <RadioInput
                              value="0"
                              label="No"
                              onChange={handelChange}
                              id="is_republish_by_admin"
                              checked={isRepublish === "0"}
                            />
                          </div>
                        </div>
                        <div className="cmb-16">
                          <TextArea
                            label="Comment"
                            labelClass="text-15-500 mb-1"
                            placeholder="Add Comments"
                            id="plagiarism_comment"
                            onChange={handelChange}
                            value={plagiarismComment}
                            disabled={status >= 2}
                            rows={3}
                          />
                        </div>
                        {isRepublish === "1" && (
                          <>
                            <div className="cmb-16">
                              <FileUpload
                                label="Upload Document"
                                labelClass="text-15-500 mb-1"
                                fileText={getFilenameFromUrl(
                                  plagiarismDocumentFileName
                                )}
                                id="plagiarism_document"
                                onChange={handelChange}
                                value={plagiarismDocument}
                                disabled={status >= 2}
                              />
                            </div>
                            <div className="cmb-16">
                              <DatePicker
                                id="republish_date"
                                label="Republish Date"
                                labelClass="text-15-500 mb-1"
                                placeholder="Select Republish Date"
                                minDate={moment()}
                                onChange={handelChange}
                                value={republishDate}
                              />
                            </div>
                          </>
                        )}
                        <div className="d-flex gap-3 cmb-16">
                          <Button
                            isRounded
                            text="Submit"
                            btnStyle="primary-dark"
                            className="cps-40 cpe-40"
                            btnLoading={btnLoader === "2"}
                            onClick={() => {
                              handelSave("2");
                            }}
                            disabled={
                              plagiarismComment
                                ? isRepublish === "1"
                                  ? plagiarismDocument && republishDate
                                    ? false
                                    : true
                                  : false
                                : true
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="cmt-16">
                        {plagiarismDocument && (
                          <div className="d-flex cmb-16">
                            <Button
                              isRounded
                              text="Download"
                              btnStyle={"primary-outline"}
                              onClick={async () => {
                                let downloadContent = "";
                                if (isEvent) {
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
                        <div className="cmb-16">
                          <span className="me-1 text-15-500">Comment:</span>
                          <span className="text-14-400">
                            {plagiarismComment}
                          </span>
                        </div>
                        {republishDate && (
                          <div className="lable-button-block cmb-16">
                            Resubmission Deadline - {formatDate(republishDate)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* ) : (
                  <div className="w-100">
                    {status < 2 ? (
                      <div className="cmt-20 cmb-30 ms-2">
                        <span className="me-1 text-15-500">Status:</span>
                        <span className="text-14-400">Plagiarism Check</span>
                      </div>
                    ) : (
                      <>
                        <div className="cmt-20 cmb-30 ms-2">
                          <span className="me-1 text-15-500">Comment:</span>
                          <span className="text-14-400">
                            {plagiarismComment}
                          </span>
                        </div>
                        {republishDate && (
                          <div className="lable-button-block cmb-16">
                            Resubmission Deadline - {formatDate(republishDate)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )} */}
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
                  {isAdmin && <span className="hr-line" />}
                </div>
                <div className="d-flex align-items-center w-75">
                  <div className="w-100">
                    {reviewingFile && (
                      <div className="d-flex cmb-16 cmt-16">
                        <Button
                          isRounded
                          text="Download"
                          btnStyle="primary-outline"
                          className="cps-30 cpe-30"
                          onClick={async () => {
                            let downloadContent = "";
                            if (isEvent) {
                              downloadContent = await generatePreSignedUrl(
                                reviewingFile,
                                eventAbstarctPath
                              );
                            } else {
                              downloadContent = await generatePreSignedUrl(
                                paperURL,
                                journalsPaperPath
                              );
                            }
                            dispatch(downloadFile(downloadContent));
                            // dispatch(downloadFile(reviewingFile));
                          }}
                        />
                      </div>
                    )}
                    {[2, 3].includes(status) &&
                    paperData?.submittedPapersStatus?.is_remodify === "0" &&
                    paperData?.submittedPapersStatus?.is_republish_by_admin ===
                      "0" ? (
                      <div>
                        <div className="d-flex gap-3">
                          <Label label="Abstract Re-modify?" />
                          <div className="d-flex gap-3 cmb-16">
                            <RadioInput
                              value="1"
                              label="Yes"
                              id="is_remodify"
                              onChange={handelChange}
                              checked={isRemodify === "1"}
                            />
                            <RadioInput
                              value="2"
                              label="No"
                              id="is_remodify"
                              onChange={handelChange}
                              checked={isRemodify === "2"}
                            />
                          </div>
                        </div>
                        <div className="cmb-16">
                          <TextArea
                            label="Comment"
                            labelClass="text-15-500 mb-1"
                            placeholder="Add Comments"
                            id="review_comment"
                            onChange={handelChange}
                            value={reviewComment}
                            rows={3}
                          />
                        </div>
                        <div className="d-flex">
                          <Button
                            text="Submit"
                            isRounded
                            btnStyle="primary-dark"
                            className="cps-30 cpe-30"
                            onClick={() => {
                              handelSave("3");
                            }}
                            disabled={!(reviewComment && isRemodify)}
                            btnLoading={btnLoader === "3"}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="cmb-16 cmt-16">
                        {reviewComment && (
                          <div className="cmb-16">
                            <span className="me-1 text-15-500">Comment:</span>
                            <span className="text-14-400">{reviewComment}</span>
                          </div>
                        )}
                        {status < 3 && (
                          <div>
                            <span className="me-1 text-15-500">Status:</span>
                            <span className="text-14-400">Under Review</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isAdmin && (
                <>
                  {/* STEP 4  */}
                  <div className="d-flex justify-content-start cmt-12">
                    <div className="flow-icon-block">
                      <img src={icons.paperAccepted} alt="submit" />
                    </div>
                    <div>
                      <div className="text-12-400 color-dark-silver">
                        STEP 04
                      </div>
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
                    <div className="w-75">
                      {status === 3 &&
                        paperData?.submittedPapersStatus?.is_remodify ===
                          "2" && (
                          <div className="d-flex gap-3 cmt-10 cmb-20">
                            <Button
                              isRounded
                              text="Accept"
                              btnStyle="primary-dark"
                              className="cps-40 cpe-40"
                              onClick={() => {
                                handelSave("4-1");
                              }}
                              btnLoading={btnLoader === "4-1"}
                            />
                            <Button
                              isRounded
                              text="Reject"
                              btnStyle="primary-outline"
                              className="cps-40 cpe-40"
                              onClick={() => {
                                handelSave("4-0");
                              }}
                              btnLoading={btnLoader === "4-0"}
                            />
                          </div>
                        )}
                      {status >= 4 && (
                        <div className="cmt-30 cmb-20">
                          <span className="me-1 text-15-500">Status:</span>
                          <span className="text-14-400">
                            {acceptanceStatus === "0" ? "Rejected" : "Accepted"}
                          </span>
                        </div>
                      )}
                      {acceptanceStatus === "1" && status === 4 && (
                        <>
                          <div>
                            <FileUpload
                              label="Acceptance Letter"
                              labelClass="text-15-500 mb-1"
                              id="registration_acceptance_letter"
                              onChange={handelChange}
                              value={registrationAcceptanceLetter}
                              fileText={getFilenameFromUrl(
                                acceptanceLetterFileName
                              )}
                            />
                          </div>
                          <div className="d-flex cmt-22 mb-2">
                            <Button
                              isRounded
                              text="Done"
                              btnStyle="primary-dark"
                              className="cps-40 cpe-40"
                              btnLoading={btnLoader === "5"}
                              disabled={!registrationAcceptanceLetter}
                              onClick={() => {
                                handelSave("5");
                              }}
                            />
                          </div>
                        </>
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
                              if (isEvent) {
                                downloadContent = await generatePreSignedUrl(
                                  registrationAcceptanceLetter,
                                  eventAcceptanceLetterPath
                                );
                              } else {
                                downloadContent = await generatePreSignedUrl(
                                  registrationAcceptanceLetter,
                                  journalAcceptanceLetterPath
                                );
                              }
                              dispatch(downloadFile(downloadContent));
                            }}
                          />
                        </div>
                      )}
                      {status <= 3 &&
                        paperData?.submittedPapersStatus?.is_remodify !==
                          "2" && (
                          <div className="cmb-20">
                            <span className="me-1 text-15-500">Status:</span>
                            <span className="text-14-400">
                              Acceptance Status
                            </span>
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
                      <div className="text-12-400 color-dark-silver">
                        STEP 05
                      </div>
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
                    <div className="w-75">
                      {isAdmin && isEvent ? (
                        <div className="mt-3 text-15-500 color-black-olive">
                          {is_event_registered
                            ? "Registered"
                            : "Not Registered"}
                        </div>
                      ) : (
                        <div className="mt-3 text-15-500 color-black-olive">
                          {is_registered_status === "1" ? (
                            "Registered"
                          ) : (
                            <div className="d-flex">
                              <Button
                                onClick={async () => {
                                  const response = await dispatch(
                                    journalRegisteredStatusChange(
                                      params.paperId
                                    )
                                  );
                                  if (response?.status === 200) {
                                    getPaperDetails();
                                  }
                                }}
                                text="Register"
                                btnStyle="primary-dark"
                                className="text-14-500 cps-32 cpe-32"
                                isRounded
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
export default Paper;
