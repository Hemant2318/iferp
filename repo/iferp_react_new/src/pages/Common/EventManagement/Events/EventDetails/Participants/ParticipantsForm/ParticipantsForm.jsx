import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cloneDeep, omit } from "lodash";
import Modal from "components/Layout/Modal";
import Dropdown from "components/form/Dropdown";
import Button from "components/form/Button/Button";
import Loader from "components/Layout/Loader";
import { limit } from "utils/constants";
import { objectToFormData } from "utils/helpers";
import {
  addEventParticipants,
  editEventParticipants,
  fetchAllProfiles,
  throwError,
} from "store/slices";
import "./ParticipantsForm.scss";

const ParticipantsForm = ({ onHide, getParticipants, oldData }) => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const params = useParams();
  const [timer, setTimer] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [data, setData] = useState({
    name: "",
    user_id: "",
    email_id: "",
    join_as: oldData?.join_as || "",
  });
  const [userList, setUserList] = useState({
    list: [],
    name: "",
    total: 0,
    offset: 0,
    limit: limit,
    isLoading: true,
  });
  const handleEdit = async () => {
    setBtnLoading(true);
    const payload = {
      id: oldData.id,
      join_as: data.join_as,
    };
    const response = await dispatch(
      editEventParticipants(objectToFormData(payload))
    );
    if (response?.status === 200) {
      getParticipants();
      onHide();
    }
    setBtnLoading(false);
  };
  const handleSave = async () => {
    setBtnLoading(true);
    const payload = {
      event_id: params?.eventId,
      participants_details: JSON.stringify(selectedList),
    };
    const response = await dispatch(
      addEventParticipants(objectToFormData(payload))
    );
    if (response?.status === 200) {
      getParticipants();
      onHide();
    }
    setBtnLoading(false);
  };
  const handleAdd = () => {
    let alreadyExist = selectedList.some((o) => o.email_id === data.email_id);
    if (alreadyExist) {
      dispatch(
        throwError({ message: "This user email already exist in list." })
      );
    } else {
      setSelectedList((prev) => {
        return [...prev, data];
      });
      setData({
        name: "",
        user_id: "",
        email_id: "",
        join_as: "",
      });
      setUserList((prev) => {
        return { ...prev, name: "" };
      });
      fetchUserList({ ...userList, name: "" }, true);
    }
  };
  const handleOptionClick = (e, isCreate = false) => {
    let object = {
      name: "",
      user_id: "",
      email_id: "",
    };
    if (isCreate) {
      const isValidEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(e);
      if (isValidEmail) {
        object.email_id = e;
      } else {
        dispatch(
          throwError({
            message: "Please enter valid email",
          })
        );
      }
    } else {
      object = {
        name: `${e?.firstName} ${e?.lastName}`,
        user_id: e.id,
        email_id: e.email,
      };
    }
    setData((prev) => {
      return { ...prev, ...object };
    });
    setUserList((prev) => {
      return { ...prev, name: "" };
    });
    setisOpen(false);
  };
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...userList,
        offset: userList.offset + 20,
        isLoading: true,
      });
      setUserList(oldData);
      fetchUserList(oldData);
    }
  };
  const handleSearch = (e) => {
    let value = e.target.value;
    setUserList((prev) => {
      return { ...prev, name: value, isLoading: true };
    });
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...userList,
        offset: 0,
        name: value.toLowerCase(),
      });
      setUserList(oldData);
      fetchUserList(oldData, true);
    }, 800);
    setTimer(time);
  };
  const fetchUserList = async (obj, isReset) => {
    let payload = objectToFormData(
      omit({ ...obj, email: obj?.name || "" }, [
        "name",
        "list",
        "total",
        "offset",
        "limit",
        "isLoading",
      ])
    );
    const response = await dispatch(fetchAllProfiles(payload));
    setUserList((prev) => {
      let resData = response?.data?.users || [];
      let listData = isReset ? resData : [...prev.list, ...resData];
      return {
        ...prev,
        list: listData,
        total: response?.data?.result_count || 0,
        isLoading: false,
      };
    });
  };
  const handleClickOutside = (e) => {
    if (
      myRef.current &&
      !myRef.current.contains(e.target) &&
      e?.target?.id !== "user-creatable"
    ) {
      setisOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  useEffect(() => {
    fetchUserList(userList, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { list, isLoading, total, name } = userList;
  return (
    <Modal title={`${oldData ? "Edit" : "Add"} Participants`} onHide={onHide}>
      {oldData ? (
        <div className="mt-4 ps-2 pe-2" id="participants-form-container">
          <div className="custom-input-container mb-3">
            <input
              id="user-creatable"
              type="text"
              value={oldData?.name || oldData?.email_id}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="mb-3">
            <Dropdown
              placeholder="Join As"
              value={data.join_as}
              options={[
                {
                  id: "presenter",
                  label: "Presenter",
                },
                {
                  id: "listener",
                  label: "Listener",
                },
              ]}
              onChange={(e) => {
                setData((prev) => {
                  return { ...prev, join_as: e.target.value };
                });
              }}
            />
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Button
              disabled={oldData.join_as === data.join_as}
              btnStyle="primary-dark"
              className="ps-5 pe-5"
              onClick={handleEdit}
              btnLoading={btnLoading}
              text="SAVE"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 ps-2 pe-2 row" id="participants-form-container">
            <div className="col-md-6 mb-3">
              <div className="custom-input-container">
                <input
                  id="user-creatable"
                  type="text"
                  value={name}
                  placeholder={
                    data.name || data.email_id || "Select or invite user"
                  }
                  onChange={handleSearch}
                  className={
                    name || data.email_id || data.name ? "input-has-value" : ""
                  }
                  onClick={() => {
                    setisOpen(true);
                  }}
                />

                <div className="icon-block">
                  {isLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <i className="bi bi-chevron-down" />
                  )}
                </div>
                {isOpen && (
                  <div
                    className="input-options box-shadow iferp-scroll"
                    ref={myRef}
                    onScroll={(e) => {
                      if (list.length < total) {
                        handleScroll(e);
                      }
                    }}
                  >
                    {list.length === 0 ? (
                      name ? (
                        <div
                          className="ps-3 pe-2 pt-3 pb-3 bg-create"
                          onClick={() => {
                            handleOptionClick(name, true);
                          }}
                        >
                          {`Create ${name}`}
                        </div>
                      ) : (
                        <div className="pt-3 pb-3 center-flex">
                          No Data Found
                        </div>
                      )
                    ) : (
                      list?.map((elm, index) => {
                        return (
                          <div
                            key={index}
                            className="ps-3 pe-2 pt-2 pb-2 border-bottom"
                            onClick={() => {
                              handleOptionClick(elm);
                            }}
                          >
                            {`${elm?.firstName} ${elm?.lastName}`}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <Dropdown
                placeholder="Join As"
                value={data.join_as}
                options={[
                  {
                    id: "presenter",
                    label: "Presenter",
                  },
                  {
                    id: "listener",
                    label: "Listener",
                  },
                ]}
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, join_as: e.target.value };
                  });
                }}
              />
            </div>
            <div className="col-md-2 mb-2">
              <div className="d-flex justify-content-end">
                <Button
                  disabled={!data.email_id || !data.join_as}
                  rightIcon={<i className="bi bi-plus-circle ms-2" />}
                  btnStyle="primary-dark"
                  className="ps-3 pe-3 h-45"
                  onClick={handleAdd}
                  text="Add"
                />
              </div>
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap ps-2 pe-2">
            {selectedList.map((elm, index) => {
              return (
                <span
                  key={index}
                  className="d-flex align-items-center gap-1 border p-1 ps-2 pe-2"
                >
                  <span className="text-14-500">
                    {elm.name || elm.email_id}
                  </span>
                  <span className="ms-2">
                    <i
                      className="bi bi-trash-fill text-danger pointer"
                      onClick={() => {
                        setSelectedList((prev) => {
                          return prev.filter((_, pIndex) => pIndex !== index);
                        });
                      }}
                    />
                  </span>
                </span>
              );
            })}
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Button
              disabled={selectedList.length === 0}
              btnStyle="primary-dark"
              className="ps-5 pe-5"
              onClick={handleSave}
              btnLoading={btnLoading}
              text="SAVE"
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default ParticipantsForm;
