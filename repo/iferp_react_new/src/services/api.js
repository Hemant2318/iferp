import axios from "axios";
import { getHeaderData, getDataFromLocalStorage } from "utils/helpers";

export const api = {
  header: () => {
    const header = getHeaderData();
    return header;
  },
  nodeHeader: () => {
    const header = {
      Authorization: `Bearer ${getDataFromLocalStorage("jwt_token") || ""}`,
    };
    return header;
  },

  get: (url, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .get(process.env.REACT_APP_API_URL + url, {
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
        .delete(process.env.REACT_APP_API_URL + url, {
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
        .patch(process.env.REACT_APP_API_URL + url, data, {
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
        .post(process.env.REACT_APP_API_URL + url, data, {
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
        .put(process.env.REACT_APP_API_URL + url, data, {
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

  node_get: (url, header = {}) => {
    let headers = api.nodeHeader();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .get(process.env.REACT_APP_NODE_API_URL + url, {
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

  node_post: (url, data, header = {}) => {
    let headers = api.nodeHeader();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .post(process.env.REACT_APP_NODE_API_URL + url, data, {
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
};
