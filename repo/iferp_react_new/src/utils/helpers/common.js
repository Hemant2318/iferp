import moment from "moment";
import { saveAs } from "file-saver";
import { findIndex, forEach } from "lodash";
import { dialCode, membershipType } from "utils/constants";
import { decrypt, encrypt } from "./index";
import { setApiError } from "store/slices";
import AWS from "aws-sdk";
import { PDFDocument, rgb } from "pdf-lib";
const PDFJS = window.pdfjsLib;
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

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
// Adding data to local storage
export function addToLocalStorage(key = "", value = "") {
  value && localStorage.setItem(key, JSON?.stringify(value));
}
// Retrieving data from local storage
export function getFromLocalStorage(key = "") {
  const value = key && localStorage?.getItem(key);
  return value ? JSON.parse(value) : null;
}
// Removing data from local storage
export function removeFromLocalStorage(key) {
  key && localStorage.removeItem(key);
}
export function getDecryptValueFromResponse(
  encryptString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  key = ""
) {
  let returnValue;
  // eslint-disable-next-line prefer-const
  returnValue = decrypt(encryptString);
  return returnValue;
}

export const getFilenameFromUrl = (url) => {
  if (Array.isArray(url)) {
    return url?.map((ul) => ul?.substring(ul?.lastIndexOf("/") + 1));
  } else {
    return url?.substring(url?.lastIndexOf("/") + 1);
  }
};

// export const getFilenameFromUrl = (url) => {
//   if (url) {
//     return url.substring(url.lastIndexOf("/") + 1);
//   }
//   return "";
// };

// convert string into title case
export const titleCaseString = (value) => {
  if (typeof value !== "string") return "";
  return value.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase()); // Capital first character of each word
};
// Trim all left space
export const trimLeftSpace = (value) => value.replace(/^\s+/g, ""); // Remove white space from left side
// Trim all space
export const trimAllSpace = (value) => value.replace(/ /g, ""); // Remove white space from left side
export const customId = () => {
  return Math.random().toString(16).slice(2);
};
export const bytesToSize = (bytes) => {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};
export const objectToFormData = (obj) => {
  let formData = new FormData();
  for (let key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
};

export const getFormDataArrayObject = (values) => {
  const formData = new FormData();
  Object.keys(values)?.forEach((key) => {
    if (Array.isArray(values[key])) {
      formData.append(key, JSON.stringify(values[key]));
    } else {
      formData.append(key, values[key]);
    }
  });
  return formData;
};

export const objectToQueryParams = (object) => {
  return new URLSearchParams(object).toString();
};

export const formatNumber = (format, number) => {
  const numberString = number.replace(/\D/g, "");
  var s = "" + numberString,
    r = "";
  for (var im = 0, is = 0; im < format.length && is < s.length; im++) {
    r += format.charAt(im) === "X" ? s.charAt(is++) : format.charAt(im);
  }
  return r;
};
export const getStatus = (status) => {
  switch (`${status}`) {
    case "0" || 0:
      return "Pending";
    case "1" || 1:
      return "Accepted";
    case "2" || 2:
      return "Rejected";

    default:
      return "";
  }
};
export const formatDate = (date, format = "DD MMM YYYY") => {
  let returnValue = "";
  if (date) {
    returnValue = moment(date).format(format);
  }
  return returnValue;
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
export const getEventDateData = (start, end) => {
  let returnValue = {};
  if (start && end) {
    if (getDateProp("year", start) === getDateProp("year", end)) {
      if (getDateProp("month", start) === getDateProp("month", end)) {
        var days = getDaysDiff(start, end);
        if (days === 1) {
          returnValue = {
            display: moment(start).format("DD MMM"),
            year: moment(start).format("YYYY"),
          };
        } else if (days === 2) {
          returnValue = {
            display: `${moment(start).format("DD")} & ${moment(end).format(
              "DD"
            )}`,
            year: `${moment(end).format("MMM YYYY")}`,
          };
        } else if (days > 2) {
          returnValue = {
            display: `${moment(start).format("DD")} - ${moment(end).format(
              "DD,"
            )}`,
            year: `${moment(start).format("MMM YYYY")}`,
          };
        } else {
          returnValue = {};
        }
      } else {
        returnValue = {
          display: `${moment(start).format("DD")} - ${moment(end).format(
            "DD"
          )}`,
          year: `${moment(end).format("MMM YYYY")}`,
        };
      }
    } else {
      returnValue = {
        display: `${moment(start).format("DD MMM YYYY")} -`,
        year: `${moment(end).format("DD MMM YYYY")}`,
      };
    }
  }
  return returnValue;
};
export const getDaysDiff = (startDate, endDate, dateFormat = "YYYY-MM-DD") => {
  const getDateAsArray = (date) => {
    return moment(date.split(/\D+/), dateFormat);
  };
  return getDateAsArray(endDate).diff(getDateAsArray(startDate), "days") + 1;
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
export const getEventStatus = (start, end) => {
  let returnValue = "";
  const startDate = moment(start);
  const endDate = moment(end);
  if (moment().isBetween(startDate, endDate)) {
    returnValue = "On Going";
  } else if (moment().isSameOrBefore(startDate, endDate)) {
    returnValue = "Completed";
  } else {
    returnValue = "Upcoming";
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
      dispatch(
        setApiError({
          show: true,
          message: "File extension is missing of this file.",
          type: "danger",
        })
      );
    }
  };
export const convertOCMToType = (
  committeeMembersCategoryList,
  committeeMembers
) => {
  let newArr = committeeMembersCategoryList.map((i) => ({ ...i, data: [] }));
  forEach(committeeMembers, (elem) => {
    const index = findIndex(newArr, ["id", +elem?.committee_member_category]);
    if (index !== -1) {
      newArr[index].data.push(elem);
    }
  });
  return newArr;
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
      returnValue = `${convertToYear} ${
        convertToYear === 1 ? "year" : "years"
      } ago`;
    } else if (days > 30) {
      const convertToMonth = Math.floor(days / 30);
      returnValue = `${convertToMonth} ${
        convertToMonth === 1 ? "month" : "months"
      } ago`;
    } else if (days > 7) {
      const convertToWeek = Math.floor(days / 7);
      returnValue = `${convertToWeek} ${
        convertToWeek === 1 ? "week" : "weeks"
      } ago`;
    } else if (days > 0) {
      returnValue = `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (hours > 0) {
      returnValue = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minuts > 0) {
      returnValue = `${minuts} ${minuts === 1 ? "minute" : "minutes"} ago`;
    } else if (minuts === 0) {
      return "Just Now";
    } else {
      returnValue = "";
    }
  }

  return returnValue;
};
export const numberOnlyFromInput = (e) => {
  const id = e.target.id;
  const value = e.target.value;
  const newVal = value.replace(/[^0-9]/g, "");
  return {
    target: {
      id: id,
      value: newVal,
    },
  };
};
export const convertString = (type = 1, e) => {
  const id = e.target.id;
  const value = e.target.value;
  const strType = {
    1: value?.toLowerCase(),
    2: value?.toUpperCase(),
    3: titleCaseString(value),
  };
  const newVal = strType[type];
  return {
    target: {
      id: id,
      value: newVal,
    },
  };
};
export const getYearList = (num) => {
  return [...Array(num)].map((_, i) => {
    return { id: moment().subtract(i, "year").format("YYYY") };
  });
};

export const getMonthAndYearList = () => {
  return [...Array(12)].map((_, i) => {
    return {
      id: `${moment().subtract(i, "month").format("MM")}/${moment().format(
        "YYYY"
      )}`,
      value: `${moment().subtract(i, "month").format("MMM")} ${moment().format(
        "YYYY"
      )}`,
    };
  });
};
export const getCountryCode = (val, optionKey = "dial_code", key = "code") => {
  let returnValue = dialCode.find((o) => o?.[key] === val)?.[optionKey] || "";
  return returnValue;
};

export const getOrderID = () => {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
};
export const getYearByCount = (startYear, endYear) => {
  let returnValue = [];
  while (startYear <= endYear) {
    returnValue.push(`${startYear++}`);
  }
  return returnValue;
};

export const toURLEncoded = (obj, prefix) => {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push(
        v !== null && typeof v === "object"
          ? toURLEncoded(v, k)
          : encodeURIComponent(k) + "=" + encodeURIComponent(v)
      );
    }
  }
  return str.join("&");
};

export const getUserType = () => {
  const userType = getDataFromLocalStorage("user_type");
  let returnValue = "member";
  if (userType) {
    returnValue = membershipType.find((o) => o.id === userType)?.type || "";
  }
  return returnValue;
};

export const generatePreSignedUrl = async (file, folderName) => {
  let returnValue = "";
  const url = await s3.getSignedUrlPromise("getObject", {
    Bucket: `${process.env.REACT_APP_AWS_BUCKET}/${folderName}`,
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

export const convertDescription = (utfString, readMore = null) => {
  let returnValue = "";
  if (utfString) {
    let geturl = new RegExp(
      /(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))/,
      "g"
    );
    let text = utfString.replace(/\n\r?/g, "<br />");
    if (text.length > 100 && readMore) {
      text = text.substring(0, 100) + `... <a href="${readMore}">read more</a>`;
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

export const extractPDFData = async (pdfUrl) => {
  var pdfData = await PDFJS.getDocument({
    url: pdfUrl,
    "Access-Control-Allow-Origin": "*",
  });
  const imagesList = [];
  const canvas = document.createElement("canvas");
  canvas.setAttribute("className", "canv");
  let textString = "";
  for (let i = 1; i <= pdfData.numPages; i++) {
    var page = await pdfData.getPage(i);
    const text = await page.getTextContent();
    var items = text.items;
    var finalString = "";
    var line = 0;

    for (var t = 0; t < items.length; t++) {
      if (line !== items[t].transform[5]) {
        if (line !== 0) {
          finalString += "\r\n";
        }
        line = items[t].transform[5];
      }
      finalString += items[t].str;
    }
    textString += finalString;

    var viewport = page.getViewport({ scale: 2 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var render_context = {
      canvasContext: canvas.getContext("2d"),
      viewport: viewport,
    };

    await page.render(render_context).promise;
    let img = canvas.toDataURL("image/png");
    imagesList.push(img);
  }

  return {
    content: textString,
    pages: imagesList,
  };
};

// convert file to base64
export const getBase64 = async (file) => {
  let returnValue = "";
  let reader = new FileReader();
  reader.readAsDataURL(file);
  await new Promise(async (resolve, reject) => {
    reader.onload = () => {
      returnValue = reader.result;
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
  return returnValue;
};

// convert base64/url to Uint8Array
export const urlToUnitArray = async (url) => {
  let retunData = [];
  await fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      retunData = new Uint8Array(buffer);
    });
  return retunData;
};

//convert blob to file
// export const convertBlobToFile = (blobUrl, fileName, mimeType) => {
//   const type = { type: mimeType };
//   const blobWithMimeType = new Blob([blobUrl], type);
//   return new File([blobWithMimeType], fileName, type);
// };

// convert hexa color to rgb
export const hexToRgbA = (hex) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  }
  throw new Error("Bad Hex");
};

// convert Uint8Array to base64
export const bytesToBase64 = (bytes) => {
  const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/",
  ];
  let result = "",
    i,
    l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3f];
  }
  if (i === l + 1) {
    // 1 octet yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += "==";
  }
  if (i === l) {
    // 2 octets yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0f) << 2];
    result += "=";
  }
  return result;
};

export const getCertificateData = (jsonData, exData = []) => {
  let data = jsonData ? JSON.parse(jsonData) : [];
  const userData = getDataFromLocalStorage();
  const {
    first_name,
    last_name,
    membership_details,
    user_type,
    member_id,
    personal_details = {},
    educational_details = {},
    professional_details = {},
    institution_details = {},
    company_details = {},
  } = userData;

  let { ug_institution_name, pg_institution_name, phd_institution_name } =
    educational_details;
  const { country_name } = personal_details;
  const {
    country_name: professionalCountry,
    institution_name: professionalInstitutionName,
  } = professional_details;
  const { institution_name, country_name: institutionCountry } =
    institution_details;
  const { company_name, company_country_name } = company_details;
  let countryName =
    country_name ||
    professionalCountry ||
    institutionCountry ||
    company_country_name ||
    "";
  let instituteValue =
    phd_institution_name ||
    pg_institution_name ||
    ug_institution_name ||
    institution_name ||
    company_name;
  if (user_type === "2") {
    instituteValue = professionalInstitutionName;
  }
  const findType = membershipType.find((o) => o.id === user_type)?.type;
  const dataObj = {
    user_name: `${first_name} ${last_name}`,
    first_name: first_name,
    last_name: last_name,
    start_date: moment(membership_details?.start_date).format("DD/MM/YYYY"),
    expire_date: moment(membership_details?.expire_date).format("DD/MM/YYYY"),
    membership_id: member_id,
    member_type: titleCaseString(findType),
    nationality: countryName,
    institution_or_company: instituteValue,
    cert_no: exData?.certificate_number || "",
    paper_title: exData?.paper_title || "",
    date_of_issue: exData?.create_at
      ? moment(exData?.create_at).format("DD/MM/YYYY")
      : "",
  };
  return data.map((elm) => {
    return { ...elm, value: dataObj?.[elm?.fieldName] || "" };
  });
};

export const getCertificatePdf = async (pdfFileData, fieldData) => {
  const pdfDoc = await PDFDocument.load(pdfFileData);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { height } = firstPage?.getSize();

  fieldData?.forEach((elm) => {
    const {
      value,
      left,
      top,
      fontSize,
      fontColor,
      lineBreak,
      wordLeft,
      wordTop,
      isCenter,
    } = elm;
    const canvas = document.getElementById("textCanvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px`;
    const textWidth = context.measureText(value).width;
    const centerX = left - textWidth / 2;
    let nC = hexToRgbA(fontColor);
    if (lineBreak) {
      if (value) {
        const sapratorChar = value?.substring(
          parseInt(lineBreak) - 1,
          parseInt(lineBreak)
        );
        const line1 = `${value?.substring(0, parseInt(lineBreak))}${
          sapratorChar !== " " && sapratorChar ? "-" : ""
        }`;
        const line2 = value?.substring(parseInt(lineBreak));
        firstPage.drawText(line1, {
          x: +left,
          y: height - +top,
          size: +fontSize,
          color: rgb(nC[0] / 255, nC[1] / 255, nC[2] / 255),
        });
        firstPage.drawText(line2, {
          x: +wordLeft,
          y: height - +wordTop,
          size: +fontSize,
          color: rgb(nC[0] / 255, nC[1] / 255, nC[2] / 255),
        });
      }
    } else {
      if (value) {
        firstPage.drawText(value, {
          // x: +left,
          x: isCenter ? centerX : +left,
          y: height - +top,
          size: +fontSize,
          color: rgb(nC[0] / 255, nC[1] / 255, nC[2] / 255),
        });
      }
    }
  });
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export const calculateRows = (text) => {
  return Math.max(text?.split("\n")?.length, 3);
};

export const convertCurrency = (amount, exchangeRate, isNational) => {
  let convertedAmount = "";
  if (isNational) {
    convertedAmount = amount * exchangeRate; // Convert from USD to INR
    return formatCurrency(convertedAmount, "en-IN", "INR");
  } else {
    convertedAmount = amount / exchangeRate; // Convert from INR to USD
    return formatCurrency(convertedAmount, "en-US", "USD");
  }
};

export const formatCurrency = (number, locale, currency) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  return formatter.format(number);
};

export const USDtoINR = (amount, exchangeRate) => {
  let price = "";
  if (amount) {
    price = amount * exchangeRate;
    return price;
  }
};
export const INRtoUSD = (amount, exchangeRate) => {
  let price = "";
  if (amount) {
    price = amount / exchangeRate;
    return price;
  }
};
export const dashConvertedString = (str) => {
  return str
    ?.replace(/ *\([^)]*\) *|\.$/g, "") // Remove bracketed parts and trailing dots
    ?.trim()
    ?.toLowerCase()
    .replace(/\s+/g, "-");
};
