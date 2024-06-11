import { api } from "services";
import { handelCatch, handelResponse } from "./globalSlice";
import { getFilenameFromUrl } from "utils/helpers";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  singleMentorPaymentDetail: {},
  singleMentorProfileData: {},
  mentorSessionID: null,
  singleMenteeDetails: {},
  paymentType: "payment-overview",
  tabTypeAddedBankAccount: "",
};

const mentorshipManagementSlice = createSlice({
  name: "mentorshipManagement",
  initialState,
  reducers: {
    setSingleMentorPaymentDetail(state, action) {
      state.singleMentorPaymentDetail = action.payload;
    },
    setSingleMentorProfileData(state, action) {
      state.singleMentorProfileData = action.payload;
    },
    setMentorSessionID(state, action) {
      state.mentorSessionID = action.payload;
    },
    setSingleMenteeDetails(state, action) {
      state.singleMenteeDetails = action.payload;
    },
    setPaymentType(state, action) {
      state.paymentType = action.payload;
    },
    setTabTypeAddedBankAccount(state, action) {
      state.tabTypeAddedBankAccount = action.payload;
    },
  },
});

//Mentorship Management
//Get All Mentors
export const getAllMentorsList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/all-mentor", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Delete Single Mentor
export const deleteMentor = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/delete-mentor", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

// All Mentor - Session - Session Details - All Mentees

export const sessionMenteesList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/session-mentees", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

// All Mentor - Mentee - Payment Overview
export const menteePaymentOverview = () => async (dispatch) => {
  try {
    const res = await api.get("/user/mentor/payment-overview");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

// All Mentor - Mentee - Payment Overview - All Payments
export const menteePaymentList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/payment-list", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

// All Mentor - Mentee - Payment - Account Details
export const getPaymentAccountDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/payment-details", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

// All Mentor - Mentee - Payment - Update Account Details
export const updatePaymentAccountDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/payment-details-update", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Get All Mentees
export const getAllMenteesList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/all-mentees", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Mentor Settlement Payment
export const getMentorSettlementPayment = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/mentor-payment", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Mentee Settlement Payment
export const getMenteeSettlementPayment = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/mentee-settlements",
      formData
    );

    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Single Mentor Payment
export const getSingleMentorPayment = (queryParams) => async (dispatch) => {
  try {
    const res = await api.post(
      `/admin/mentorship/mentor-vise-payment?${queryParams}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Payment Report
export const fetchPaymentReport = () => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/payment-report");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Mentor Analysis
export const fetchMentorAnalysis = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/month-payment", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Payment Analytics
export const fetchPaymentAnalytics = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/payment-analytics", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Get All Mentor Approvals list
export const getmentorApprovalsList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/mentor-list", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Get All Session  Approvals list
export const getsessionApprovalsList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/session-list", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Mentor Accept Reject list
export const mentorAcceptReject = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/mentor-accept-reject",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Session Accept Reject list
export const sessionAcceptReject = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/session-accept-reject",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Session Status Edit
export const mentorStatusEdit = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/mentor-status-edit",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Session Status Edit
export const sessionStatusEdit = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/session-status-edit",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Payment Percent Edit
export const paymentPercent = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/payment-percent", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

export const saveExportData = (url) => {
  var link = document.createElement("a");
  link.download = getFilenameFromUrl(url);
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const allPaymentExport = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/all-payment-export",
      formData
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveExportData(response?.data);
    }
    return response;
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Get PaymentType
export const getPaymentType = (type) => async (dispatch) => {
  dispatch(setPaymentType(type));
};
export const {
  setSingleMentorPaymentDetail,
  setSingleMentorProfileData,
  setMentorSessionID,
  setSingleMenteeDetails,
  setPaymentType,
  setTabTypeAddedBankAccount,
} = mentorshipManagementSlice.actions;
export default mentorshipManagementSlice.reducer;
