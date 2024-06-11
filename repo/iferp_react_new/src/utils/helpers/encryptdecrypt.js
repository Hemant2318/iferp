import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = CryptoJS.enc.Utf8.parse(
  process.env.REACT_APP_ENCRYPTION_KEY
);
const ENCRYPTION_IV = CryptoJS.enc.Utf8.parse(
  process.env.REACT_APP_ENCRYPTION_IV
);

export const encrypt = (data) => {
  const phrase = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(phrase, ENCRYPTION_KEY, {
    iv: ENCRYPTION_IV,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  const returnData = encrypted.toString();
  return returnData;
};

export const decrypt = (encryptedData) => {
  let returnData = {};
  try {
    var plaintextData = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY, {
      iv: ENCRYPTION_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryped = plaintextData.toString(CryptoJS.enc.Utf8);

    if (decryped) {
      returnData = JSON.parse(decryped);
    }
  } catch (error) {
    console.log("CATCH", encryptedData);
  }
  return returnData;
};

export function convertEncryptResponse(data) {
  let returnResponse = {};
  if (data) {
    returnResponse = data;
  }
  return { data: encrypt(returnResponse) };
}
