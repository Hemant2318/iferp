import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import UploadCertificate from "components/form/UploadCertificate";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";
import DeletePopup from "components/Layout/DeletePopup";
import { icons, limit } from "utils/constants";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import {
  editMembershipCertificate,
  exportProfile,
  fetchAllProfiles,
} from "store/slices";
import { useNavigate } from "react-router-dom";

const MembershipCertificates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [docId, setDocId] = useState(null);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    email: "",
    phoneno: "",
    valid_date: "",
    membership_id_or_type: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_ids: "",
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllProfiles(forData));
    setTableList(response?.data?.users || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_ids: val, offset: 0 };
    setFilterData(newData);
    getProfiles(newData);
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
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      getProfiles({ ...filterData, ...searchPayload });
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
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "membership_id_or_type",
      title: (
        <>
          <div>{"Membership ID"}</div>
          <div>{"& Type"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "email",
      title: "Email ID",
    },
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];

  const rowData = [];
  tableList.forEach((elem, index) => {
    let obj = [
      {
        value: `${elem.firstName} ${elem.lastName}`,
      },
      {
        value: (
          <span>
            {elem?.memberId && <div>{elem.memberId}</div>}
            <div>{elem.memberType}</div>
          </span>
        ),
      },
      {
        value: elem.email,
      },

      {
        value:
          elem?.certificates.length === 0 ? (
            <Button
              onClick={() => {
                setDocId({ user_id: elem.id });
              }}
              btnStyle="primary-light"
              icon={
                <img
                  src={icons.imageUpload}
                  alt="edit"
                  className="h-21 me-2 primary-image"
                />
              }
              className="me-2 text-14-500"
              text="Upload"
              isSquare
            />
          ) : (
            <span className="action-icon-buttons">
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                onClick={() => {
                  setDocId({
                    user_id: elem.id,
                    oldData: elem.certificates,
                  });
                }}
                className="me-2"
                isSquare
              />
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.deleteIcon} alt="delete" />}
                onClick={() => {
                  setId({ event_id: elem.eventId, user_id: elem.id });
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
      {id && (
        <DeletePopup
          title="Delete Certificate"
          message="Are you sure you want to delete the certificate from this record?"
          onHide={() => {
            setId(null);
          }}
          handelSuccess={() => {
            setId(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({
              ...id,
              certificate: JSON.stringify([]),
            });
            const response = await dispatch(editMembershipCertificate(forData));
            return response;
          }}
        />
      )}
      {docId && (
        <UploadCertificate
          oldData={docId.oldData || []}
          onHide={() => {
            setDocId(null);
          }}
          handelSuccess={() => {
            setDocId(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          onSave={async (certificateList) => {
            let forData = objectToFormData({
              ...docId,
              certificate: JSON.stringify(certificateList),
            });
            const response = await dispatch(editMembershipCertificate(forData));
            return response;
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">All Members ({filterData?.total})</div>
          <div className="d-flex">
            <ExportButton
              exportAPI={exportProfile}
              payload={objectToFormData({ type: 2 })}
            />
            <div className="d-flex ms-3">
              <FilterDropdown
                list={membershipList}
                handelChangeFilter={handelChangeFilter}
              />
            </div>
          </div>
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
export default MembershipCertificates;
