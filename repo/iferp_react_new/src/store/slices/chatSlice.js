import { createSlice } from "@reduxjs/toolkit";
import { handelCatch, handelResponse } from "./globalSlice";
import { api } from "services";

const initialState = {};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
});
export const getNodeToken = (data) => async (dispatch) => {
  try {
    const res = await api.node_post("/token/getToken", data);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getChatGroups = (id) => async (dispatch) => {
  try {
    const res = await api.node_get(`/groups/fetchGroups?id=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getChatMessages = (id) => async (dispatch) => {
  try {
    const res = await api.node_get(`/messages/fetchMessages?groupId=${id}`);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const fetchChatMessageDetails = (id) => async (dispatch) => {
  try {
    const res = await api.node_get(
      `/messages/fetchMessageDetails?messageId=${id}`
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const sendChatMessages = (formData) => async (dispatch) => {
  try {
    const res = await api.node_post("/messages/sendMessages", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const resetBadge = (formData) => async (dispatch, getState) => {
  try {
    const res = await api.node_post("/groups/resetBadge", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateSocket = (formData) => async (dispatch) => {
  try {
    const res = await api.node_post("/users/updateSocket", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateLastSeen = (formData) => async (dispatch) => {
  try {
    await api.node_post("/users/updateLastSeen", formData);
    // return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const createGroup = (formData) => async (dispatch) => {
  try {
    const res = await api.node_post("/groups/createGroup", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const notifyCreateGroup = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/network/requests/chat-send-messages",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const checkGroup = (formData) => async (dispatch) => {
  try {
    const res = await api.node_post("/groups/checkGroup", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const uploadChatFile = (formData) => async (dispatch) => {
  try {
    const res = await api.node_post("/helpers/uploadChatFile", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteChatMessage = (formData) => async (dispatch) => {
  try {
    const res = await api.node_post("/messages/deleteMessages", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const sendChatMessagesInBulk = (formData) => async (dispatch) => {
  try {
    const res = await api.node_post("/messages/sendBulkMessages", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export default chatSlice.reducer;
