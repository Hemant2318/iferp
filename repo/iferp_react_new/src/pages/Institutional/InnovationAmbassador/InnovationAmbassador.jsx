import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { omit } from "lodash";
import Button from "components/form/Button";
import ExportButton from "components/Layout/ExportButton";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import { downloadFile, generatePreSignedUrl } from "utils/helpers";
import { limit, institutionalRoute, certificatePath } from "utils/constants";
import { getInstitutionalAmbassador } from "store/slices";
import AmbassadorForm from "./AmbassadorForm";

const InnovationAmbassador = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { type } = params;
  const [isAdd, setIsAdd] = useState(false);
  const statusType = {
    "student-ambassadors": 0,
    "faculty-ambassadors": 1,
  };
  const status = statusType[params?.type];
  const [tableList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });

  const redirect = (optionType) => {
    navigate(`${institutionalRoute.innovationAmbassador}/${optionType}`);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchInstitutionalAmbassador(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchInstitutionalAmbassador(newData);
  };
  const fetchInstitutionalAmbassador = async (obj) => {
    let queryParams = new URLSearchParams(
      omit(
        {
          ...obj,
          type: status,
        },
        ["total"]
      )
    ).toString();
    const response = await dispatch(getInstitutionalAmbassador(queryParams));
    setTableList(response?.data?.ambassador_details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    setIsLoading(true);
    fetchInstitutionalAmbassador({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Name",
    },
    {
      isSearch: true,
      searchInputName: "membership_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "department",
      title: "Department",
    },
    {
      isSearch: true,
      searchInputName: "title",
      title: "Email Address",
    },
    {
      isSearch: false,
      searchLable: "Ambassador Certificates",
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
        value: elem.department,
      },
      {
        value: elem.email_id,
      },
      {
        value: (
          <div className="center-flex">
            {elem.certificates.length > 0 && (
              <Button
                btnStyle="primary-outline"
                text="Download"
                className="h-35 text-14-500"
                onClick={async () => {
                  let result = await generatePreSignedUrl(
                    elem.certificates[0].certificate,
                    certificatePath
                  );
                  dispatch(downloadFile(result));
                }}
                isSquare
              />
            )}
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  const activeClass = "p-2 color-new-car text-16-500 primary-underline";
  const inActiveClass = "p-2 color-black-olive text-16-500 pointer";
  return (
    <Card className="cpt-30 cpb-20 cps-34 cpe-34">
      {isAdd && (
        <AmbassadorForm
          type={status}
          onHide={() => {
            setIsAdd(false);
          }}
          handelSuccess={() => {
            setIsAdd(false);
            fetchInstitutionalAmbassador({ ...filterData, ...searchPayload });
          }}
        />
      )}
      <div className="d-flex justify-content-between flex-sm-row flex-column">
        <div className="d-flex align-items-center mb-4 gap-sm-4 gap-2">
          <div
            className={
              type === "student-ambassadors" ? activeClass : inActiveClass
            }
            onClick={() => {
              if (type !== "student-ambassadors") {
                redirect("student-ambassadors");
              }
            }}
          >
            <span>Student Ambassadors</span>
          </div>
          <div
            className={
              type === "faculty-ambassadors" ? activeClass : inActiveClass
            }
            onClick={() => {
              if (type !== "faculty-ambassadors") {
                redirect("faculty-ambassadors");
              }
            }}
          >
            <span>Faculty Ambassadors</span>
          </div>
        </div>
        <div className="d-flex gap-3 mb-sm-0 mb-3">
          <ExportButton
            exportAPI={getInstitutionalAmbassador}
            payload={`export_status=1&&type=${status}`}
          />
          <Button
            isSquare
            text="+ Add Ambassador"
            btnStyle="primary-outline"
            className="h-35 text-13-500"
            onClick={() => {
              setIsAdd(true);
            }}
          />
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
  );
};
export default InnovationAmbassador;
