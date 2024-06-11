import { useEffect, useRef, useState } from "react";
import Label from "../Label";
import { cloneDeep, omit } from "lodash";
import { fetchEmailReciever } from "store/slices";
import { useDispatch } from "react-redux";
import Loader from "components/Layout/Loader";
import "./UserCreatable.scss";

const UserCreatable = ({
  label,
  isRequired,
  labelClass,
  placeholder,
  onChange,
  id,
  showOnSearch,
}) => {
  const myRef = useRef();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [option, setOption] = useState({
    list: [],
    name: "",
    total: 0,
    offset: 0,
    limit: 20,
    isLoading: true,
  });
  const handleClickOutside = (e) => {
    if (
      myRef.current &&
      !myRef.current.contains(e.target) &&
      e?.target?.id !== "user-creatable"
    ) {
      setisOpen(false);
    }
  };
  const fetchUsers = async (obj, isReset) => {
    let queryParams = new URLSearchParams(
      omit(obj, ["list", "total", "isLoading"])
    ).toString();
    const response = await dispatch(fetchEmailReciever(queryParams));

    const data = response?.data?.user_data || [];
    const count = response?.data?.result_count || 0;
    setOption((prev) => {
      let listData = isReset ? data : [...prev.list, ...data];
      return { ...prev, isLoading: false, total: count, list: listData };
    });
    // setCoAuthorList((prev) => {
    //   let selfObject = {
    //     id: id,
    //     email_id: email_id,
    //     member_id: member_id,
    //     name: `${first_name} ${last_name}`,
    //   };
    //   let resData = response?.data?.user_data || [];
    //   let listData = isReset
    //     ? [selfObject, ...resData]
    //     : [...prev.list, ...resData];
    //   return {
    //     ...prev,
    //     list: unionBy(listData, "id"),
    //     total: response?.data?.result_count || 0,
    //     isLoading: false,
    //   };
    // });
  };
  const handleSearch = (e) => {
    let value = e.target.value;
    setOption((prev) => {
      return { ...prev, name: value, isLoading: true };
    });
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...option,
        offset: 0,
        name: value,
      });
      setOption(oldData);
      fetchUsers(oldData, true);
    }, 800);
    setTimer(time);
  };
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...option,
        offset: option.offset + 20,
        isLoading: true,
      });
      setOption(oldData);
      fetchUsers(oldData);
    }
  };
  const handleOptionClick = (e, isCreate = false) => {
    onChange({
      target: {
        id: id,
        data: isCreate ? null : e,
        value: isCreate ? e : "",
        isCreate: isCreate,
      },
    });
    let oldData = cloneDeep({
      ...option,
      name: "",
      offset: 0,
    });
    setOption(oldData);
    fetchUsers(oldData);
    setisOpen(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    fetchUsers(option, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { list, isLoading, name, total } = option;
  const showSugetion = showOnSearch ? (name ? true : false) : isOpen;
  return (
    <div id="user-creatable-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div className="custom-input-container">
        <input
          id="user-creatable"
          type="text"
          value={name}
          placeholder={placeholder}
          onChange={handleSearch}
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
        {showSugetion && (
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
                <div className="pt-3 pb-3 center-flex">No Data Found</div>
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
                    {elm?.name}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCreatable;
