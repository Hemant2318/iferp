import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forEach } from "lodash";
import Label from "components/form/Label";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import MultipleSelect from "components/form/MultipleSelect";
import Card from "components/Layout/Card";
// import PayButton from "components/Layout/PayButton";
import CCAvenuePay from "components/Layout/CCAvenuePay";
import { asistanceType, journalType } from "utils/constants";
import {
  addJournalPublicationAssistance,
  showSuccess,
  throwError,
} from "store/slices";
import {
  decrypt,
  encrypt,
  getDataFromLocalStorage,
  getFilenameFromUrl,
  getUserType,
  objectToFormData,
} from "utils/helpers";

const PublicationAssistanceForm = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  const {
    id,
    first_name,
    last_name,
    email_id,
    phone_number,
    membership_plan_id: planID,
    personal_details = {},
  } = userData;
  // const [paymentData, setPaymentData] = useState({});
  const [initialValues, setInitialValues] = useState({
    journal_type: "",
    assistance_type: "",
    file: "",
    fileName: "",
    price: "0",
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    journal_type: Yup.string().required("Journal type is required."),
    assistance_type: Yup.string().required("Assistance type is required."),
    file: Yup.string().required("File is required."),
  });
  const handelSave = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(addJournalPublicationAssistance(forData));
    if (response?.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      setInitialValues({
        journal_type: "",
        assistance_type: "",
        file: "",
        fileName: "",
        price: "0",
      });
      dispatch(showSuccess("Publication assistance submit successfully."));
    }
    setBtnLoading(false);
  };
  useEffect(() => {
    if (localStorage.paymentIntent) {
      let localInitValue = {};
      let localResponse = {};
      if (localStorage.paymentIntent) {
        localInitValue = decrypt(localStorage.paymentIntent);
      }
      if (localStorage.paymentResponse) {
        localResponse = decrypt(localStorage.paymentResponse);
      }
      if (localInitValue?.formInitialValue) {
        setInitialValues(localInitValue?.formInitialValue);
      }
      const { order_status, status_message } = localResponse;
      if (order_status === "Success") {
        setBtnLoading(true);
        dispatch(showSuccess(status_message));
        setTimeout(() => {
          handelSave({
            ...localInitValue?.formInitialValue,
            user_id: id,
            amount: localInitValue?.formInitialValue?.price,
            price: localInitValue?.price,
            discount: localInitValue?.discount,
            discount_in_percentage: localInitValue?.discount_in_percentage,
            order_id: localResponse?.order_id || "",
            payment_id: localResponse?.tracking_id || "",
            payment_method: localInitValue?.currency,
          });
        }, 1500);
      } else if (status_message) {
        dispatch(
          throwError({
            message: status_message,
          })
        );
      } else {
        // Nothing
      }
      localStorage.removeItem("paymentResponse");
      localStorage.removeItem("paymentIntent");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let applyDiscount = "";
  if (planID === 12) {
    applyDiscount = "10";
  }
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  return (
    <>
      <Card className="d-flex align-items-center p-1 unset-br mb-3">
        <div
          className={inActiveClass}
          onClick={() => {
            const memberType = getUserType();
            navigate(`/${memberType}/publications`);
          }}
        >
          Publication
        </div>

        <div className={activeClass} onClick={() => {}}>
          Publication Assistance
        </div>
      </Card>
      <Card className="w-100 cps-30 cpe-30 cpt-30 cpb-30 unset-br">
        <div className="text-26-500 color-black-olive text-center cmb-40">
          Apply For Publication Assistance
        </div>
        <Formik
          enableReinitialize
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handelSave}
        >
          {(props) => {
            const {
              values,
              errors,
              handleSubmit,
              setFieldValue,
              resetForm,
              handleChange,
            } = props;

            let anyError = Object.keys(errors).length > 0;
            let discount_in_percentage = applyDiscount || "";
            let discount = 0;
            if (discount_in_percentage && values?.price) {
              discount = (values?.price * discount_in_percentage) / 100;
            }
            let finalAmount = values?.price - discount;
            return (
              <form>
                <div className="row">
                  <div className="col-md-6 cmb-22">
                    <TextInput value={`${first_name} ${last_name}`} disabled />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput value={email_id} disabled />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput value={phone_number} disabled />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      value={personal_details?.country_name}
                      disabled
                    />
                  </div>
                  <div className="col-md-3 cmb-22 d-flex align-items-center">
                    <Label label="Select Journal Type" required />
                  </div>
                  <div className="col-md-9 cmb-22">
                    <Dropdown
                      placeholder="Select Journal Type"
                      options={journalType}
                      optionKey="value"
                      optionValue="value"
                      id="journal_type"
                      onChange={handleChange}
                      value={values.journal_type}
                      error={errors.journal_type}
                    />
                  </div>
                  <div className="col-md-3 cmb-22 d-flex align-items-center">
                    <Label label="Select Assistance Type" required />
                  </div>
                  <div className="col-md-9 cmb-22">
                    <MultipleSelect
                      placeholder="Select Assistance Type"
                      options={asistanceType}
                      optionValue="id"
                      id="assistance_type"
                      onChange={(e) => {
                        let total = 0;
                        forEach(e.target.data, (elem) => {
                          total = total + elem.amount;
                        });
                        setFieldValue("price", total);
                        handleChange(e);
                      }}
                      value={values.assistance_type}
                      error={errors.assistance_type}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <FileUpload
                      id="file"
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = e.target.value;
                        const fileName = e.target.fileName;
                        setFieldValue("fileName", fileName);
                        setFieldValue(id, value);
                      }}
                      fileText={getFilenameFromUrl(values.fileName || "File")}
                      error={errors.file}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput value={`$ ${finalAmount}`} disabled />
                    {discount > 0 && (
                      <div className="text-12-400 mt-1 text-success">
                        {`${discount_in_percentage}% Discount Applied`}
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-center gap-4 cmt-30">
                    <Button
                      text="Cancel"
                      isRounded
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      onClick={resetForm}
                    />
                    <CCAvenuePay
                      btnLoading={btnLoading}
                      onClick={() => {
                        if (anyError || !values.journal_type) {
                          handleSubmit(values);
                        } else {
                          let paymentIntentData = {
                            page_type: "REQUEST",
                            type: "PUBLICATION_ASSISTANCE",
                            currency: "USD",
                            amount: finalAmount,
                            price: finalAmount,
                            discount: discount,
                            discount_in_percentage: discount_in_percentage,
                            formInitialValue: values,
                            toURL: window.location.pathname,
                          };
                          localStorage.paymentIntent =
                            encrypt(paymentIntentData);
                          navigate("/member/cc-avenue-payment");
                        }
                      }}
                    />
                    {/* <PayButton
                      isPayment={!isEqual(values, initialValues) && !anyError}
                      currency="INR"
                      amount={values.price}
                      onClick={(e) => {
                        if (anyError) {
                          handleSubmit(e);
                        }
                      }}
                      handelSuccess={(e) => {
                        let newPayData = e;
                        if (discount) {
                          newPayData = {
                            ...newPayData,
                            price: finalAmount,
                            discount: discount,
                            discount_in_percentage: discount_in_percentage,
                          };
                        }
                        setPaymentData(newPayData);
                        setTimeout(() => {
                          handleSubmit(newPayData);
                        }, 100);
                      }}
                    >
                      <Button
                        isRounded
                        text="Pay Now"
                        btnStyle="primary-dark"
                        className="cps-40 cpe-40"
                        btnLoading={btnLoading}
                        disabled={isEqual(values, initialValues)}
                      />
                    </PayButton> */}
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </Card>
    </>
  );
};
export default PublicationAssistanceForm;
