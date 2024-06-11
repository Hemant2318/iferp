import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual, map, omit } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import Label from "components/form/Label";
import TextArea from "components/form/TextArea";
import RadioInput from "components/form/RadioInput";
import {
  generatePreSignedUrl,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
  trimLeftSpace,
} from "utils/helpers";
import { createPost, setMyNetworkDetails, storePostList } from "store/slices";
import { networkPath } from "utils/constants";

const DOIDetails = ({
  onHide,
  editData,
  postData,
  handelSuccess,
  type,
  isAdmin,
  isAbstarctRequired,
}) => {
  const { id, additional_details = {} } = editData;
  const dispatch = useDispatch();
  const { postList, myNetworkDetails } = useSelector((state) => ({
    postList: state.global.postList,
    myNetworkDetails: state.global.myNetworkDetails,
  }));
  const [btnLoading, setBtnLoading] = useState("");
  const handelSave = async (values) => {
    setBtnLoading(values ? "submit" : "skip");
    let coAuthors =
      postData?.coAuthors.length > 0
        ? map(postData?.coAuthors, (o) => {
            return o.email;
          })?.toString()
        : "";
    let objectData = omit(
      {
        ...values,
        ...postData,
        co_authors: coAuthors,
        user_id: getDataFromLocalStorage("id"),
      },
      ["fileName", "coAuthors"]
    );
    if (values) {
      objectData = { ...objectData, ...values, additional_details: 1 };
    }
    if (id) {
      objectData = { ...objectData, post_id: id };
    }
    const response = await dispatch(createPost(objectToFormData(objectData)));
    if (response?.status === 200) {
      let postResponse = "";
      let presantationRes = "";
      let thumbnailRes = "";
      if (response?.data?.post) {
        postResponse = await generatePreSignedUrl(
          response?.data.post,
          networkPath
        );
      }
      if (response?.data?.presentation_link) {
        presantationRes = await generatePreSignedUrl(
          response?.data.presentation_link,
          networkPath
        );
      }
      if (response?.data?.thumbnail) {
        thumbnailRes = await generatePreSignedUrl(
          response?.data.thumbnail,
          networkPath
        );
      }
      let resData = {
        ...response?.data,
        nPost: postResponse,
        nPresentationLink: presantationRes,
        nThumbnail: thumbnailRes,
      };
      if (id) {
        const newList = postList.map((elem) => {
          if (elem.id === id) {
            elem = resData;
          }
          return elem;
        });
        dispatch(storePostList(newList));
      } else {
        incresePost();
        if (type === "my-posts") {
          dispatch(storePostList([...postList, resData]));
        }
      }
      handelSuccess();
    }
    setBtnLoading("");
  };
  const incresePost = () => {
    const newData = {
      ...myNetworkDetails,
      total_posts: myNetworkDetails.total_posts + 1 || 1,
    };
    dispatch(setMyNetworkDetails(newData));
  };
  const validationSchema = Yup.object().shape({
    is_peer_reviewed: Yup.string().required("Select Any One."),
    about_article: Yup.lazy((value) => {
      if (isAbstarctRequired) {
        return Yup.string()
          .required("Abstract/Description is required.")
          .test(
            "len",
            "Maximum 500 words allow for this field.",
            (val) => val && val?.split(" ").length <= 500
          );
      } else {
        if (value) {
          return Yup.string().test(
            "len",
            "Maximum 500 words allow for this field.",
            (val) => val && val?.split(" ").length <= 500
          );
        } else {
          return Yup.string();
        }
      }
    }),
  });

  const initialValues = {
    about_article: additional_details?.about_article || "",
    is_peer_reviewed: additional_details?.is_peer_reviewed || "",
    journal_name: additional_details?.journal_name || "",
    existing_doi: additional_details?.existing_doi || "",
  };

  return (
    <Modal onHide={onHide} title="Add Details">
      <div className="cmt-34 cms-34 cme-34 cmb-22">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit } = props;
            const { about_article } = values;
            const { about_article: err_about_article } = errors;
            return (
              <form>
                <div className="row d-flex justify-conent-between cmb-22">
                  <div className="col-md-12">
                    <TextArea
                      rows={3}
                      isRequired={isAbstarctRequired}
                      label="Abstract/Description"
                      placeholder="Enter about your Article"
                      value={about_article}
                      error={err_about_article}
                      id="about_article"
                      onChange={(e) =>
                        handleChange({
                          target: {
                            id: "about_article",
                            value: trimLeftSpace(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="d-flex flex-wrap">
                  <div className="cme-30">
                    <Label label="Has this been peer-reviewed?" required />
                  </div>
                  <div className="d-flex flex-grow-1 gap-3">
                    <RadioInput
                      name="is_peer_reviewed"
                      label="Yes"
                      // className="pe-4"
                      value={"1"}
                      onChange={handleChange}
                      checked={values.is_peer_reviewed === "1"}
                    />
                    <RadioInput
                      name="is_peer_reviewed"
                      label="No"
                      value={"0"}
                      onChange={handleChange}
                      checked={values.is_peer_reviewed === "0"}
                    />
                  </div>
                </div>
                <div
                  className="text-13-400 pt-1 cmb-22"
                  style={{ color: "red" }}
                >
                  {errors?.is_peer_reviewed}
                </div>

                <div className="cmb-22">
                  <TextInput
                    label="Journal Name (Optional)"
                    id="journal_name"
                    placeholder="Select Journal"
                    value={values.journal_name}
                    error={errors.journal_name}
                    onChange={(e) => {
                      handleChange({
                        target: {
                          id: e.target.id,
                          value: titleCaseString(e.target.value),
                        },
                      });
                    }}
                  />
                </div>

                <div className="cmb-22">
                  <TextInput
                    label="Existing DOI"
                    placeholder="Enter existing DOI"
                    id="existing_doi"
                    onChange={handleChange}
                    value={values.existing_doi}
                    error={errors.existing_doi}
                  />
                </div>

                <div className="d-flex justify-content-center gap-4 pt-3">
                  {isAbstarctRequired ? (
                    <Button
                      isRounded
                      text="Back"
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      onClick={onHide}
                    />
                  ) : (
                    <Button
                      isRounded
                      text="Skip"
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      btnLoading={btnLoading === "skip"}
                      onClick={() => {
                        handelSave(null);
                      }}
                    />
                  )}
                  <Button
                    isRounded
                    text="Submit"
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    disabled={id ? false : isEqual(values, initialValues)}
                    btnLoading={btnLoading === "submit"}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
export default DOIDetails;
