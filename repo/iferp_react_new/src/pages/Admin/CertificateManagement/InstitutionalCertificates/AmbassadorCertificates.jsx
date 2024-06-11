import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import UploadCertificate from "components/form/UploadCertificate";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import DeletePopup from "components/Layout/DeletePopup";
import FilterDropdown from "components/Layout/FilterDropdown";
import { objectToFormData } from "utils/helpers";
import { limit, icons } from "utils/constants";
import {
  editAmbasadorCertificate,
  exportAmbasadorCertificate,
  fetchAmbasadorMembers,
} from "store/slices";

const AmbassadorCertificates = () => {
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
    member_id: "",
    ambassador_type: "",
    institute_name: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_id: "",
  });
  const getAmbassadors = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAmbasadorMembers(forData));

    setTableList(response?.data?.details || []);
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
    getAmbassadors(newData);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getAmbassadors(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getAmbassadors(newData);
  };
  useEffect(() => {
    getAmbassadors({ ...filterData, ...searchPayload });
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
      searchInputName: "ambassador_type",
      title: "Ambassador Type",
    },
    {
      isSearch: true,
      searchInputName: "institute_name",
      title: "Institution Name",
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
        value: elem.name,
      },
      {
        value: elem.member_id,
      },
      {
        value: elem.ambassador_type === "0" ? "Student" : "Faculty",
      },
      {
        value: elem.institute_name,
      },
      {
        value:
          elem?.certificates.length === 0 ? (
            <Button
              onClick={() => {
                setDocId({ user_id: elem.user_id });
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
                    user_id: elem.user_id,
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
                  setId({ user_id: elem.user_id });
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
            getAmbassadors({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({
              ...id,
              certificate: JSON.stringify([]),
            });
            const response = await dispatch(editAmbasadorCertificate(forData));
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
            getAmbassadors({ ...filterData, ...searchPayload });
          }}
          onSave={async (certificateList) => {
            let forData = objectToFormData({
              user_id: docId?.user_id,
              certificate: JSON.stringify([...certificateList]),
            });
            const response = await dispatch(editAmbasadorCertificate(forData));
            return response;
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="text-18-400 color-black-olive">
            All Ambassadors ({filterData?.total})
          </div>
          <div className="d-flex">
            <ExportButton exportAPI={exportAmbasadorCertificate} />
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
export default AmbassadorCertificates;
