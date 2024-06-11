import { createSlice } from "@reduxjs/toolkit";
import { handelResponse, handelCatch } from "../slices";
import { api } from "services";
const initialState = {
  singleMentorDetail: {},
  isRescheduleTIme: false,
  reScheduleSessionData: [],
  customizedDate: null,
  customizeDateTime: [],
  unavailableDateTime: [],
  bookingSessionId: null,
  mySessionID: null,
  mySessionData: null,
  sessionData: {},
  storeSkillList: [],
};

const mentorshipSlice = createSlice({
  name: "mentorship",
  initialState,
  reducers: {
    setSingleMentorDetail(state, action) {
      state.singleMentorDetail = action.payload;
    },
    setIsRescheduleTIme(state, action) {
      state.isRescheduleTIme = action.payload;
    },
    setReScheduleSessionData(state, action) {
      state.reScheduleSessionData = action.payload;
    },
    setCustomizedDate(state, action) {
      state.customizedDate = action.payload;
    },
    setCustomizeDateTime(state, action) {
      state.customizeDateTime = [...state.customizeDateTime, action.payload];
    },
    setUnavailableDateTime(state, action) {
      state.unavailableDateTime = [...state.unavailableDateTime, action.payload];
    },
    setBookingSessionId(state, action) {
      state.bookingSessionId = action.payload;
    },
    setMySessionID(state, action) {
      state.mySessionID = action.payload;
    },
    setMySessionData(state, action) {
      state.mySessionData = action.payload;
    },
    setSessionData(state, action) {
      state.sessionData = action.payload;
    },
    setStoreSkillList(state, action) {
      state.storeSkillList = action.payload;
    },
    deleteCustomizeDateTime(state) {
      state.customizeDateTime = [];
    },
    deleteParticularCustomizeDateTime(state, action) {
      state.customizeDateTime = state.customizeDateTime.filter((item, index) => index !== action.payload);
    },
    deleteUnavailableDateTime(state) {
      state.unavailableDateTime = [];
    }
  },
});
//Mentee Dashboard
//Become Mentor
export const applyBecomeMentor = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/apply-mentor", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//All Mentors
export const fetchAllMentors = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/all-mentor", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Mentor Details
export const getMentorDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/mentor-details", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Mentor's Session Details
export const getSessionDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/session-details", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Schedule Meeting
export const scheduleMeeting = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/apply-session", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Scheduled Sessions
export const fetchScheduledSession = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/scheduled-session", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//ReScheduled Sessions
export const handleReScheduledSession = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/rescheduled-session", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Session Review
export const addSessionReview = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/session-rating", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Mentor Dashboard
//All Mentees
export const fetchAllMentees = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/all-mentee", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Single Mentee Session Details
export const mentessSessionDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/session-details", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Calender Time for Mentee Session
export const getTimeDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/session-avalible", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Add Session
export const createAddSession = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/add_session", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

// Edit Session
export const createEditSession = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/mentor_session_edit", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};
//Get My Session
export const getAllMySessions = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/mentor_my_session", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//MentorSessionDetails
export const mentorSessionDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/mentor-session-details", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Session Request
export const sessionRequest = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/session-request-action", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//paymentStatus for strip
export const paymentStatus = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/payment-status", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//Skill Request
export const skillList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentee/skill-list", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return await dispatch(handelCatch(error));
  }
};

//SkillListStore
export const skillListStore = (skillList) => async (dispatch) => {
  try {
    return await dispatch(setStoreSkillList(skillList));
  } catch (error) {
    return await [];
  }
};

export const {
  setSingleMentorDetail,
  setIsRescheduleTIme,
  setReScheduleSessionData,
  setCustomizedDate,
  setCustomizeDateTime,
  setUnavailableDateTime,
  setBookingSessionId,
  setMySessionID,
  setMySessionData,
  setSessionData,
  setStoreSkillList,
  deleteCustomizeDateTime,
  deleteParticularCustomizeDateTime,
  deleteUnavailableDateTime,
} = mentorshipSlice.actions;
export default mentorshipSlice.reducer;
