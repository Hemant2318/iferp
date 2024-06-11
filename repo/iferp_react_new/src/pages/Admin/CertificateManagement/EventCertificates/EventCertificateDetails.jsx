import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { filter } from "lodash";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Button from "components/form/Button";
import { certificateField, certificatePath, icons } from "utils/constants";
import DeletePopup from "components/Layout/DeletePopup";
import Modal from "components/Layout/Modal";
import CustomCertificate from "components/Layout/CustomCertificate";
import {
  bytesToBase64,
  generatePreSignedUrl,
  getCertificatePdf,
  getDataFromLocalStorage,
  objectToFormData,
  urlToUnitArray,
} from "utils/helpers";
import {
  fetchUserEventDetails,
  getEvent,
  showSuccess,
  storeEventData,
  uploadEventCertificate,
  deleteEventCertificate,
} from "store/slices";

const EventCertificateDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { eventID } = params;
  const [viewSample, setViewSample] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [deleteID, setDeleteID] = useState("");
  const [uploadData, setUploadData] = useState({
    show: false,
    title: "",
  });
  const { eventData, comitteeMemberCategoryList } = useSelector((state) => ({
    eventData: state.global.eventData,
    comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
  }));
  const fetchEventDetails = async () => {
    if (getDataFromLocalStorage("user_type") === "0") {
      await dispatch(getEvent(eventID));
    } else {
      await dispatch(
        fetchUserEventDetails({
          event_id: eventID,
          user_id: getDataFromLocalStorage("id"),
        })
      );
    }
    setIsFormLoading(false);
  };
  const handleView = async (data) => {
    const { certificate_file, filed_data } = data;
    const s3File = await generatePreSignedUrl(
      certificate_file,
      certificatePath
    );
    const byteURL = await urlToUnitArray(s3File);
    const newFieldData = JSON.parse(filed_data).map((elm) => {
      const findVal = certificateField.find(
        (o) => o.id === elm.fieldName
      )?.exText;
      return { ...elm, value: findVal };
    });
    const pdfBytes = await getCertificatePdf(byteURL, newFieldData);
    var b64 = bytesToBase64(pdfBytes);
    setViewSample(`data:application/pdf;base64,${b64}`);
  };
  const handleDelete = (data) => {
    setDeleteID(data);
  };
  useEffect(() => {
    fetchEventDetails();
    return () => {
      dispatch(storeEventData({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { show, title, sub_type, user_type, oldData } = uploadData;
  const { event_name, ocm_categories_id, certificate } = eventData || {};
  let ocmList = [];
  ocmList = filter(comitteeMemberCategoryList, (o) => {
    return ocm_categories_id?.includes(o.id);
  });
  ocmList.push({ id: "", user_type: "3", name: "Keynote Speakers" });
  ocmList.push({ id: "", user_type: "1", name: "Participation" });
  ocmList.push({ id: "", user_type: "4", name: "Research Paper Presentation" });
  return (
    <>
      {viewSample && (
        <Modal
          fullscreen
          largeClose
          onHide={() => {
            setViewSample("");
          }}
        >
          <iframe
            frameBorder="0"
            className="w-100"
            src={`${viewSample}#toolbar=0&navpanes=0`}
            title="description"
            style={{
              width: "100%",
              height: "99%",
            }}
          />
        </Modal>
      )}
      {deleteID && (
        <DeletePopup
          title="Delete Certificate"
          message="Are you sure you want to delete this certificate?"
          onHide={() => {
            setDeleteID("");
          }}
          handelSuccess={() => {
            fetchEventDetails();
            setDeleteID("");
          }}
          handelDelete={async () => {
            let findVal = ocmList?.find((o) => o.name === deleteID);
            let payload = {
              event_id: eventID,
              user_type: findVal?.user_type || "2",
              user_type_category: findVal?.id || findVal?.user,
            };
            let forData = objectToFormData(payload);
            const response = await dispatch(deleteEventCertificate(forData));
            return response;
          }}
        />
      )}
      {show && (
        <CustomCertificate
          title={title}
          oldData={oldData}
          handleAPI={async (values) => {
            const payload = {
              certificate: values.certificate,
              field_data: JSON.stringify(values.fieldData),
              event_id: eventID,
              user_type: user_type,
              user_type_category: sub_type,
            };
            return await dispatch(
              uploadEventCertificate(objectToFormData(payload))
            );
          }}
          handleSuccess={() => {
            fetchEventDetails();
            dispatch(showSuccess("Certificate upload successfully."));
            setUploadData({
              show: false,
              title: "",
            });
          }}
          onHide={() => {
            setUploadData({
              show: false,
              title: "",
            });
          }}
        />
      )}
      {isFormLoading ? (
        <Card className="cmt-24 cmb-24 cps-30 cpe-30 cpt-40 cpb-40 d-flex align-items-center justify-content-center unset-br">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <Card className="d-flex gap-3 p-3 mb-3">
            <div>
              <img
                src={icons.leftArrow}
                alt="back"
                className="h-21 pointer"
                onClick={() => {
                  navigate(-1);
                }}
              />
            </div>
            <div className="text-16-500">{event_name}</div>
          </Card>
          <div>
            {ocmList.map((elm, index) => {
              const { id, user_type, name } = elm;
              const findData = certificate?.find((o) => {
                let rVal = null;
                if (o.user_type === "2" && o.user_type_catgeory === `${id}`) {
                  return o;
                }
                if (o.user_type === user_type) {
                  return o;
                }
                return rVal;
              });
              let isExist = findData?.id ? true : false;

              return (
                <React.Fragment key={index}>
                  <Card className="cmb-20 p-3 unset-br d-flex justify-content-between align-items-center">
                    <div className="text-15-500">{name}</div>
                    <div className="d-flex gap-3">
                      {isExist ? (
                        <>
                          <Button
                            btnStyle="primary-outline"
                            className="h-35 text-14-400"
                            onClick={() => {
                              handleView(findData);
                            }}
                            rightIcon={<i className="bi bi-eye" />}
                          />
                          <Button
                            btnStyle="primary-outline"
                            className="h-35 text-14-400"
                            onClick={() => {
                              setUploadData((prev) => {
                                return {
                                  ...prev,
                                  show: true,
                                  title: `${name} Certificate`,
                                  sub_type: id,
                                  user_type: user_type ? user_type : "2",
                                  oldData: findData,
                                };
                              });
                            }}
                            rightIcon={<i className="bi bi-pencil-square" />}
                          />
                          <Button
                            btnStyle="delete-outline"
                            className="h-35 text-14-400"
                            onClick={() => {
                              handleDelete(name);
                            }}
                            rightIcon={<i className="bi bi-trash" />}
                          />
                        </>
                      ) : (
                        <Button
                          btnStyle="primary-outline"
                          className="h-35 text-14-400"
                          text="Upload Certificate"
                          onClick={() => {
                            setUploadData((prev) => {
                              return {
                                ...prev,
                                show: true,
                                title: `${name} Certificate`,
                                sub_type: id,
                                user_type: user_type ? user_type : "2",
                              };
                            });
                          }}
                          rightIcon={<i className="bi bi-upload ms-2" />}
                        />
                      )}
                    </div>
                  </Card>
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default EventCertificateDetails;
