import { createSlice } from "@reduxjs/toolkit";
import { getDataFromLocalStorage, storeLocalStorageData } from "utils/helpers";
import {
  handelResponse,
  handelCatch,
  unsetSessionExpired,
  setIsLogout,
} from "store/slices";
import { api } from "services";

const initialState = { userData: {}, speakeRegisterData: {} };
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeUserData(state, action) {
      state.userData = action.payload;
    },
    storeSpeakeregisterData(state, action) {
      state.speakeRegisterData = action.payload;
    },
    removeUserData(state) {
      state.userData = {};
    },
  },
});

export const { storeUserData, removeUserData, storeSpeakeregisterData } =
  authSlice.actions;
export const handelLogin = (credentials) => async (dispatch) => {
  try {
    const res = await api.post("/login", credentials, {});
    const responseData = await dispatch(handelResponse(res));
    if (responseData?.status === 200) {
      storeLocalStorageData(responseData?.data);
      dispatch(storeUserData(responseData?.data));
    }
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelMemberLogin = (credentials) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/login", credentials, {});
    const responseData = await dispatch(handelResponse(res));
    if (responseData?.status === 200) {
      if (responseData?.data?.user_type === "1") {
        dispatch(
          handelCatch({
            response: {
              status: 400,
              data: { message: "Something wrong with this login credential!" },
            },
          })
        );
      } else {
        storeLocalStorageData(responseData?.data);
        dispatch(storeUserData(responseData?.data));
      }
    }
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelRegister = (credentials) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/register", credentials, {});
    const responseData = await dispatch(handelResponse(res));
    if (responseData?.status === 200) {
      storeLocalStorageData(responseData?.data);
      dispatch(storeUserData(responseData?.data));
    }
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// -----Speaker Registration-----
export const speakerRegistration = (credentials) => async (dispatch) => {
  try {
    const res = await api.post("/sepkaer-registration", credentials, {});
    const responseData = await dispatch(handelResponse(res));
    if (responseData?.status === 200) {
      storeLocalStorageData(responseData?.data);
      dispatch(storeUserData(responseData?.data));
    }
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
//storeSpeakeregisterData
export const speakeregisterData = (userData) => async (dispatch) => {
  try {
    dispatch(storeSpeakeregisterData(userData));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//verify-email-send
export const handelSpeakerEmailVerify = (credentials) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/verify-email-send", credentials, {});
    // return await dispatch(handelResponse(res));
    const responseData = await dispatch(handelResponse(res));
    // if (responseData?.status === 200) {
    //   storeLocalStorageData(responseData?.data);
    //   dispatch(storeUserData(responseData?.data));
    // }
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelSendOTP = (credentials) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/resend-otp", credentials, {});
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelUserRegisterDetails = (credentials) => async (dispatch) => {
  try {
    const res = await api.post("/user/registration-details", credentials, {});
    const responseData = await dispatch(handelResponse(res));
    if (responseData?.status === 200) {
      let oldData = getDataFromLocalStorage();
      oldData = {
        ...oldData,
        registration_status: responseData?.data?.registration_status,
      };
      storeLocalStorageData(oldData);
    }
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//update address and pincode
export const updateAddressDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post(
      "/user/profile/update-user-address-info",
      formData
    );
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchUserDetails = () => async (dispatch) => {
  try {
    const res = await api.get("/user/profile/details");
    const responseData = await dispatch(handelResponse(res));
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getMembershipDetails = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/get-membership-benefits", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const editMembership = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/membership-pay", formData);
    const responseData = await dispatch(handelResponse(res));

    if (responseData?.status === 200) {
      let oldData = getDataFromLocalStorage();
      oldData = {
        ...oldData,
        registration_status: "4",
      };
      storeLocalStorageData(oldData);
    }
    return responseData;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const changePassword = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/change-password", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const forgotPassword = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/forgot-password", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const verifyOTP = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/dashboard/register-verify-otp", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const logoutAPI = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user/logout", formData);
    return await dispatch(handelResponse(res));
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelLogout = () => async (dispatch) => {
  localStorage.clear();
  // caches?.keys().then((names) => {
  //   names.forEach((name) => {
  //     caches?.delete(name);
  //   });
  // });
  dispatch(removeUserData());
  dispatch(unsetSessionExpired());
  dispatch(setIsLogout(false));
};

export default authSlice.reducer;
