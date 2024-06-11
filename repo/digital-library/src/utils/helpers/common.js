import { decrypt, encrypt } from "./encryptdecrypt";
import moment from "moment";
import { saveAs } from "file-saver";
import { throwError } from "store/globalSlice";

const accessKey = import.meta.env.VITE_APP_AWS_ACCESS_KEY;
const secretKey = import.meta.env.VITE_APP_AWS_SECRET_KEY;
const region = import.meta.env.VITE_APP_AWS_REGION;

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: region,
});

const s3 = new AWS.S3();

// convert string into title case
export const titleCaseString = (value) => {
  if (typeof value !== "string") return "";
  return value.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase()); // Capital first character of each word
};

// Trim all left space
export const trimLeftSpace = (value) => value.replace(/^\s+/g, ""); // Remove white space from left side

// Create array by given year
export const getYearByCount = (startYear, endYear) => {
  let returnValue = [];
  while (startYear <= endYear) {
    returnValue.push(`${startYear++}`);
  }
  return returnValue;
};

export function getHeaderData() {
  let header = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (getDataFromLocalStorage("token")) {
    header = {
      ...header,
      ...{ Authorization: `Bearer ${getDataFromLocalStorage("token")}` },
    };
  }
  return header;
}
export const storeLocalStorageData = (newData) => {
  const decryptData = decrypt(localStorage.userData || {});
  localStorage.userData = encrypt({ ...decryptData, ...newData });
};
export function getDataFromLocalStorage(key = "") {
  let returnValue = "";
  if (localStorage.userData) {
    const localObjectData = decrypt(localStorage.userData);
    if (key) {
      returnValue = localObjectData[key] ? localObjectData[key] : "";
    } else {
      returnValue = localObjectData;
    }
  }
  return returnValue;
}

export const generatePreSignedUrl = async (file, folderName) => {
  let returnValue = "";
  const url = await s3.getSignedUrlPromise("getObject", {
    Bucket: `${import.meta.env.VITE_APP_AWS_BUCKET}/${folderName}`,
    Key: file,
    Expires: 3600,
  });
  returnValue = url;
  return returnValue;
};
export const combineArrayS3 = async (list, key, path) => {
  const promises = list?.map(async (elm) => {
    let response = elm[key] ? await generatePreSignedUrl(elm[key], path) : "";
    return { ...elm, s3File: response };
  });
  const results = await Promise.all(promises);
  return results;
};
export const objectToFormData = (obj) => {
  let formData = new FormData();
  for (let key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
};

export const formatDate = (date, format = "DD MMM YYYY") => {
  let returnValue = "";
  if (date) {
    returnValue = moment(date).format(format);
  }
  return returnValue;
};

export const getDateProp = (type, date) => {
  let returnValue = "";
  const momentDate = moment(date);
  switch (type) {
    case "year":
      returnValue = momentDate.format("YYYY");
      break;
    case "month":
      returnValue = momentDate.format("MM");
      break;

    default:
      break;
  }
  return returnValue;
};

export const getDaysDiff = (startDate, endDate, dateFormat = "YYYY-MM-DD") => {
  const getDateAsArray = (date) => {
    return moment(date.split(/\D+/), dateFormat);
  };
  return getDateAsArray(endDate).diff(getDateAsArray(startDate), "days") + 1;
};

export const getEventDate = (start, end) => {
  let returnValue = "";
  if (start && end) {
    returnValue = formatDate(start);
    if (getDateProp("year", start) === getDateProp("year", end)) {
      if (getDateProp("month", start) === getDateProp("month", end)) {
        var days = getDaysDiff(start, end);
        if (days === 1) {
          returnValue = moment(start).format("DD MMM YYYY");
        } else if (days === 2) {
          returnValue = `${moment(start).format("DD")} & ${moment(end).format(
            "DD MMM YYYY"
          )}`;
        } else if (days > 2) {
          returnValue = `${moment(start).format("DD")} - ${moment(end).format(
            "DD MMM, YYYY"
          )}`;
        } else {
          returnValue = "";
        }
      } else {
        returnValue = `${moment(start).format("DD MMM")} - ${moment(end).format(
          "DD MMM, YYYY"
        )}`;
      }
    } else {
      returnValue = `${moment(start).format("DD MMM YYYY")} - ${moment(
        end
      ).format("DD MMM YYYY")}`;
    }
  }
  return returnValue;
};

export const getFilenameFromUrl = (url) => {
  if (url) {
    return url.substring(url.lastIndexOf("/") + 1);
  }
  return "";
};

export const objectToQueryParams = (object) => {
  return new URLSearchParams(object).toString();
};

// get string of message duration.
export const messageTime = (dateTime) => {
  let returnValue = "";
  const currentDate = moment();
  const fetchedDate = moment(dateTime, "DD-MM-YYYY hh:mm A");
  const different = currentDate.diff(fetchedDate);
  const diffDuration = moment.duration(different);
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minuts = diffDuration.minutes();
  if (fetchedDate) {
    if (days > 365) {
      const convertToYear = Math.floor(days / 365);
      returnValue = `${convertToYear}y ago`;
    } else if (days > 30) {
      const convertToMonth = Math.floor(days / 30);
      returnValue = `${convertToMonth}m ago`;
    } else if (days > 7) {
      const convertToWeek = Math.floor(days / 7);
      returnValue = `${convertToWeek}w ago`;
    } else if (days > 0) {
      returnValue = `${days}d ago`;
    } else if (hours > 0) {
      returnValue = `${hours}h ago`;
    } else if (minuts > 0) {
      returnValue = `${minuts}m ago`;
    } else if (minuts === 0) {
      return "Just Now";
    } else {
      returnValue = "";
    }
  }

  return returnValue;
};

export const userTypeByStatus = () => {
  let returnValue = "member";
  switch (getDataFromLocalStorage("user_type")) {
    case "0":
      returnValue = "admin";
      break;
    case "2":
      returnValue = "professional";
      break;
    case "3":
      returnValue = "institutional";
      break;
    case "4":
      returnValue = "corporate";
      break;
    case "5":
      returnValue = "student";
      break;

    default:
      returnValue = "member";
      break;
  }
  return returnValue;
};

export const downloadFile =
  (url, name = null) =>
  async (dispatch) => {
    const fileName = name ? name : getFilenameFromUrl(url);
    if (fileName.includes(".")) {
      saveAs(url, fileName, { autoBom: false });
    } else {
      dispatch(throwError("File extension is missing of this file."));
    }
  };

export const convertDescription = (utfString, readMore = null) => {
  let returnValue = "";
  if (utfString) {
    let geturl = new RegExp(
      /(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))/,
      "g"
    );
    let text = utfString.replace(/\n\r?/g, "<br />");
    if (text.length > 100 && readMore) {
      text = text.substring(0, 320) + `... <a href="${readMore}">read more</a>`;
    }
    let matchData = text.match(geturl);
    matchData?.forEach((e) => {
      text = text.replace(
        e,
        ` <a className="" href="${trimLeftSpace(
          e
        )}" target="_blank">${trimLeftSpace(e)}</a>`
      );
    });
    returnValue = text;
  }
  return returnValue;
};

export const countWordValidation = (value, wordLimit) => {
  const wordCount = value?.trim().split(/\s+/)?.length;
  if (wordCount > wordLimit) {
    return `Maximum ${wordLimit} words allowed.`;
  } else {
    return "";
  }
};
