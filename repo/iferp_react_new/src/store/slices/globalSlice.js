import { createSlice } from "@reduxjs/toolkit";
import {
  decrypt,
  generatePreSignedUrl,
  storeLocalStorageData,
} from "utils/helpers";
import { api } from "../../services";
import { advertisement } from "utils/constants";

const initialState = {
  apiError: {},
  isSessionExpired: false,
  isPremiumPopup: false,
  isLogout: false,
  membershipList: [],
  eventTypeList: [],
  countryList: [],
  stateList: [],
  cityList: [],
  institutionList: [],
  universityList: [],
  courseList: [],
  departmentList: [],
  allNewTopicList: [],
  comitteeMemberCategoryList: [],
  postCategoryList: [],
  eventData: {},
  postList: [],
  followedChapterList: [],
  myGroupsList: [],
  myEvents: [],
  languageList: [],
  myNetworkDetails: {},
  personalExecutive: {},
  tourIndex: 0,
  isTour: false,
  rProfileID: null,
  rProfileData: null,
  postID: null,
  isFeedback: false,
  isCalendar: false,
  isCollapseSidebar: false,
  isRegisterPopup: false,
  speakerInviteRegistrationPopup: false,
  mentorNotifyPopup: false,
  videoRecordingUrl: "",
  isMentorPremiumBenefit: false,
  isDiscountPopup: false,
  advertisementsList: [],
  isGlobalProfilePreviewPopup: false,
  networkListData: {
    followers: [],
    following: [],
    receive_follow_request: [],
    send_follow_request: [],
    isPageLoading: true,
  },
  newDepartmentList: [],
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setApiError(state, action) {
      state.apiError = action.payload;
    },
    setMembershipList(state, action) {
      state.membershipList = action.payload;
    },
    setEventTypeList(state, action) {
      state.eventTypeList = action.payload;
    },
    setCountryList(state, action) {
      state.countryList = action.payload;
    },
    setStateList(state, action) {
      state.stateList = action.payload;
    },
    setCityList(state, action) {
      state.cityList = action.payload;
    },
    setInstitutionList(state, action) {
      state.institutionList = action.payload;
    },
    setCourseList(state, action) {
      state.courseList = action.payload;
    },
    setDepartmentList(state, action) {
      state.departmentList = action.payload;
    },
    setAllNewTopicList(state, action) {
      state.allNewTopicList = action.payload;
    },
    setComitteeMemberCategoryList(state, action) {
      state.comitteeMemberCategoryList = action.payload;
    },
    setPostCategoryList(state, action) {
      state.postCategoryList = action.payload;
    },
    setUniversityList(state, action) {
      state.universityList = action.payload;
    },
    setFollowedChapterList(state, action) {
      state.followedChapterList = action.payload;
    },
    setMyGroupsList(state, action) {
      state.myGroupsList = action.payload;
    },
    setMyEvents(state, action) {
      state.myEvents = action.payload;
    },
    setSessionExpired(state) {
      if (!state.isSessionExpired) {
        state.isSessionExpired = true;
      }
    },
    unsetSessionExpired(state) {
      if (state.isSessionExpired) {
        state.isSessionExpired = false;
      }
    },
    setIsLogout(state, action) {
      state.isLogout = action.payload;
    },
    setIsPremiumPopup(state, action) {
      state.isPremiumPopup = action.payload;
    },
    storeEventData(state, action) {
      state.eventData = action.payload;
    },
    storePostList(state, action) {
      state.postList = action.payload;
    },
    setMyNetworkDetails(state, action) {
      state.myNetworkDetails = action.payload;
    },
    setPersonalExecutive(state, action) {
      state.personalExecutive = action.payload;
    },
    setTourIndex(state, action) {
      state.tourIndex = action.payload;
    },
    setIsTour(state, action) {
      state.isTour = action.payload;
    },
    setRProfileID(state, action) {
      state.rProfileID = action.payload;
    },
    setRProfileData(state, action) {
      state.rProfileData = action.payload;
    },
    setLanguageList(state, action) {
      state.languageList = action.payload;
    },
    setPostID(state, action) {
      state.postID = action.payload;
    },
    setIsFeedback(state, action) {
      state.isFeedback = action.payload;
    },
    setIsCalendar(state, action) {
      state.isCalendar = action.payload;
    },
    setIsCollapseSidebar(state, action) {
      state.isCollapseSidebar = action.payload;
    },
    setIsRegisterPopup(state, action) {
      state.isRegisterPopup = action.payload;
    },
    setSpeakerInviteRegistrationPopup(state, action) {
      state.speakerInviteRegistrationPopup = action.payload;
    },
    setMentorNotifyPopup(state, action) {
      state.mentorNotifyPopup = action.payload;
    },
    setVideoRecordingUrl(state, action) {
      state.videoRecordingUrl = action.payload;
    },
    setIsMentorPremiumBenefit(state, action) {
      state.isMentorPremiumBenefit = action.payload;
    },
    setIsDiscountPopup(state, action) {
      state.isDiscountPopup = action.payload;
    },
    setAdvertisementsList(state, action) {
      state.advertisementsList = action.payload;
    },
    setIsGlobalProfilePreviewPopup(state, action) {
      state.isGlobalProfilePreviewPopup = action.payload;
    },
    setNetworkListData(state, action) {
      state.networkListData = action.payload;
    },
    setNewDepartmentList(state, action) {
      state.newDepartmentList = action.payload;
    },
  },
});
export const fetchMemberships = () => async (dispatch) => {
  try {
    const res = await api.get("/admin/get-membership");
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(setMembershipList(response?.data));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchEventType = () => async (dispatch) => {
  try {
    const res = await api.get("/user/event/get-event-types");
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(setEventTypeList(response?.data));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchCountry = () => async (dispatch) => {
  try {
    const res = await api.get("/admin/country/list");
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      dispatch(setCountryList(response?.data?.country));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchState = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/state/list", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      dispatch(setStateList(response?.data?.state));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchCity = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/city/list", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      dispatch(setCityList(response?.data?.city));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getInstitutions = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/get-institutions", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getUniversity = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/dashboard/get-university?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getMembership = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/membership-benefits", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getCourses = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/courses-list", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      dispatch(setCourseList(response?.data));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addCourses = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-courses", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getDepartments = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/departments-list", formData);
    const response = await dispatch(handelResponse(res));
    dispatch(setDepartmentList(response?.data || []));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//new topics list
export const getAllTopicsList = (type) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/all-topic-list", type);
    const response = await dispatch(handelResponse(res));
    let newList = [];
    if (response?.data?.allTopicList) {
      response?.data?.allTopicList?.forEach((elem) => {
        elem?.topics?.forEach((data) => {
          newList.push(data);
        });
      });
    }
    dispatch(setAllNewTopicList(newList || []));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchComitteeMemberCategory =
  (queryParams = "") =>
  async (dispatch) => {
    try {
      const res = await api.get(
        `/admin/get/all/and/single/committee-member-category${queryParams}`
      );
      const response = await dispatch(handelResponse(res));
      if (Array.isArray(response?.data)) {
        dispatch(setComitteeMemberCategoryList(response?.data));
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const fetchPostCategories = () => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/categories/get", {});
    const response = await dispatch(handelResponse(res));
    dispatch(setPostCategoryList(response?.data || []));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchPostSubCategories = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/posts/sub-categories/get",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getFollowedChapters = () => async (dispatch) => {
  try {
    const res = await api.post("/user/chapter/my-followed", {});
    const response = await dispatch(handelResponse(res));
    dispatch(setFollowedChapterList(response?.data || []));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getMyGroups = () => async (dispatch) => {
  try {
    const res = await api.post("/user/network/sig-group/my-groups", {});
    const response = await dispatch(handelResponse(res));
    dispatch(setMyGroupsList(response?.data || []));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getLanguages = () => async (dispatch) => {
  try {
    const res = await api.get("/get/all/languages");
    const response = await dispatch(handelResponse(res));
    dispatch(setLanguageList(response?.data || []));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getIFERPCalender = () => async (dispatch) => {
  try {
    const res = await api.post("/user/calender/get-iferp-calender", {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getPersonalExecutive = () => async (dispatch) => {
  try {
    const res = await api.get("/user/personal-executive-details-get");
    const response = await dispatch(handelResponse(res));
    dispatch(setPersonalExecutive(response?.data || {}));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getMyCalender = () => async (dispatch) => {
  try {
    const res = await api.post("/user/calender/get-my-calender", {});
    const response = await dispatch(handelResponse(res));
    dispatch(setMyEvents(response?.data || []));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const tourStatus =
  (status, isClose = false) =>
  async (dispatch) => {
    try {
      const res = await api.get(
        `/user/profile/change/tour/status?tour_status=${status}`
      );
      const response = await dispatch(handelResponse(res));
      if (response?.status === 200 && isClose) {
        dispatch(setIsTour(false));
        storeLocalStorageData({ tour_status: 19 });
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const getCCAvenuePaymentURL = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/cc-avenue", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//new global research profile APIs

//upcomingActivities
export const fetchUpcomingActivities = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/user/upcomming-activity?${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//membersSkills
export const fetchMembersSkills = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/user/member-skill?${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//recommendedPresentation
export const fetchRecommendedPresentation = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/user/recommended-presentation?${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//recommendedSessions
export const fetchRecommendedSession = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/user/recommended-session?${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
//recommended research feed
export const fetchRecommendedResearchFeed = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/user/recommended-post?${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//advertisement
export const fetchAllAdvertisement = () => async (dispatch) => {
  try {
    const res = await api.get("/user/advertisement-list");
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      if (response?.data) {
        const newAddsLists = response?.data?.advertise_data?.map(
          async (elem) => {
            let adsImage = "";
            if (elem?.image) {
              adsImage = await generatePreSignedUrl(elem?.image, advertisement);
            }
            return {
              ...elem,
              newAdsImageURl: adsImage,
            };
          }
        );
        const result = await Promise.all(newAddsLists);
        dispatch(setAdvertisementsList(result || []));
      }
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//signup for newsletter
export const singUpNewsLetter = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/subscribe", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//IFERP Digital Library

//Top Conference Proceedings
export const getTopConferences = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/digitallibrary/conference/top-conference",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//Trending Research Predio
export const TopResearchPredio = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/digitallibrary/top-research-predio", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//Top Researchers

export const handelResponse = (res) => async (dispatch) => {
  let returnValue = null;
  const status = res?.status;
  switch (status) {
    case 200:
      returnValue = { ...res, data: res?.data ? decrypt(res?.data) : {} };
      break;
    case 400:
      dispatch(throwError(res));
      returnValue = {
        status: status,
        message: res?.message,
      };
      break;
    default:
      throwError({ message: "Something went wrong!" });
      returnValue = {
        status: status,
        message: "Something went wrong!",
      };
      break;
  }
  return returnValue;
};
export const handelCatch = (error) => async (dispatch) => {
  let status = error?.response?.status;
  let messsage = error?.response?.data?.message || "Something went wrong!";
  let returnCatch = {
    status: status,
    messsage: messsage,
  };
  if (status === 401) {
    dispatch(setSessionExpired());
  } else {
    dispatch(
      setApiError({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  }
  return returnCatch;
};
export const handelSessionExpired = () => async (dispatch) => {
  dispatch(setSessionExpired());
};
export const showSuccess = (message) => async (dispatch) => {
  dispatch(
    setApiError({
      show: true,
      message: message,
      type: "success",
    })
  );
};
export const throwError = (res) => async (dispatch) => {
  let message = res?.message;
  message = message || "Something went wrong!";
  dispatch(
    setApiError({
      show: true,
      message: message,
      type: "danger",
    })
  );
};
export const throwSuccess = (msg) => async (dispatch) => {
  let message = msg || "Done Successfully.";
  dispatch(
    setApiError({
      show: true,
      message: message,
      type: "success",
    })
  );
};
export const {
  setApiError,
  setMembershipList,
  setEventTypeList,
  setSessionExpired,
  setIsLogout,
  unsetSessionExpired,
  setCountryList,
  setStateList,
  setCityList,
  setInstitutionList,
  setCourseList,
  setComitteeMemberCategoryList,
  setPostCategoryList,
  setUniversityList,
  setIsPremiumPopup,
  storeEventData,
  storePostList,
  setFollowedChapterList,
  setMyGroupsList,
  setMyEvents,
  setMyNetworkDetails,
  setPersonalExecutive,
  setTourIndex,
  setIsTour,
  setRProfileID,
  setRProfileData,
  setLanguageList,
  setPostID,
  setIsFeedback,
  setDepartmentList,
  setAllNewTopicList,
  setIsCalendar,
  setIsCollapseSidebar,
  setIsRegisterPopup,
  setSpeakerInviteRegistrationPopup,
  setMentorNotifyPopup,
  setVideoRecordingUrl,
  setIsMentorPremiumBenefit,
  setIsDiscountPopup,
  setAdvertisementsList,
  setIsGlobalProfilePreviewPopup,
  setNetworkListData,
  setNewDepartmentList,
} = globalSlice.actions;

export default globalSlice.reducer;
