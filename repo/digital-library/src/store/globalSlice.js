import { createSlice } from "@reduxjs/toolkit";
import { decrypt } from "utils/helpers";
import { api } from "services";
import {
  storeLocalStorageData,
  getDataFromLocalStorage,
  getFilenameFromUrl,
} from "utils/helpers";

const initialState = {
  researchPediaData: null,
  isSessionExpires: false,
  isCitetion: false,
  isShare: false,
  errorData: {},
  eventData: {},
  postList: [],
  countryList: [],
  networkData: {
    followers: [],
    following: [],
    receive_follow_request: [],
    send_follow_request: [],
  },
  researchProfile: {},
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setErrorData(state, action) {
      state.errorData = action.payload;
    },
    setSessionExpired(state, action) {
      state.isSessionExpires = action.payload;
    },
    setIsCitetion(state, action) {
      state.isCitetion = action.payload;
    },
    setIsShare(state, action) {
      state.isShare = action.payload;
    },
    storeEventData(state, action) {
      state.eventData = action.payload;
    },
    storePostList(state, action) {
      state.postList = action.payload;
    },
    setCountryList(state, action) {
      state.countryList = action.payload;
    },
    setNetworkData(state, action) {
      state.networkData = action.payload;
    },
    setResearchProfile(state, action) {
      state.researchProfile = action.payload;
    },
  },
});
export const fetchProfile = () => async (dispatch) => {
  try {
    const res = await api.get("/user/profile/details");
    const response = await dispatch(handelResponse(res));
    if (response.data) {
      storeLocalStorageData(response.data);
      // dispatch(setUserDetails(response.data));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchRequests = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/requests/pending-follower-following",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const acceptRequests = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/requests/accept-reject",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchFollowerOrFollowing = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/requests/follower-following",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const sendRequests = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/requests/send", formData);
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

export const fetchUserEventDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/event/my-single-event-detail", formData);
    const response = await dispatch(handelResponse(res));
    // const eventData = response?.data || {};
    // dispatch(storeEventData(eventData));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getEvent = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-single-event?id=${id}`);
    const response = await dispatch(handelResponse(res));
    // const eventData = response?.data || {};
    // dispatch(storeEventData(eventData));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getCommunity = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/digitallibrary/event/community`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const eventPostList = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/event-post-list", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const saveData = (url) => {
  var link = document.createElement("a");
  link.download = getFilenameFromUrl(url);
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getSponsors = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/event/get-sponsors", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchUserNetwork = () => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/follower/request?user_id=${getDataFromLocalStorage("id")}`
    );
    const response = await dispatch(handelResponse(res));
    const followers = response?.data?.followers || [];
    const following = response?.data?.following || [];
    const receive_follow_request = response?.data?.receive_follow_request || [];
    const send_follow_request = response?.data?.send_follow_request || [];
    dispatch(
      setNetworkData({
        followers: followers,
        following: following,
        receive_follow_request: receive_follow_request,
        send_follow_request: send_follow_request,
      })
    );
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getTopConference = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      `/digitallibrary/conference/top-conference`,
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

//Trending Research Predio
export const topResearchPredio = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/digitallibrary/top-research-predio", formData);
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
export const getPostList = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/digitallibrary/post/get-category-post",
      formData
    );
    return await dispatch(handelResponse(res));
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
export const getSession = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-single-session?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//signup for newsletter
export const singUpNewsLetter = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/subscribe", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(response?.message));
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//phase 2
// discussions
export const getDiscussionUsingType = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/discussion", formData, {
      "Content-Type": "multipart/form-data",
    });
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//details of discussion
export const fetchSinglePost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/single", formData, {
      "Content-Type": "multipart/form-data",
    });
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// hide post
export const hidePost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/hide-unhide", formData, {
      "Content-Type": "multipart/form-data",
    });
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// create question
export const createPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/create", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// My Profile - skills Expertise
export const fetchResearchProfileData = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/user/research/get-details?${queryParams}`);
    const response = await dispatch(handelResponse(res));
    dispatch(setResearchProfile(response?.data || {}));

    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//people Skills
export const fetchMembersSkills = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/user/member-skill?${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//export citation
export const downloadCitationFormat = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/posts/cation-fromat-dwonload",
      formData
    );
    const response = await dispatch(handelResponse(res));
    // if (response?.data?.file_path) {
    //   saveData(response?.data?.file_path);
    // }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelResponse = (res) => async (dispatch) => {
  let returnValue = null;
  const status = res?.status;
  switch (status) {
    case 200:
      returnValue = { ...res, data: res?.data ? decrypt(res?.data) : {} };
      break;
    case 400:
      dispatch(throwError(res?.message || "Something went wrong!"));
      returnValue = {
        status: status,
        message: res?.message,
      };
      break;
    default:
      throwError("Something went wrong!");
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
    if (window.location.pathname !== "/session-expired") {
      window.location.href = "/session-expired";
    }
    // dispatch(setSessionExpired(true));
    // return null;
  } else {
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  }
  return returnCatch;
};
export const showSuccess = (message) => async (dispatch) => {
  dispatch(
    setErrorData({
      show: true,
      message: message,
      type: "success",
    })
  );
};
export const throwError = (message) => async (dispatch) => {
  dispatch(
    setErrorData({
      show: true,
      message: message,
      type: "danger",
    })
  );
};
export const {
  setErrorData,
  setSessionExpired,
  setIsCitetion,
  setIsShare,
  storeEventData,
  storePostList,
  setCountryList,
  setNetworkData,
  setResearchProfile,
} = globalSlice.actions;

export default globalSlice.reducer;
