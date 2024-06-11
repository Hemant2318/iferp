import { useEffect, useState } from "react";
import Modal from "components/Layout/Modal";
import Label from "components/form/Label";
import TextArea from "components/form/TextArea";
import Button from "components/form/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  generatePreSignedUrl,
  getBase64,
  objectToFormData,
} from "utils/helpers";
import { cloneDeep } from "lodash";
import { useDispatch } from "react-redux";
import { addFigures, deleteFigures } from "store/slices";
import "./FigureForm.scss";
import { figuresPath } from "utils/constants";

const defaultData = {
  id: "",
  figure: "",
  caption: "",
};

const FigureForm = ({
  onHide,
  postID,
  handleSuccess,
  editData,
  getPostDetails,
}) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [initialValues, setInitialValues] = useState({
    figures: [],
  });
  const handleDelete = async (id) => {
    const response = await dispatch(
      deleteFigures(
        objectToFormData({
          id: id,
          post_id: postID,
        })
      )
    );
    setIsDelete(response?.status === 200 ? true : false);
    return response?.status === 200 ? true : false;
  };
  const handleSave = async (values) => {
    setBtnLoading(true);
    const response = await dispatch(addFigures({ ...values, post_id: postID }));
    if (response?.status === 200) {
      handleSuccess();
    }
    setBtnLoading(false);
  };
  const handleFigure = async (newData) => {
    const promises = newData.map(async (elm) => {
      let response = await generatePreSignedUrl(elm.figure, figuresPath);
      return { ...elm, s3File: response };
    });
    const results = await Promise.all(promises);
    setInitialValues({ figures: results });
  };
  useEffect(() => {
    if (editData.length > 0) {
      handleFigure(editData);
    } else {
      setInitialValues({ figures: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validationSchema = Yup.object().shape({
    figures: Yup.array(
      Yup.object({
        figure: Yup.string().required("Figure is required."),
        caption: Yup.string().required("Caption is required."),
      })
    ),
  });

  return (
    <Modal
      onHide={() => {
        if (isDelete) {
          getPostDetails();
        }
        onHide();
      }}
    >
      <div className="cpb-20 cps-20 cpe-20 cpt-30" id="figure-form-container">
        <Formik
          enableReinitialize
          onSubmit={handleSave}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, handleSubmit, setFieldValue, handleChange } = props;
            const { figures } = values;
            const isSubmit = figures.some((e) => !e.caption || !e.figure);
            return (
              <form>
                <div className="text-16-500 cmb-22">
                  Figure ({figures.length})
                </div>
                {figures.length === 0 ? (
                  <div className="border rounded pt-5 pb-5 center-flex">
                    <Button
                      text="Upload figures"
                      btnStyle="primary-outline"
                      className="cps-20 cpe-20 h-35 text-14-500"
                      onClick={() => {
                        setFieldValue("figures", [defaultData]);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {figures.map((elem, index) => {
                      const { id, caption, figure, s3File } = elem;
                      const isAddMore = caption && figure;
                      return (
                        <div className="row" key={index}>
                          <div className="d-flex justify-content-end">
                            <Button
                              text={<i className="bi bi-trash text-15-400" />}
                              btnStyle="delete-outline"
                              className="h-35 text-14-500"
                              onClick={async () => {
                                let isDelete = false;
                                if (id) {
                                  isDelete = await handleDelete(id);
                                } else {
                                  isDelete = true;
                                }
                                if (isDelete) {
                                  const listArray = cloneDeep(figures);
                                  listArray.splice(index, 1);
                                  setFieldValue("figures", listArray);
                                }
                              }}
                            />
                          </div>
                          <div className="col-md-6 cmb-22">
                            <div className="h-100 d-flex flex-column">
                              <Label label="Figure" required />
                              <div className="border flex-grow-1 rounded">
                                {figure ? (
                                  <div
                                    style={{
                                      height: "123px",
                                    }}
                                  >
                                    <img
                                      src={s3File || figure}
                                      alt="figure"
                                      className="fill fit-image"
                                    />
                                  </div>
                                ) : (
                                  <label id="cus-fi-upoad">
                                    <span className="border ps-2 pe-2 pt-1 pb-1 rounded-pill">
                                      Upload figure
                                    </span>
                                    <input
                                      type="file"
                                      name="fileToUpload"
                                      id="fileToUpload"
                                      size="1"
                                      onChange={async (e) => {
                                        let selectFile = e.target.files[0];
                                        let base64File = await getBase64(
                                          selectFile
                                        );
                                        handleChange({
                                          target: {
                                            id: `figures[${index}][figure]`,
                                            value: base64File,
                                          },
                                        });
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 cmb-22">
                            <TextArea
                              isRequired
                              rows={5}
                              value={caption}
                              label="Caption"
                              placeholder="Enter caption for figure"
                              id={`figures[${index}][caption]`}
                              onChange={handleChange}
                            />
                          </div>
                          {figures.length - 1 === index && (
                            <div className="d-flex justify-content-end">
                              <Button
                                text="+Add More"
                                btnStyle="primary-outline"
                                className="cps-20 cpe-20 h-35 text-14-500"
                                disabled={!isAddMore}
                                onClick={() => {
                                  setFieldValue("figures", [
                                    ...figures,
                                    defaultData,
                                  ]);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="d-flex justify-content-center gap-4 cmt-20 col-md-12">
                      <Button
                        isRounded
                        text="Cancel"
                        btnStyle="light-outline"
                        className="cps-40 cpe-40"
                        onClick={onHide}
                      />
                      <Button
                        isRounded
                        text="Done"
                        btnStyle="primary-dark"
                        className="cps-40 cpe-40"
                        onClick={handleSubmit}
                        btnLoading={btnLoading}
                        disabled={isSubmit}
                      />
                    </div>
                  </>
                )}
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default FigureForm;
