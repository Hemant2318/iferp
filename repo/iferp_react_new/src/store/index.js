import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import globalSlice from "./slices/globalSlice";
import adminSlice from "./slices/adminSlice";
import studentSlice from "./slices/studentSlice";
import chatSlice from "./slices/chatSlice";
import mentorshipSlice from "./slices/mentorshipSlice";
import mentorshipManagementSlice from "./slices/mentorshipManagementSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    global: globalSlice,
    admin: adminSlice,
    student: studentSlice,
    chat: chatSlice,
    mentorship: mentorshipSlice,
    mentorshipManagement: mentorshipManagementSlice,
  },
});

export default store;
