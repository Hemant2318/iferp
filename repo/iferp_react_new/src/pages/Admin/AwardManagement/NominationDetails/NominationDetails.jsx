import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isEqual } from "lodash";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import DeletePopup from "components/Layout/DeletePopup";
import Loader from "components/Layout/Loader";
import { icons, limit } from "utils/constants";
import {
  getDataFromLocalStorage,
  getStatus,
  objectToFormData,
} from "utils/helpers";
import {
  deleteNomination,
  editNomination,
  exportNomination,
  fetchNomination,
} from "store/slices";
import NominationDetailsForm from "./NominationDetailsForm";
import { useNavigate } from "react-router-dom";

const NominationDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tableLoader, setTableLoader] = useState(true);
  const [deleteId, setDeleteId] = useState(false);
  const [editLoader, setEditLoader] = useState(null);
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    status: "",
    member_id: "",
    award_category: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getNominations = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchNomination(forData));
    setTableList(response?.data?.awardWinners || {});
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
    getNominations(newData);
  };
  const handelChangePagination = (offset) => {
    setTableLoader(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getNominations(newData);
  };
  const handelAccept = (id) => {
    setEditLoader(id);
    handelChangeStatus({ id: id, status: "1" });
  };
  const handelChangeStatus = async (data) => {
    const payload = objectToFormData(data);
    const response = await dispatch(editNomination(payload));
    if (response?.status === 200) {
      setEditData(null);
      setEditLoader(null);
      getNominations({ ...filterData, ...searchPayload });
      return response;
    } else {
      return response;
    }
  };
  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      getNominations({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: (
        <>
          <div>{"Nominator’s"}</div>
          <div>{"Name"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: (
        <>
          <div>{"Nominator’s"}</div>
          <div>{"Member ID"}</div>
        </>
      ),
    },
    // {
    //   isSearch: false,
    //   searchInputName: "name",
    //   title: (
    //     <>
    //       <div>{"Nominee’s"}</div>
    //       <div>{"Name"}</div>
    //     </>
    //   ),
    // },
    // {
    //   isSearch: false,
    //   searchInputName: "member_id",
    //   title: (
    //     <>
    //       <div>{"Nominee’s"}</div>
    //       <div>{"Member ID"}</div>
    //     </>
    //   ),
    // },
    {
      isSearch: true,
      searchInputName: "award_category",
      title: "Award Category",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [
          { id: "0", name: "Pending" },
          { id: "1", name: "Accepted" },
          { id: "2", name: "Rejected" },
        ],
        key: "id",
        value: "name",
      },
      searchInputName: "status",
      title: "Status",
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
        value: elem.nominationsName,
      },
      {
        value: elem.memberId,
      },
      // {
      //   value: elem.nominationsName,
      // },
      // {
      //   value: elem.memberId,
      // },
      {
        value: elem.awardType,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value: isEqual(elem.status, "0") ? (
          <Button
            text={isEqual(editLoader, elem.id) ? "" : "Accept"}
            icon={isEqual(editLoader, elem.id) ? <Loader /> : ""}
            btnStyle="primary-light"
            className="h-35 text-14-500"
            onClick={() => {
              handelAccept(elem.id);
            }}
            isSquare
          />
        ) : (
          <span className="action-icon-buttons">
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                setEditData(elem);
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
            getNominations({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: deleteId });
            const response = await dispatch(deleteNomination(forData));
            return response;
          }}
        />
      )}
      {editData && (
        <NominationDetailsForm
          editData={editData}
          onHide={() => {
            setEditData(null);
          }}
          handelChangeStatus={handelChangeStatus}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">Nomination Details</div>
          <div className="d-flex">
            <ExportButton exportAPI={exportNomination} />
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
export default NominationDetails;
