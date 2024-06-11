import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import { icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
} from "utils/helpers";
import { deleteCareer, fetchAllCareer, setApiError } from "store/slices";
import "../CareerManagement.scss";

const CareerSupport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [careerId, setCareerId] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    description: "",
    career_category: "",
    member_category: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    user_id: getDataFromLocalStorage("id"),
  });
  const getCareer = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllCareer(forData));
    setTableList(response?.data?.career_details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getCareer(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getCareer(newData);
  };
  const getMemberName = (id) => {
    let returnValue = "";
    const findObj = membershipList.find((o) => o.id === id);
    if (findObj) {
      returnValue = findObj.name;
    }
    return returnValue;
  };
  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      getCareer({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "career_category",
      title: "Career Category",
    },
    {
      isSearch: true,
      searchInputName: "description",
      title: "Career Description",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "id", value: "name" },
      searchInputName: "member_category",
      title: "Member Category",
    },
    {
      isSearch: false,
      searchLable: "View/Edit/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.career_category,
      },
      {
        value: elem.description,
      },
      {
        value: (
          <>
            {elem?.member_category.split(",").map((category, categoryIndex) => {
              return (
                <div key={categoryIndex} className="text-nowrap">
                  {getMemberName(category)}
                </div>
              );
            })}
          </>
        ),
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              onClick={() => {
                const userType = getUserType();
                if (elem?.career_id === 6) {
                  localStorage.prevRoute = window.location.pathname;
                  navigate(
                    `/${userType}/career-management/${elem.career_id}/keynote-speaker`
                  );
                } else if ([1, 3, 4].includes(elem?.type)) {
                  navigate(
                    `/${userType}/career-management/${elem.career_id}/events`
                  );
                } else {
                  navigate(
                    `/${userType}/career-management/${elem.career_id}/events/members`
                  );
                }
              }}
              text="View"
              btnStyle="primary-light"
              className="text-14-500 mw-70 me-2"
              isSquare
            />
            <Button
              isSquare
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                const userType = getUserType();
                navigate(
                  `/${userType}/career-management/career-support/${elem.career_id}`
                );
              }}
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                if (elem?.type) {
                  dispatch(
                    setApiError({
                      show: true,
                      message: "This career cannot be deleted",
                      type: "danger",
                    })
                  );
                } else {
                  setCareerId(elem.career_id);
                }
              }}
              isSquare
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="career-management-container">
      {careerId && (
        <DeletePopup
          id={careerId}
          onHide={() => {
            setCareerId(null);
          }}
          handelSuccess={() => {
            setCareerId(null);
            getCareer({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: careerId });
            const response = await dispatch(deleteCareer(forData));
            return response;
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
          <div className="table-title">
            Career Management ({filterData?.total})
          </div>

          <Button
            onClick={() => {
              const userType = getUserType();
              navigate(
                `/${userType}/career-management/career-support/add-career`
              );
            }}
            text="+ Add New Career"
            btnStyle="primary-outline"
            className="h-35 text-14-500"
            isSquare
          />
        </div>
        <Table
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          filterData={filterData}
          searchPayload={searchPayload}
          searchInputChange={handelChangeSearch}
          changeOffset={handelChangePagination}
        />
      </Card>
    </div>
  );
};
export default CareerSupport;
