import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../services";
import {
  generatePreSignedUrl,
  getDataFromLocalStorage,
  storeLocalStorageData,
} from "../../utils/helpers";
import {
  handelResponse,
  handelCatch,
  storeEventData,
  storePostList,
  saveData,
  getNodeToken,
  setRProfileData,
} from "../slices";
import { networkPath } from "utils/constants";

const initialState = {
  researchProfile: {},
  notificationList: [],
  isBadge: false,
  userDetails: {},
};
const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setResearchProfile(state, action) {
      state.researchProfile = action.payload;
    },
    setNotificationList(state, action) {
      state.notificationList = action.payload;
    },
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    setIsBadge(state, action) {
      state.isBadge = action.payload;
    },
  },
});

// Dashboard
export const fetchLiveEvents = () => async (dispatch) => {
  try {
    const res = await api.get("/user/event/live-events");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchUserUpComingEvent = (formdata) => async (dispatch) => {
  try {
    const res = await api.get("/user/event/upcoming-events", formdata);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const upgradePremium = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/upgrade-premium", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Our Profile
export const fetchAttendedDetails = () => async (dispatch) => {
  try {
    const res = await api.get("/dashboard/attended-details");
    const response = await dispatch(handelResponse(res));
    if (response.data) {
      const newNodeToken = await dispatch(
        getNodeToken({
          token: getDataFromLocalStorage("token"),
          email: getDataFromLocalStorage("email_id"),
        })
      );
      let jwtToken = newNodeToken?.data?.jwt_token || "";
      let oldData = getDataFromLocalStorage();
      oldData = {
        ...oldData,
        attendedDetails: response?.data,
        jwt_token: jwtToken,
      };
      storeLocalStorageData(oldData);
      dispatch(setUserDetails(oldData));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchProfile = () => async (dispatch) => {
  try {
    const res = await api.get("/user/profile/details");
    const response = await dispatch(handelResponse(res));
    if (response.data) {
      storeLocalStorageData(response.data);
      dispatch(setUserDetails(response.data));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchUserProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/profile/user-details", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchUserEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/my-all-events", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchInstitutionalEvents = () => async (dispatch) => {
  try {
    const res = await api.get(
      "/user/institutional/events/get-registered-events"
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addFeedback = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/feedbacks/add", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// My Profile - Our Employee
export const fetchCorporateEmployees = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/user/corporate/employees/get?${queryParams}`);
    const response = await dispatch(handelResponse(res));
    if (typeof response?.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addCorporateEmployees = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/corporate/employees/create", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// My Profile - Research Profile
export const fetchResearchProfileData =
  (queryParams, isOther) => async (dispatch) => {
    try {
      const res = await api.get(`/user/research/get-details?${queryParams}`);
      const response = await dispatch(handelResponse(res));
      if (isOther) {
        dispatch(setRProfileData(response?.data || {}));
      } else {
        dispatch(setResearchProfile(response?.data || {}));
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const editResearchProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/research/update-profile", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addAbout = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/research/about", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addAffiliations = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/research/affiliations", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addJournalRoles = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/research/current-journal-roles",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEducation = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/research/higher-qualification-details",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addResearchId = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/research/research-ids", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addPublication = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/research/publication", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addAchievements = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/research/achievements", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchResearchItems =
  (queryParams = "") =>
  async (dispatch) => {
    try {
      const res = await api.get(
        `/user/research/get/research/tab${queryParams}`
      );
      return await dispatch(handelResponse(res));
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const fetchResearchStatistics =
  (queryParams = "") =>
  async (dispatch) => {
    try {
      const res = await api.get(
        `/user/research/get/statistics/tab${queryParams}`
      );
      return await dispatch(handelResponse(res));
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };

export const fetchEventByType = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/event/get-events-on-event-type",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const RegisterUserEvent = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/registration", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const registerInstitutionalEvent = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/events/registration",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchUserEventDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/my-single-event-detail", formData);
    const response = await dispatch(handelResponse(res));
    const eventData = response?.data || {};
    dispatch(storeEventData(eventData));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const inviteEventMemeber = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/send-invite-mail", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchUserEventDocument = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/documentation/event/certificate?${queryParams}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEventSubmitAbstract = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/submit-abstract", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEventSponsorship = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/apply-sponsorship", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEventNomination = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/apply-nomination", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAplliedSubmitPaper = () => async (dispatch) => {
  try {
    const res = await api.get("/user/publication/journal/get-all");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addJournalSubmitPaper = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/publication/journal/submit-paper",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addJournalPublicationAssistance =
  (formData) => async (dispatch) => {
    try {
      const res = await api.post(
        "/user/publication/journal/publication-assistance",
        formData
      );
      return await dispatch(handelResponse(res));
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const getNominatedUsers = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/get-nominated-users", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const applyAsCommitteeMember = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/event/apply-as-committee-member",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Member - Nomination For IFERP Awards
export const getNonNominatedUsers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/iferp/award/non-nominated-users",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addNominateUser = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/iferp/award/nominate", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Certificates & Rewards
export const fetchCertificate = () => async (dispatch) => {
  try {
    const res = await api.get("/user/get-certificate");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Award Winners
export const fetchAwardWinner = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/get-awardwinner", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Career Support
export const careerApply = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/career/apply", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getSingleAppliedCareer = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/my/single/career/applied/details?${queryParams}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Network Management
export const fetchAllPosts = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/admin/get", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data && !response?.data?.posts) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchPost = (type, payload) => async (dispatch) => {
  try {
    const res = await api.post(`/user/network/posts/${type}`, payload);
    const response = await dispatch(handelResponse(res));

    if (response?.data?.postList) {
      const promises = response?.data?.postList?.map(async (elm) => {
        let response = await generatePreSignedUrl(elm.post, networkPath);
        let presantationRes = "";
        let thumbnailRes = "";
        if (elm?.presentation_link) {
          presantationRes = await generatePreSignedUrl(
            elm.presentation_link,
            networkPath
          );
        }
        if (elm?.thumbnail) {
          thumbnailRes = await generatePreSignedUrl(elm.thumbnail, networkPath);
        }

        return {
          ...elm,
          nPost: response,
          nPresentationLink: presantationRes,
          nThumbnail: thumbnailRes,
        };
      });
      const results = await Promise.all(promises);
      dispatch(storePostList(results));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchSinglePost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/single", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const readPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/read", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const sharePost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/share", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const hidePost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/hide-unhide", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const createPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/create", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deletePost = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/posts/delete-or-restore",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const saveUnsavePost = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/posts/save-unsave-post",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const usefulUnusefulPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/posts/useful-unuseful-post",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateCoAuthor = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/network/posts/change/coauthor/status?${queryParams}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const commentPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/comment-post", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editOrDeleteComment = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/posts/edit-delete-comment",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const reminderPostVerify = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/posts/reminder-post-verify",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addFigures = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/add_figures", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteFigures = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/delete_figures", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fullPaperRequest = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/request", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
//Event-post-list
export const eventPostList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/event-post-list", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addBrandingPublicity = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/Branding/add-branding-publicity",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addKeynoteSpeakerDocument = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/inbox/notifications/keynote-speaker/upload/document",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchGlobalSearch = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/user/global/header/search${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Chapters & Groups
export const chapterFollow = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/chapter/follow", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const groupFollow = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/sig-group/join", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const saveEventDate = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/calender/save-event-date", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Collaboration
export const fetchAllCollaboration = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/collaboration/admin/get-all",
      formData
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data && !response?.data?.result) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addCollaboration = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/collaboration/apply",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateCollaboration = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/collaboration/admin/status-update",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteCollaboration = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/collaboration/admin/delete",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getAppliedCollaboration = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/collaboration/get-my-applied",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Institutional - Activity Plan
export const addInstitutionalEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/events/add-event",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editInstitutionalEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/events/edit-event",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Institutional - Our Acadamics
export const getInstitutionalMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/members/get-member",
      formData
    );
    const response = await dispatch(handelResponse(res));
    if (typeof response?.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addInstitutionalMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/members/add-member",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteInstitutionalMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/members/delete-member",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addDepartments = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-departments", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getPerformanceReport = (year) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/institutional/performance-report?percentage_weightage_year=${year}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Institutional - Activity Report
export const getActivityReport = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/institutional/activity-report/get?${queryParams}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const uploadActivityReport = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/activity-report/upload",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Institutional - Funds And Grants
export const getFundsAndGrants = (params) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/institutional/funds-and-grants/get?${params}`
    );
    const response = await dispatch(handelResponse(res));
    if (typeof response?.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Institutional - Innovation Ambassador
export const getInstitutionalAmbassador = (params) => async (dispatch) => {
  try {
    const res = await api.get(`/user/institutional/ambassador/get?${params}`);
    const response = await dispatch(handelResponse(res));
    if (typeof response?.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addInstitutionalAmbassador = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/institutional/ambassador/create",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getNonAmbassadorUsers = (params) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/institutional/non-ambassador-users?type=${params}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getNotifications = () => async (dispatch) => {
  try {
    const res = await api.get("/user/notifications/my/get");
    const response = await dispatch(handelResponse(res));
    let data = response?.data || [];
    dispatch(setNotificationList(data));
    dispatch(setIsBadge(data.some((o) => o.is_read === "0")));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const readNotifications = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/notifications/read", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getAbstarctCertificate = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/get/old/certificate/details/by/abstarctid?${queryParams}`
    );
    if (res?.status === 200) {
      return await dispatch(handelResponse(res));
    }
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const verifyPublicationAuthorCoAuthor =
  (formData) => async (dispatch) => {
    try {
      const res = await api.post("/user/research/verify", formData);
      return await dispatch(handelResponse(res));
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const getKeywords = () => async (dispatch) => {
  try {
    const res = await api.get("/user/network/posts/keyword");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getTopics = () => async (dispatch) => {
  try {
    const res = await api.get("/user/network/posts/topic");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getPastEvent = (formData) => async (dispatch) => {
  // params
  // 1) date - get all event till f=given date
  // 2) type - event type
  // 3) limit
  // 4) offset
  try {
    const res = await api.post("/admin/get-old-event", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const updateUrlDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/stripe-link-update",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const checkIfUrlExist = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/url-avalible", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const updateBankTransferData = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/payment-details-update", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const connectStripe = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/connect-stripe", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const deleteBankTransferData = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/mentor/bank-details-delete", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const {
  setResearchProfile,
  setNotificationList,
  setIsBadge,
  setUserDetails,
} = studentSlice.actions;
export default studentSlice.reducer;
