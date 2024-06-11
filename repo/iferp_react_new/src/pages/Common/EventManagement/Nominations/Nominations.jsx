import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import DeletePopup from "components/Layout/DeletePopup";
import { limit, icons } from "utils/constants";
import { getStatus, objectToFormData } from "utils/helpers";
import {
  deleteNominations,
  EditNominations,
  getNominations,
} from "store/slices";
import NominationsForm from "./NominationsForm";

const Nominations = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState("");
  const [userid, setUserid] = useState(null);
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    status: "",
    member_id: "",
    event_name: "",
    organization_name: "",
    nomination_category: "",
    nominee_name_member_id: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(getNominations(forData));
    setTableList(response?.data?.nomination_details || []);
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
    getProfiles(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getProfiles(newData);
  };
  useEffect(() => {
    getProfiles({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const header = [
    {
      isSearch: true,
      searchInputName: "organization_name",
      title: "Organization Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "nominee_name_member_id",
      title: "Nominee’s Name & Member ID",
    },
    {
      isSearch: true,
      searchInputName: "event_name",
      title: "Event Name",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [{ id: "Chief Guest" }, { id: "Speaker" }],
        key: "id",
        value: "id",
      },
      searchInputName: "nomination_category",
      title: "Nomination Category",
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
        value: elem.organization_name,
      },
      {
        value: elem.member_id,
      },
      {
        value: `${elem.nominees_name} - ${elem.nominees_member_id}`,
      },
      {
        value: elem.event_name,
      },
      {
        value: elem.nomination_category,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value:
          elem.status === "0" ? (
            <span className="action-icon-buttons">
              <Button
                onClick={async () => {
                  setBtnLoading(elem.id);
                  let forData = objectToFormData({
                    status: "1",
                    id: elem.id,
                  });
                  const response = await dispatch(EditNominations(forData));
                  if (response?.status === 200) {
                    getProfiles({ ...filterData, ...searchPayload });
                  }
                  setBtnLoading("");
                }}
                text={elem.id === btnLoading ? "" : "Accept"}
                btnStyle="primary-light"
                className="text-14-500 mw-70 me-2"
                btnLoading={elem.id === btnLoading}
                isSquare
              />
            </span>
          ) : (
            <span className="action-icon-buttons">
              <Button
                isSquare
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                className="me-2"
                onClick={() => {
                  setEditData(elem);
                }}
              />
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.deleteIcon} alt="delete" />}
                onClick={() => {
                  setUserid(elem.id);
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
      {userid && (
        <DeletePopup
          id={userid}
          onHide={() => {
            setUserid(null);
          }}
          handelSuccess={() => {
            setUserid(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            const response = await dispatch(deleteNominations(userid));
            return response;
          }}
        />
      )}
      {editData && (
        <NominationsForm
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          editData={editData}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20 cpt-20">
        <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12 flex-wrap gap-2">
          <div className="table-title">
            {"Nominations for Speaker & Chief Guest"}
          </div>
          <ExportButton
            exportAPI={getNominations}
            payload={objectToFormData({ export_status: "1" })}
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
export default Nominations;
