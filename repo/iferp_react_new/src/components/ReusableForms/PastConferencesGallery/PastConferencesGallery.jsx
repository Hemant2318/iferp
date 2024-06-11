import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, isEqual } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import { editEvent, showSuccess, throwError } from "store/slices";
import { getFilenameFromUrl, objectToFormData } from "utils/helpers";

const PastConferencesGallery = ({ eventId, fetchEventDetails }) => {
  const dispatch = useDispatch();
  const { pastConferenceGallery, proceeding_book } = useSelector((state) => ({
    pastConferenceGallery:
      state.global.eventData?.past_conference_gallery || [],
    proceeding_book: state.global.eventData?.proceeding_book || "",
  }));
  const validationSchema = Yup.object().shape({
    gallery: Yup.array(
      Yup.object({
        images: Yup.string().required("Image is required."),
      })
    ),
  });
  const initialValues = {
    proceeding_book: "",
    proceeding_book_name: proceeding_book
      ? getFilenameFromUrl(proceeding_book)
      : "",
    gallery:
      pastConferenceGallery.length > 0
        ? pastConferenceGallery
        : [
            {
              id: "",
              images: "",
              fileName: "",
            },
          ],
  };
  const [btnLoading, setBtnLoading] = useState(false);

  const handelSave = async (values) => {
    setBtnLoading(true);
    const payloadData = {
      ...values,
      past_conference_gallery: JSON.stringify(values.gallery),
      type: 5,
      id: eventId,
    };
    const payload = objectToFormData(payloadData);
    const response = await dispatch(editEvent(payload));
    if (response?.status === 200) {
      fetchEventDetails();
      const text = pastConferenceGallery.length > 0 ? "update" : "add";
      dispatch(showSuccess(`Past conferences gallery ${text} successfully.`));
    }
    setBtnLoading(false);
  };
  return (
    <div className="gallery-container">
      <Formik
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {(props) => {
          const { values, errors, handleSubmit, setFieldValue, resetForm } =
            props;
          return (
            <form>
              <div className="row d-flex align-items-center cpt-30">
                <div className="col-md-9 col-12">
                  <FileUpload
                    label="Proceeding Book"
                    id="proceeding_book"
                    onChange={(e) => {
                      const value = e.target.value;
                      const fileName = e.target.fileName;
                      let fileType = fileName
                        ? fileName?.split(".")?.pop()
                        : "";
                      if (["pdf"].includes(fileType)) {
                        setFieldValue("proceeding_book", value);
                        setFieldValue("proceeding_book_name", fileName);
                      } else {
                        setFieldValue("proceeding_book_name", "");
                        dispatch(
                          throwError({
                            message: "Only pdf file allow.",
                          })
                        );
                      }
                    }}
                    fileText={getFilenameFromUrl(
                      values?.proceeding_book_name || "Upload proceeding Book"
                    )}
                  />
                </div>
              </div>
              {values?.gallery.map((elem, index) => {
                return (
                  <div
                    className="row d-flex align-items-center cpt-30"
                    key={index}
                  >
                    <div className="col-md-9 col-12">
                      <FileUpload
                        label="Upload photo"
                        id={`gallery[${index}][images]`}
                        onChange={(e) => {
                          const id = e.target.id;
                          const value = e.target.value;
                          const fileName = e.target.fileName;
                          setFieldValue(
                            `gallery[${index}][fileName]`,
                            fileName
                          );
                          setFieldValue(id, value);
                        }}
                        fileText={getFilenameFromUrl(
                          values?.gallery?.[index]?.["fileName"] || elem.images
                        )}
                        error={errors?.gallery?.[index]?.["images"]}
                      />
                    </div>
                    {values?.gallery.length > 1 && (
                      <div className="col-md-3 col-10 d-flex justify-content-end">
                        <Button
                          onClick={() => {
                            const listArray = cloneDeep(values.gallery);
                            listArray.splice(index, 1);
                            setFieldValue("gallery", listArray);
                          }}
                          btnStyle="delete-outline"
                          icon={
                            <i className="bi bi-trash me-2 d-flex align-items-center" />
                          }
                          text="Delete"
                          className="cpt-5 cpb-5 cps-10 cpe-10"
                          isSquare
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="row cmt-20">
                <div className="col-md-6 d-flex">
                  <Button
                    onClick={() => {
                      const newArray = [
                        {
                          id: "",
                          images: "",
                          fileName: "",
                        },
                      ];
                      setFieldValue(`gallery`, [
                        ...values?.gallery,
                        ...newArray,
                      ]);
                    }}
                    text="+ Add Photo"
                    btnStyle="primary-light"
                    className="h-35 text-14-500"
                    isSquare
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center gap-4 cmt-20 col-md-12 col-10">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={resetForm}
                />
                <Button
                  text="Done"
                  isRounded
                  btnStyle="primary-dark"
                  className="cps-40 cpe-40"
                  onClick={handleSubmit}
                  btnLoading={btnLoading}
                  disabled={isEqual(values, { gallery: pastConferenceGallery })}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
export default PastConferencesGallery;
