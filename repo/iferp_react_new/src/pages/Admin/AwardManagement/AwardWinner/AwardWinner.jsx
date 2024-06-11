import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import DeletePopup from "components/Layout/DeletePopup";
import { limit, icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
} from "utils/helpers";
import {
  deleteAwardWinners,
  exportAwardWinners,
  fetchAwardWinners,
} from "store/slices";

const AwardWinner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tableLoader, setTableLoader] = useState(true);
  const [deleteId, setDeleteId] = useState(false);
  const handleRedirect = (url) => {
    const userType = getUserType();
    navigate(`/${userType}/award-management/award-winners/${url}`);
  };

  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    member_id: "",
    award_type: "",
    event_name: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getAwardWinners = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAwardWinners(forData));
    setTableList(response?.data?.awardWinners || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setTableLoader(false);
  };
  const handelChangeSearch = (searchData) => {
    setTableLoader(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getAwardWinners(newData);
  };
  const handelChangePagination = (offset) => {
    setTableLoader(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getAwardWinners(newData);
  };

  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      getAwardWinners({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "award_type",
      title: "Award Type",
    },
    {
      isSearch: true,
      searchInputName: "event_name",
      title: "Event Name",
    },
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];

  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.winnersName,
      },
      {
        value: elem.memberId,
      },
      {
        value: elem.awardType,
      },
      {
        value: elem.eventName,
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                handleRedirect(elem.id);
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setDeleteId(elem.id);
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
    <div>
      {deleteId && (
        <DeletePopup
          id={deleteId}
          onHide={() => {
            setDeleteId(null);
          }}
          handelSuccess={() => {
            setDeleteId(null);
            getAwardWinners({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: deleteId });
            const response = await dispatch(deleteAwardWinners(forData));
            return response;
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
          <div className="table-title">Award Winners</div>
          <div className="d-flex gap-3">
            <ExportButton
              exportAPI={exportAwardWinners}
              payload={objectToFormData({
                ...filterData,
                ...searchPayload,
              })}
            />
            <Button
              onClick={() => {
                handleRedirect("add-award-winners");
              }}
              text="+ Add Award Winner"
              btnStyle="primary-outline"
              className="h-35 text-14-500"
              isSquare
            />
          </div>
        </div>
        <Table
          isLoading={tableLoader}
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
export default AwardWinner;
