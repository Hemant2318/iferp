import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import { fetchAppliedCareer } from "store/slices";
import { objectToFormData } from "utils/helpers";
import { limit } from "utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import ExploreLayout from "components/Layout/ExploreLayout";

const AppliedCareerSupport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    career_name: "",
    activity_name: "",
    created_at: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAppliedCareer(forData));
    setTableList(response?.data?.career_details || []);
    // dispatch(setMySpeakerApplication(response?.data?.career_details || []));
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
  let oldTableList = [];
  const tempData = {
    id: "0",
    career_name: "Become A Keynote Speaker",
    activity_name: "",
    created_at: "",
  };
  oldTableList.push(tempData, ...tableList);

  const newTableList = oldTableList?.filter((o) => o?.career_id !== 6);

  const header = [
    {
      isSearch: true,
      searchInputName: "career_name",
      title: "Career Support Name",
    },
    {
      isSearch: true,
      searchInputName: "activity_name",
      title: "Activity Name",
    },
    {
      isSearch: true,
      searchInputName: "created_at",
      title: "Date of Submission",
    },
    {
      isSearch: false,
      searchLable: "View",
      title: "Action",
    },
  ];
  const rowData = [];

  newTableList?.forEach((elem) => {
    const { type, id, career_name } = elem;
    let obj = [
      {
        value: elem?.career_name,
      },
      {
        value: elem?.activity_name,
      },
      {
        value: elem?.created_at,
      },
      {
        value: (
          <div className="center-flex">
            {id && (
              <Button
                btnStyle="primary-outline"
                text="View"
                className="h-35 text-14-500 cps-20 cpe-20"
                onClick={() => {
                  if (career_name === "Become A Keynote Speaker") {
                    // navigate(
                    //   `/${memberType}/career-support/applied-career-support/video-record`
                    // );
                    navigate(
                      `/${memberType}/career-support/applied-career-support/keynote-speaker`
                    );
                  } else {
                    navigate(
                      `/${memberType}/career-support/applied-career-support/${type}/${id}`
                    );
                  }
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
  let exploreURL = `/${memberType}/career-support/careers`;
  return (
    <>
      {newTableList.length === 0 ? (
        <Card className="cps-20 cpe-20 cpb-20">
          <ExploreLayout
            redirect={exploreURL}
            info="Whoops...You haven’t enrolled in any Career Support Categories"
          />
        </Card>
      ) : (
        <Card className="cps-20 cpe-20 cpb-20">
          <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
            <div className="text-18-500 color-title-navy font-poppins">
              Applied Career Support ({filterData.total})
            </div>
            {newTableList.length > 0 && (
              <div className="d-flex">
                <ExportButton
                  exportAPI={fetchAppliedCareer}
                  payload={objectToFormData({ export_status: 1 })}
                />
              </div>
            )}
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
      )}
    </>
  );
};
export default AppliedCareerSupport;
