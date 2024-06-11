import axios from "axios";
import { getHeaderData } from "utils/helpers";
const baseURL = import.meta.env.VITE_API_URL;
export const api = {
  header: () => {
    const header = getHeaderData();
    return header;
  },
  get: (url, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .get(baseURL + url, {
          headers,
        })
        .then((res) => {
          if (res.status === 200) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  delete: (url, data, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .delete(baseURL + url, {
          headers,
          data,
        })
        .then((res) => {
          if (res.status === 200) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  patch: (url, data, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .patch(baseURL + url, data, {
          headers,
        })
        .then((res) => {
          if (res.status === 200) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  post: (url, data, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .post(baseURL + url, data, {
          headers,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  put: (url, data, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .put(baseURL + url, data, {
          headers,
        })
        .then((res) => {
          if (res.status === 200) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
