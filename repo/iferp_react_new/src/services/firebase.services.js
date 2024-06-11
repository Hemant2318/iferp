import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDHnSwJ-5tStWh_qnRxbmzQ300D8EnISJM",
  authDomain: "iferp-57ded.firebaseapp.com",
  projectId: "iferp-57ded",
  storageBucket: "iferp-57ded.appspot.com",
  messagingSenderId: "115830330284",
  appId: "1:115830330284:web:6342f55780d452a77a2009",
  measurementId: "G-F730NGVXME",
};

firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

// Retrieve firebase messaging
const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : null;

export const getToken = async () => {
  let returnValue = "";
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await messaging
      ?.getToken({
        vapidKey:
          "BBnSz7DPOv0SrJi1aYQGRrdRLEgdBCsjT7JWlzAvCc2iFT2OPCQul9m5_5wPS2xxre-mezTAvu-dUKHYQ4ohyXs",
      })
      .then((currentToken) => {
        if (currentToken) {
          returnValue = currentToken;
        } else {
          returnValue = "";
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        returnValue = "";
        console.log("An error occurred while retrieving token. ", err);
      });
    return returnValue;
  } else {
    return "";
  }
};
export const onMessageListener = (handelMessageClick) => {
  messaging?.onMessage((payload) => {
    // console.log("Received in forground", payload);
    const content = payload.notification;
    const notificationTitle = content.title;
    const notificationOptions = {
      body: content.body,
    };

    const notification = new Notification(
      notificationTitle,
      notificationOptions
    );
    notification.onclick = (event) => {
      event.preventDefault();
      handelMessageClick(payload?.data || {});
      notification.close();
    };
    return payload;
  });
};
