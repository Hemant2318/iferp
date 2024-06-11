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
import { objectToFormData } from "utils/helpers";
import {
  editInstitutionCertificate,
  exportInstitutionCertificate,
  fetchInstitutionMembers,
} from "store/slices";

const InstitutionCertificates = () => {
  const dispatch = useDispatch();
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
    membership_id: "",
    membership_type: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_id: "",
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchInstitutionMembers(forData));
    setTableList(response?.data?.registeredMembers || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_id: val, offset: 0 };
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
    getProfiles({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Institution Name",
    },
    {
      isSearch: true,
      searchInputName: "membership_id",
      title: "Membership ID",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "membership_type",
      title: "Membership Type",
    },
    {
      isSearch: true,
      searchInputName: "email",
      title: "Institution Email ID",
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
        value: elem.memberId,
      },
      {
        value: elem.memberType,
      },
      {
        value: elem.emailId,
      },

      {
        value:
          elem?.certificates.length === 0 ? (
            <Button
              onClick={() => {
                setDocId({ institution_id: elem.id });
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
                    institution_id: elem.id,
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
                  setId({ institution_id: elem.id });
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
    <div className="cmt-20">
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
            const response = await dispatch(
              editInstitutionCertificate(forData)
            );
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
            const response = await dispatch(
              editInstitutionCertificate(forData)
            );
            return response;
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">
            All Institutions ({filterData?.total})
          </div>
          <div className="d-flex">
            <ExportButton exportAPI={exportInstitutionCertificate} />
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
export default InstitutionCertificates;
