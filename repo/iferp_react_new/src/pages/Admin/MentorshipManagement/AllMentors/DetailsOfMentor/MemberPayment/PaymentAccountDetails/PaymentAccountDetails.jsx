import Card from "components/Layout/Card";
import DeletePopup from "components/Layout/DeletePopup";
import Loader from "components/Layout/Loader";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  getPaymentAccountDetails,
  throwError,
  throwSuccess,
  updateBankTransferData,
  deleteBankTransferData,
} from "store/slices";
import { bankAccountType } from "utils/constants";
import { objectToFormData, titleCaseString } from "utils/helpers";
import * as Yup from "yup";

const PaymentAccountDetails = ({ mentorId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState({});
  const [show, setShow] = useState(false);
  const [isIndian, setIsIndian] = useState("India");
  const [id, setId] = useState(null);
  const fetchAccountData = async () => {
    const response = await dispatch(
      getPaymentAccountDetails(objectToFormData({ user_id: mentorId }))
    );
    if (response?.status === 200) {
      setAccountDetails(response?.data || {});
      setIsIndian(response?.data?.country);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues = {
    account_holder_name: accountDetails?.account_holder_name,
    account_type: accountDetails?.account_type,
    account_number: accountDetails?.account_number,
    ifsc_code: accountDetails?.ifsc_code,
    tax_info: accountDetails?.tax_info || "",
    gst_no: accountDetails?.gst_no || "",
  };

  const initialValuesForOtherCountries = {
    beneficiary_bank_account: accountDetails?.beneficiary_bank_account,
    beneficiary_bank_name: accountDetails?.beneficiary_bank_name,
    beneficiary_bank_swift_code: accountDetails?.beneficiary_bank_swift_code,
    beneficiary_bank_address: accountDetails?.beneficiary_bank_address,
    routing_number: accountDetails?.routing_number || "",
  };

  const validationSchema = Yup.object().shape({
    account_holder_name: Yup.string().required(
      "Account Holder Name is required."
    ),
    account_type: Yup.string().required("Account Type is required."),
    account_number: Yup.number()
      .required("Account Number is required.")
      .transform((originalValue, originalObject) => {
        if (originalValue) {
          return parseInt(originalValue.toString().replace(/\D/g, ""), 10);
        }
        return originalValue;
      })
      .test(
        "is-valid-length",
        "Account Number must be between 8 and 16 digits",
        (value) => {
          const accountNumber = value && value.toString();
          return (
            accountNumber &&
            accountNumber.length >= 8 &&
            accountNumber.length <= 16
          );
        }
      ),
    ifsc_code: Yup.string()
      .required("IFSC Code is required.")
      .max(11, "IFSC Code must not exceed 11 characters.")
      .matches(
        /^[A-Z]{4}0[A-Za-z0-9]{6}$/,
        "Invalid IFSC code format. It should start with 4 capital alphabets followed by 0 and then 6 alphanumeric characters."
      ),
    tax_info: Yup.string()
      .max(10, "PAN Card Number must be at most 10 characters long")
      .matches(/^[A-Z]{5}\d{4}[A-Z]$/, {
        message: "Invalid PAN Card Number format",
        excludeEmptyString: true, // Exclude empty string for custom message
      })
      .test(
        "no-white-space",
        "PAN Card Number must not contain any white spaces",
        (value) => {
          return /^\S+$/.test(value);
        }
      ),
    gst_no: Yup.string()
      .max(15, "GST Number must be exactly 15 characters long")
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST Number format"
      ),
  });

  const validationSchemaForOtherCountries = Yup.object().shape({
    beneficiary_bank_account: Yup.number()
      .required("Account Number is required.")
      .transform((originalValue, originalObject) => {
        if (originalValue) {
          return parseInt(originalValue.toString().replace(/\D/g, ""), 10);
        }
        return originalValue;
      })
      .test(
        "is-valid-length",
        "Account Number must be between 8 and 16 digits",
        (value) => {
          const accountNumber = value && value.toString();
          return (
            accountNumber &&
            accountNumber.length >= 8 &&
            accountNumber.length <= 16
          );
        }
      ),
    beneficiary_bank_name: Yup.string().required("Bank Name is required."),
    beneficiary_bank_swift_code: Yup.string()
      .min(8, "minimum 8 numbers required")
      .max(11, "maximum 11 numbers required")
      .required("Bank SWIFT code is required."),
    beneficiary_bank_address: Yup.string().required(
      "Bank Address is required."
    ),
  });

  const handleSave = async (values) => {
    let object = {
      account_holder_name: values?.account_holder_name,
      account_type: values?.account_type,
      account_number: values?.account_number,
      ifsc_code: values?.ifsc_code,
      pan_card_no: values?.tax_info || "",
      gst_no: values?.gst_no || "",
      user_id: mentorId,
    };

    const payload = objectToFormData(object);
    const response = await dispatch(updateBankTransferData(payload));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      fetchAccountData();
      setShow(false);
    } else {
      dispatch(throwError(response?.message));
    }
  };

  const handleSaveForOtherCountries = async (values) => {
    let object = {
      beneficiary_bank_account: values?.beneficiary_bank_account,
      beneficiary_bank_name: values?.beneficiary_bank_name,
      beneficiary_bank_swift_code: values?.beneficiary_bank_swift_code,
      beneficiary_bank_address: values?.beneficiary_bank_address,
      routing_number: values?.routing_number || "",
      user_id: mentorId,
    };

    const payload = objectToFormData(object);
    const response = await dispatch(updateBankTransferData(payload));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      fetchAccountData();
      setShow(false);
    } else {
      dispatch(throwError(response?.message));
    }
  };

  const {
    account_holder_name,
    account_type,
    account_number,
    ifsc_code,
    tax_info,
    gst_no,
    beneficiary_bank_account,
    beneficiary_bank_name,
    beneficiary_bank_swift_code,
    beneficiary_bank_address,
    routing_number,
  } = accountDetails || {};

  return (
    <div className="mt-3">
      {isLoading ? (
        <Card className="cpt-50 cpb-50">
          <Loader size="sm" />
        </Card>
      ) : isIndian ? (
        <Card className="cps-20 cpe-20 cpt-26 cpb-10">
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-18-500 color-text-navy">
              Payment Account Details
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                text="Edit"
                btnStyle="primary-outline"
                className="text-15-500 h-35"
                rightIcon={<i className="bi bi-pen text-15-500 ms-2" />}
                onClick={() => setShow(true)}
              />
              {account_holder_name && (
                <Button
                  btnStyle="danger-outline"
                  className="text-15-500 h-35"
                  rightIcon={<i className="bi bi-trash text-15-500" />}
                  onClick={() => {
                    setId(mentorId);
                  }}
                />
              )}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                PAN Card Number
              </div>
              <div className="text-16-500 color-dark-blue">
                {tax_info ? tax_info : "-"}
              </div>
            </div>
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Account Holder Name
              </div>
              <div className="text-16-500 color-dark-blue">
                {account_holder_name
                  ? titleCaseString(account_holder_name)
                  : "-"}
              </div>
            </div>
            <div className="col-md-4" />
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Account Type
              </div>

              <div className="text-16-500 color-dark-blue">
                {account_type
                  ? `${titleCaseString(account_type)} Account`
                  : "-"}
              </div>
            </div>
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Account Number
              </div>
              <div className="text-16-500 color-dark-blue">
                {account_number ? account_number : "-"}
              </div>
            </div>
            <div className="col-md-4" />
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                IFSC Code
              </div>
              <div className="text-16-500 color-dark-blue">
                {ifsc_code ? ifsc_code : "-"}
              </div>
            </div>
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">GST No</div>
              <div className="text-16-500 color-dark-blue">
                {gst_no ? gst_no : "-"}
              </div>
            </div>
            <div className="col-md-4" />
          </div>
        </Card>
      ) : (
        <Card className="cps-20 cpe-20 cpt-26 cpb-10">
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-18-500 color-text-navy">
              Payment Account Details
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                text="Edit"
                btnStyle="primary-outline"
                className="text-15-500 h-35"
                rightIcon={<i className="bi bi-pen text-15-500 ms-2" />}
                onClick={() => setShow(true)}
              />
              {beneficiary_bank_account && (
                <Button
                  btnStyle="danger-outline"
                  className="text-15-500 h-35"
                  rightIcon={<i className="bi bi-trash text-15-500" />}
                  onClick={() => {
                    setId(mentorId);
                  }}
                />
              )}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Beneficiary Bank Account
              </div>
              <div className="text-16-500 color-dark-blue">
                {beneficiary_bank_account}
              </div>
            </div>
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Beneficiary Bank Name
              </div>
              <div className="text-16-500 color-dark-blue">
                {titleCaseString(beneficiary_bank_name)}
              </div>
            </div>
            <div className="col-md-4" />
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Beneficiary Bank Swift Code
              </div>
              <div className="text-16-500 color-dark-blue">{`${beneficiary_bank_swift_code}`}</div>
            </div>
            <div className="col-md-4 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Routing Number
              </div>
              <div className="text-16-500 color-dark-blue">
                {routing_number}
              </div>
            </div>
            <div className="col-md-4" />
            <div className="col-md-8 cmb-20">
              <div className="text-14-400 color-black-olive mb-1">
                Beneficiary Bank Address
              </div>
              <div className="text-16-500 color-dark-blue">
                {beneficiary_bank_address}
              </div>
            </div>
            <div className="col-md-4" />
          </div>
        </Card>
      )}

      {id && (
        <DeletePopup
          title="Delete Bank Data"
          message="Are you sure you want to delete the bank data?"
          onHide={() => {
            setId(null);
          }}
          handelSuccess={async () => {
            fetchAccountData();
            setId(null);
          }}
          handelDelete={async () => {
            const payload = objectToFormData({ mentor_id: mentorId });
            const response = await dispatch(deleteBankTransferData(payload));
            return response;
          }}
        />
      )}

      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body closeButton>
          <div className="justify-content-end d-flex">
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              onClick={() => setShow(false)}
            ></button>
          </div>
          <div className="d-flex justify-content-center color-title-navy font-poppins text-26-500">
            Bank Transfer
          </div>
          {!isIndian && (
            <div class="d-flex justify-content-center flex-wrap text-16-400 color-5261 mt-3">
              For International Mentors (whom Stripe is not supported in their
              country)
            </div>
          )}
          {isIndian ? (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSave}
            >
              {(props) => {
                const {
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  resetForm,
                } = props;
                return (
                  <form className="mt-5">
                    <div className="d-flex flex-row flex-wrap gap-4 m-3">
                      <div className="text-design">
                        <TextInput
                          label="Account Holder Name*"
                          placeholder="Holder Name"
                          id="account_holder_name"
                          value={values?.account_holder_name}
                          error={errors?.account_holder_name}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "account_holder_name",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="text-design">
                        {/* <TextInput
                          label="Account Type*"
                          placeholder="Account Type"
                          id="account_type"
                          value={values?.account_type}
                          error={errors?.account_type}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "account_type",
                                value: e.target.value,
                              },
                            });
                          }}
                        /> */}
                        <Dropdown
                          label="Account Type*"
                          value={values?.account_type}
                          id="account_type"
                          placeholder="Select Account Type"
                          options={bankAccountType}
                          optionKey="id"
                          optionValue="value"
                          onChange={handleChange}
                          error={errors?.account_type}
                        />
                      </div>

                      <div className="text-design">
                        <TextInput
                          label="Account Number*"
                          placeholder="Account Number"
                          id="account_number"
                          value={values?.account_number}
                          error={errors?.account_number}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "account_number",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="text-design">
                        <TextInput
                          label="IFSC Code*"
                          placeholder="IFSC Code"
                          id="ifsc_code"
                          value={values?.ifsc_code}
                          error={errors?.ifsc_code}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "ifsc_code",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-15-500 color-title-navy font-poppins mt-4 mb-3 ms-3">
                      Tax Info
                    </div>
                    <div className="d-flex flex-row flex-wrap gap-4 m-3">
                      <div className="text-design">
                        <TextInput
                          label="PAN Card Number"
                          placeholder="Pan Card Number"
                          id="tax_info"
                          value={values?.tax_info}
                          error={errors?.tax_info}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "tax_info",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="text-design">
                        <TextInput
                          label="GST No.(Optional)"
                          placeholder="GST No."
                          id="gst_no"
                          value={values?.gst_no}
                          error={errors?.gst_no}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "gst_no",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center gap-1 mt-5 pb-3">
                      <Button
                        isRounded
                        text="Submit"
                        btnStyle="primary-dark"
                        className="cps-40 cpe-40"
                        onClick={handleSubmit}
                        disabled={isEqual(values, initialValues)}
                      />
                      <Button
                        isRounded
                        text="Cancel"
                        btnStyle=""
                        className="cps-40 cpe-40"
                        onClick={() => {
                          resetForm();
                          setShow(false);
                        }}
                      />
                    </div>
                  </form>
                );
              }}
            </Formik>
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValuesForOtherCountries}
              validationSchema={validationSchemaForOtherCountries}
              onSubmit={handleSaveForOtherCountries}
            >
              {(props) => {
                const {
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  resetForm,
                } = props;
                return (
                  <form className="mt-5">
                    <div className="d-flex flex-row flex-wrap gap-4 m-3">
                      <div className="text-design">
                        <TextInput
                          label="Beneficiary Bank Account Number*"
                          placeholder="Bank Account Number"
                          id="beneficiary_bank_account"
                          value={values?.beneficiary_bank_account}
                          error={errors?.beneficiary_bank_account}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "beneficiary_bank_account",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="text-design">
                        <TextInput
                          label="Beneficiary Bank Name*"
                          placeholder="Bank Name"
                          id="beneficiary_bank_name"
                          value={values?.beneficiary_bank_name}
                          error={errors?.beneficiary_bank_name}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "beneficiary_bank_name",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="text-design">
                        <TextInput
                          label="Beneficiary bank SWIFT code"
                          placeholder="Bank SWIFT code"
                          id="beneficiary_bank_swift_code"
                          value={values?.beneficiary_bank_swift_code}
                          error={errors?.beneficiary_bank_swift_code}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "beneficiary_bank_swift_code",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="text-design">
                        <TextInput
                          label="Beneficiary Bank Address*"
                          placeholder="Bank Address"
                          id="beneficiary_bank_address"
                          value={values?.beneficiary_bank_address}
                          error={errors?.beneficiary_bank_address}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "beneficiary_bank_address",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="text-design">
                        <TextInput
                          label="Routing Number (optional)"
                          placeholder="Routing Number"
                          id="routing_number"
                          value={values?.routing_number}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: "routing_number",
                                value: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center gap-1 mt-5 pb-3">
                      <Button
                        isRounded
                        text="Submit"
                        btnStyle="primary-dark"
                        className="cps-40 cpe-40"
                        onClick={handleSubmit}
                      />
                      <Button
                        isRounded
                        text="Cancel"
                        btnStyle=""
                        className="cps-40 cpe-40"
                        onClick={() => {
                          resetForm();
                          setShow(false);
                        }}
                      />
                    </div>
                  </form>
                );
              }}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PaymentAccountDetails;
