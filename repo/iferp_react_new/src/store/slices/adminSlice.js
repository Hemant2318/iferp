import { createSlice } from "@reduxjs/toolkit";
import { api } from "services";
import { getFilenameFromUrl } from "utils/helpers";
import {
  handelResponse,
  handelCatch,
  storeEventData,
  setMyNetworkDetails,
  setNetworkListData,
} from "../slices";

const initialState = {};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
});

export const saveData = (url) => {
  var link = document.createElement("a");
  link.download = getFilenameFromUrl(url);
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Event Management
export const fetchUserByEvents = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-users-by-event?eventid=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchQuartelyList =
  (id = "IFERP") =>
  async (dispatch) => {
    try {
      const res = await api.get(
        `/admin/get-quartely-list?iferp_or_my_plan=${id}`
      );
      return await dispatch(handelResponse(res));
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const fetchQuartelyDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/get-quartely-details`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchPricingCategory = () => async (dispatch) => {
  try {
    const res = await api.get("/admin/event/pricing/category/get");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updatePricingCategory = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/event/pricing/category/update",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchEventPricing = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/event/pricing/get/details", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateEventPricing = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/event/pricing/update", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteEventPricing = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/event/pricing/delete?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteAddOnPricing = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/event/pricing/addon/delete?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getEventParticipants = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-event-participants", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEventParticipants = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/participants-member", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editEventParticipants = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/participants-edit", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteEventParticipants = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/participants-delete", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Profile Management
export const fetchUserType = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/user/profile/users?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAllProfiles = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/users-profile", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchParticipants = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/user-profile", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAllResourceProfiles = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/resource/get/all/profiles", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-member", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/edit-member", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-user", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/export-profile", formData, {});
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Journal Management - Journal
export const fetchJournals = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-journal", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addJournal = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-journal", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editJournal = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/update-journal", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteJournal = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-journal", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Journal Management - Submitted Papers
export const fetchJournalPapers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/journals-submitted-papers",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchJournalPapersDetails = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/edit-submitted-paper?papers_id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editJournalPaper = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/update-submitted-paper", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteJournalPaper = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-submitted-papers", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateSubmittedPapers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/update-journals-submitted-papers-status",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const resubmittedPapers = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/resubmit-journal-paper", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const journalRegisteredStatusChange = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/journalRegisteredStatusChange?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportJournalPaper =
  (formData = {}) =>
  async (dispatch) => {
    try {
      const res = await api.post(
        "/admin/export-submitted-papers-data",
        formData,
        {}
      );
      const response = await dispatch(handelResponse(res));
      if (response?.data) {
        saveData(response?.data);
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };

// Journal Management - Publication Assistance
export const fetchPublicationAssistance = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/get-publication-assistance",
      formData,
      {}
    );

    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Award Management - Award Winners
export const fetchAwardWinners = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-award-winners", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAwardWinnersDetails = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/edit-award-winner?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addAwardWinners = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-award-winner", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addOldAwardWinners = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/old-user-add-award-winner",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editAwardWinners = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/update-award-winner", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editOldAwardWinners = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/old-user-update-award-winner",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteAwardWinners = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-award-winner", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportAwardWinners =
  (formData = {}) =>
  async (dispatch) => {
    try {
      const res = await api.post(
        "/admin/export-award-winners-data",
        formData,
        {}
      );
      const response = await dispatch(handelResponse(res));
      if (response?.data) {
        saveData(response?.data);
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };

// Award Management - Nomination Details
export const fetchNomination = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-award-nominations", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editNomination = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/update-award-nominee", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteNomination = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-award-nomination", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportNomination =
  (formData = {}) =>
  async (dispatch) => {
    try {
      const res = await api.post(
        "/admin/export-award-nominations-data",
        formData,
        {}
      );
      const response = await dispatch(handelResponse(res));
      if (response?.data) {
        saveData(response?.data);
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };

// Chapters & Groups management - Chapters
export const fetchChapters = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-chapter", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addChapters = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-chapter", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteChapters = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-chapter", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getChaptersEventsPeople = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/get-chapters-events-people",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchSingleUserChapter = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-chapters", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchChapterMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-chapters-members", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportChapterMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/export-chapters-members-data",
      formData,
      {}
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Chapters & Groups management
export const fetchSIGGroup = () => async (dispatch) => {
  try {
    const res = await api.post("/user/network/sig-group/get", {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addSIGGroup = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/sig-group/create-edit", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteSIGGroup = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/sig-group/delete", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Resource Management
export const fetchAllResources = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-resource", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchResourceDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/edit-resource", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addResource = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-resource", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editResource = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/update-resource", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteResource = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-resource", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportResources = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/export-resource", formData, {});
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportResourceData = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/export-single-resource", formData, {});
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Career Management
export const fetchAllCareer = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-career", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAppliedCareer = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/my/career/applied/details", formData, {});
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteCareer = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-career", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addCareer = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-career", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editCareer = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/edit-career", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAllCareerEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-career-events", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addCareerEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-career-event", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteCareerEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-career-event", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchCareerEventMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/get-career-applied-members",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportCareerEventMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/export-career-applied-members",
      formData,
      {}
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getCareerDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/career/get/benefits/guidelines",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const careerdDeleteOrStatusUpdate = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/career/delete-and-status-change",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Career management: Become keynote Speaker
// Send Invitation
export const sendInvitation = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/invite-speaker", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchInviteSpeakers = () => async (dispatch) => {
  try {
    const res = await api.get("/admin/invite-speaker-list");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchInviteSpeakerDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/speaker-view", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//user side: Become keynote Speaker
//speaker-status
export const changeStatus = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/speaker-status", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//user side: Become keynote Speaker
//upload document
export const uploadDocument = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/speaker-doument", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Event Management
export const fetchAllEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-all-events", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getEvent = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-single-event?id=${id}`);
    const response = await dispatch(handelResponse(res));
    const eventData = response?.data || {};
    dispatch(storeEventData(eventData));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEvent = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-event", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editEvent = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/edit-event-details", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteEvent = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-event", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addAgenda = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-event-agenda-session", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getSessionsByAgendaId = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-agenda-by-session?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addMyInterestSessions = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-session-to-interest", formData);
    return await dispatch(handelResponse(res));
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
export const getSingleSpeaker = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-single-speaker?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getSingleCommitteeMember = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-single-committee-member?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getCommunity = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-community-details?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getNominations = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/event/get-nominations", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const EditNominations = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/event/nomination-status-change",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteNominations = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/event/delete-nomination?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
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
export const editSponsors = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/event/sponsor-status-change", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchSponsorsDetail = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/event/get-single-sponsor-detail",
      formData
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteSponsors = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/event/delete-sponsor?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Event Management - Reviewers
export const fetchResourceReviewers = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/resource/event/reviewers/list/get?${queryParams}`
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const allocateAbstract = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/resource/event/reviewers/allocate/abstract/to/user",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchReviewrEvents = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/resource/event/reviewers/users/events/as/reviewer",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchReviewrEventsAbstracts = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/resource/event/reviewers/get/abstracts/by/event",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteAllocatedReviewerAbstracts = (id) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/resource/event/reviewers/delete/allocated/abstract?id=${id}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchReviewrDetails = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/resource/event/reviewers/allocated/details/get?${queryParams}`
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchMyReviewersAbstracts = () => async (dispatch) => {
  try {
    const res = await api.get(
      "/user/resource/event/reviewers/abstracts/allocated/to/me"
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Event Management - Submitted Abstracts
export const fetchSubmittedAbstracts = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/event/abstract/get-all", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchSubmittedAbstractsDetails = (id) => async (dispatch) => {
  try {
    const res = await api.get(
      `/admin/event/abstract/get-single-abstract?id=${id}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteSubmittedAbstract = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/event/abstract/delete-abstract",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateEventsSubmittedAbstractStatus =
  (formData) => async (dispatch) => {
    try {
      const res = await api.post(
        "/admin/event/abstract/update-abstract-status",
        formData,
        {}
      );
      return await dispatch(handelResponse(res));
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const updateReSubmittAbstract = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/event/abstract/re-submit-event-abstract",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportSubmittedAbstracts =
  (formData = {}) =>
  async (dispatch) => {
    try {
      const res = await api.post(
        "/admin/event/abstract/export-abstract",
        formData,
        {}
      );
      const response = await dispatch(handelResponse(res));
      if (response?.data) {
        saveData(response?.data);
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
// Event Management - Submitted Abstracts
export const fetchCommitteeMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/get-all-events-committee-members",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteCommitteeMembers = (id) => async (dispatch) => {
  try {
    const res = await api.get(
      `/admin/delete-single-committee-members?id=${id}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportCommitteeMembers = () => async (dispatch) => {
  try {
    const res = await api.get("/admin/export-committee-members");
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateEventAbstractStatus = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/event/abstract/update-submitted-status",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateCommitteeMemberStatus = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/status-change-committee-members",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
// Event Management - Activity Report
export const getInstituteActivityReport = (params) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/institute/activity-report/get?${params}`);
    const response = await dispatch(handelResponse(res));
    if (typeof response?.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const changeInstituteActivityReportStatus =
  (params) => async (dispatch) => {
    try {
      const res = await api.get(
        `/admin/institute/activity-report/change-status?${params}`
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
export const deleteActivityReport = (id) => async (dispatch) => {
  try {
    const res = await api.get(
      `/admin/institute/activity-report/delete?id=${id}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Journal Management - Reviewers
export const fetchJournalResourceReviewers =
  (queryParams) => async (dispatch) => {
    try {
      const res = await api.get(
        `/user/resource/journal/reviewers/list/get?${queryParams}`
      );
      const response = await dispatch(handelResponse(res));
      if (response?.data && typeof response.data === "string") {
        saveData(response?.data);
      }
      return response;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const allocateJournalAbstract = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/resource/journal/reviewers/allocate/abstract/to/user",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchReviewrJournal = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/resource/journal/reviewers/users/journals/as/reviewer",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchReviewrJournalPaper = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/resource/journal/reviewers/get/abstracts/by/journal",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteJournalAllocatedReviewerAbstracts =
  (id) => async (dispatch) => {
    try {
      const res = await api.get(
        `/user/resource/journal/reviewers/delete/allocated/abstract?id=${id}`
      );
      return await dispatch(handelResponse(res));
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };

export const fetchJournalReviewrDetails = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/resource/journal/reviewers/allocated/details/get?${queryParams}`
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchMyReviewersJournal = () => async (dispatch) => {
  try {
    const res = await api.get(
      "/user/resource/journal/reviewers/abstracts/allocated/to/me"
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Certificate Management - Event Certificates
export const fetchEventsRegisteredMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/get-events-registered_member",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const editEventCertificate = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/upload-event-certificate", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editMembershipCertificate = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/upload-membership-certificate",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editInstitutionCertificate = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/upload-institution-certificate",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const uploadEventCertificate = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/event-certificate", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteEventCertificate = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/delete-certificate", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchInstitutionMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-institutions", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportEventsCertificate = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/export-events-members-data", formData);
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportInstitutionCertificate = () => async (dispatch) => {
  try {
    const res = await api.post("/admin/export-institution-data");
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAmbasadorMembers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/institutions-ambassadors-details",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editAmbasadorCertificate = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/upload-institutions-ambassadors-certificate",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const exportAmbasadorCertificate = () => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/export-institutions-ambassadors-details"
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Branding Management - Branding
export const fetchAllBranding = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/get-branding-category", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addBranding = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/add-branding-category", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editBranding = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/update-branding-category", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteBranding = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/delete-branding-category?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchAllBrandingApplied = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/get-branding-applied-details",
      formData,
      {}
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteBrandingApplied = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/branding-applied-delete", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getBrandingAppliedDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/get-single-branding-applied-details",
      formData,
      {}
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data && typeof response.data === "string") {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editBrandingAppliedStatus = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/branding-applied-status-change",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Inbox/Notifications
export const fetchEmailReciever = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(
      `/user/inbox/notifications/receiver/users/list?${queryParams}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchInboxMessage = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/inbox/notifications/get/message",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const sendMessage = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/inbox/notifications/send/message",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchSingleMessage = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/inbox/notifications/get/single/message",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const replyMessage = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/inbox/notifications/reply/forward/message",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteMessage = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/inbox/notifications/delete/messages",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const starMessage = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/inbox/notifications/star/message",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Network Management - Network
export const fetchNetworkUsers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/requests/get-all-users-except-me",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchUserNetwork = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/user/follower/request${queryParams}`);
    const response = await dispatch(handelResponse(res));
    const followers = response?.data?.followers || [];
    const following = response?.data?.following || [];
    const receive_follow_request = response?.data?.receive_follow_request || [];
    const send_follow_request = response?.data?.send_follow_request || [];
    dispatch(
      setNetworkListData({
        followers: followers,
        following: following,
        receive_follow_request: receive_follow_request,
        send_follow_request: send_follow_request,
        isPageLoading: false,
      })
    );
    return response;
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
export const fetchMyDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/requests/my-details", formData);
    const response = await dispatch(handelResponse(res));
    dispatch(setMyNetworkDetails(response?.data || {}));
    return response;
    //
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
// Network Management - Feedback
export const getFeedback = () => async (dispatch) => {
  try {
    const res = await api.get("/admin/feedbacks/get");
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/edit-profile", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getDashboard = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/user/dashboard${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEditUniversity = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/add-update-university", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addEditInstitution = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/add-update-institution", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getOtherUniversities = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/get-other-universities", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const mapUniversity = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/university-mapping", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getOtherInstitutions = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/get-other-institutions", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const mapInstitution = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/institution-mapping", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getGroupFollowers = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/sig-group/group-details",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//region management
//get country
export const getAllCountries = (queryParams) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/country/list?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//add-edit country
export const addUpdateCountry = (queryParams) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/country/add-edit?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//delete country
export const deleteCountry = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/country/delete`, id);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//get state
export const getAllStates = (queryParams) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/state/list?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//add-edit state
export const addUpdateState = (queryParams) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/state/add-edit?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//delete state
export const deleteState = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/state/delete`, id);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//get city
export const getAllCities = (queryParams) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/city/list-search?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//add-edit city
export const addUpdateCity = (queryParams) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/city/add-edit?${queryParams}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//delete city
export const deleteCity = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/city/delete`, id);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//currency conversion
export const updateCurrency = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/store-exchange-rate", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchPendingPayments = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/mentorship/bank-transfer", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const exportBankTransferPending = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/bank-transfer-pending-export",
      formData
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const setBankTransferStatus = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/mentorship/bank-transfer-status",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchTopCitations = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/top-cation", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchAllCitations = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/network/posts/cation-list", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

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

//news letter

export const fetchNewsLetter = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/subscribe-user-data", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const exportNewsLetter = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/export-subscribe-user-data",
      formData,
      {}
    );
    const response = await dispatch(handelResponse(res));
    if (response?.data) {
      saveData(response?.data);
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const updateNewsLetter = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/admin/edit-subscribe-user-data", formData, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const deleteNewsLetter = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/admin/delete-subscribe-user-data",
      formData,
      {}
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//news notification
export const fetchNewsNotificationList = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/advertisement`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const createAdvertisement = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/advertisement/store`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const updateSingleAdvertisement = (id, formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/advertisement/update/${id}`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteSingleAdvertisement = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/advertisement/delete/${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//get departments
export const getAllDepartments = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/get-department`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// common API for add department and update department
export const addingDepartments = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/add-department`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// update department
// export const updateDepartments = (id, formData) => async (dispatch) => {
//   try {
//     const res = await api.post(`/admin/update-department/${id}`, formData);
//     return await dispatch(handelResponse(res));
//   } catch (error) {
//     return dispatch(handelCatch(error));
//   }
// };

//delete department
export const deleteDepartments = (id, formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/delete-department/${id}`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//add topic
export const addTopics = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/add-topics`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//update topic
// export const updateTopic = (formData) => async (dispatch) => {
//   try {
//     const res = await api.post(`/admin/update-topics`, formData);
//     return await dispatch(handelResponse(res));
//   } catch (error) {
//     return dispatch(handelCatch(error));
//   }
// };

// delete topic
// export const deleteTopic = (formData) => async (dispatch) => {
//   try {
//     const res = await api.post(`/admin/delete-topics`, formData);
//     return await dispatch(handelResponse(res));
//   } catch (error) {
//     return dispatch(handelCatch(error));
//   }
// };

//bulk Uploading of topic
export const bulkAddTopics = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      `/admin/add-department-topic-by-excel`,
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//common for topic update, delete and topic map in department
export const commonFunctionalityTopic = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/topics`, formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export default adminSlice.reducer;
