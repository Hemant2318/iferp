import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, lowerCase, map, remove } from "lodash";
import SeachInput from "components/form/SeachInput";
import CheckBox from "components/form/CheckBox";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import ExportButton from "components/Layout/ExportButton";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import { institutionalRoute, limit, icons } from "utils/constants";
import { objectToFormData, titleCaseString } from "utils/helpers";
import {
  deleteInstitutionalMembers,
  getInstitutionalMembers,
  setDepartmentList,
} from "store/slices";
import MemberForm from "./MemberForm";
import DepartmentForm from "./DepartmentForm";

const OurAcademies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departmentList } = useSelector((state) => ({
    departmentList: state.global.departmentList,
  }));
  const params = useParams();
  const { type } = params;
  const mType = type.replace("-members", "");
  const [timer, setTimer] = useState("");
  const [isMember, setIsMember] = useState("");
  const [isAddDept, setIsAddDept] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [userid, setUserid] = useState(null);
  const [deptIDs, setDeptIDs] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [deptSearch, setDeptSearch] = useState("");
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    department_name: "",
    course_name: "",
    designation: "",
    year_of_study: "",
  });
  const [filterData, setFilterData] = useState({
    limit: limit,
    total: 0,
    offset: 0,
    multiple_departments: "",
  });
  const handelCheck = (id) => {
    let oldList = cloneDeep(deptIDs);
    if (id === "ALL") {
      if (oldList.length === departmentList.length) {
        oldList = [];
      } else {
        oldList = map(departmentList, "id");
      }
    } else if (id === "RESET") {
      oldList = [];
      setDeptSearch("");
    } else {
      if (oldList.includes(id)) {
        oldList = remove(oldList, (e) => e !== id);
      } else {
        oldList = [...oldList, id];
      }
    }
    setDeptIDs(oldList);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      setIsTableLoading(true);
      let newData = { ...filterData, ...searchPayload };
      newData = { ...newData, multiple_departments: oldList.toString() };
      setFilterData(newData);
      fetchMemberes(newData);
    }, 800);
    setTimer(time);
  };
  const fetchMemberes = async (obj) => {
    const response = await dispatch(
      getInstitutionalMembers(objectToFormData({ ...obj, type: mType }))
    );
    setTableList(response?.data?.members || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsTableLoading(false);
  };
  const handelChangeSearch = (searchData) => {
    setIsTableLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchMemberes(newData);
  };
  const handelChangePagination = (offset) => {
    setIsTableLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchMemberes(newData);
  };
  useEffect(() => {
    setSearchPayload({
      name: "",
      course_name: "",
      designation: "",
      year_of_study: "",
      department_name: "",
    });
    setFilterData({
      total: 0,
      offset: 0,
      limit: limit,
    });
    setIsTableLoading(true);
    setDeptIDs([]);
    setTimeout(() => {
      fetchMemberes({ ...filterData, ...searchPayload });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: mType === "student" ? "Name" : "Faculty Name",
    },
    {
      isSearch: true,
      searchInputName: "department_name",
      title: "Department",
    },
    {
      isSearch: true,
      searchInputName: mType === "student" ? "course_name" : "designation",
      title: mType === "student" ? "Course" : "Designation",
    },
    {
      isSearch: true,
      searchInputName: mType === "student" ? "member_id" : "year_of_study",
      title: mType === "student" ? "Member ID" : "Year of Study",
    },
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    const {
      first_name,
      last_name,
      department_name,
      course_name,
      member_id,
      year_of_study,
      designation,
    } = elem;
    let obj = [
      {
        value: `${first_name} ${last_name}`,
      },
      {
        value: department_name,
      },
      {
        value: mType === "student" ? course_name : designation,
      },
      {
        value: mType === "student" ? member_id : year_of_study,
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                setEditData(elem);
                setIsMember(true);
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setUserid(elem?.id);
              }}
              isSquare
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const isAnySearch = departmentList.some((o) =>
    lowerCase(o.name).includes(lowerCase(deptSearch))
  );
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
            fetchMemberes({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            return await dispatch(
              deleteInstitutionalMembers(
                objectToFormData({
                  id: userid,
                })
              )
            );
          }}
        />
      )}
      {isAddDept && (
        <DepartmentForm
          onHide={() => {
            setIsAddDept(false);
          }}
          handelSuccess={(data) => {
            dispatch(setDepartmentList([...departmentList, data]));
            setIsAddDept(false);
          }}
        />
      )}
      {isMember && (
        <MemberForm
          type={type}
          editData={editData}
          onHide={() => {
            setIsMember(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            fetchMemberes({ ...filterData, ...searchPayload });
            setIsMember(false);
            setEditData(null);
          }}
        />
      )}
      <div className="text-18-500 color-black-olive cmb-24 font-poppins">
        Our Academies
      </div>
      <Card className="d-flex align-items-center p-1 unset-br mb-3">
        <div
          className={type === "student-members" ? activeClass : inActiveClass}
          onClick={() => {
            navigate(`${institutionalRoute.ourAcademies}/student-members`);
          }}
        >
          Student Members
        </div>
        <div
          className={type === "faculty-members" ? activeClass : inActiveClass}
          onClick={() => {
            navigate(`${institutionalRoute.ourAcademies}/faculty-members`);
          }}
        >
          Faculty Members
        </div>
      </Card>
      <div className="row">
        <div className="col-md-9">
          <Card className="unset-br cps-14 cpe-14 cpt-24 cpb-10">
            <div className="d-flex justify-content-between align-items-center cmb-26">
              <div className="table-title">
                {titleCaseString(mType)} ({filterData?.total || 0})
              </div>
              <div className="d-flex gap-3">
                <ExportButton
                  exportAPI={getInstitutionalMembers}
                  payload={objectToFormData({ type: mType, export_status: 1 })}
                />
                <Button
                  onClick={() => {
                    setIsMember(true);
                  }}
                  text="+ Add Member"
                  btnStyle="primary-outline"
                  className="h-35 text-14-500"
                  isSquare
                />
              </div>
            </div>

            <Table
              header={header}
              rowData={rowData}
              isLoading={isTableLoading}
              filterData={filterData}
              searchPayload={searchPayload}
              searchInputChange={handelChangeSearch}
              changeOffset={handelChangePagination}
            />
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="unset-br cps-14 cpe-14 cpt-16 cpb-10">
            <div className="d-flex justify-content-between align-items-center flex-wrap cmb-12">
              <div className="text-14-500 color-title-navy font-poppins text-nowrap">
                Departments ({departmentList.length})
              </div>
              <div
                className="text-12-400 color-black-olive pointer text-nowrap"
                onClick={() => {
                  handelCheck("RESET");
                }}
              >
                <i className="bi bi-arrow-clockwise me-1" />
                Reset
              </div>
            </div>

            <SeachInput
              placeholder="Search"
              onChange={(e) => {
                setDeptSearch(e.target.value);
              }}
              value={deptSearch}
            />

            <div
              className={`iferp-scroll cmt-20 ms-1 ${
                isAnySearch ? "" : "d-none"
              }`}
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <div className="d-flex align-items-center cmb-18">
                <CheckBox
                  type="ACTIVE"
                  onClick={() => {
                    handelCheck("ALL");
                  }}
                  isChecked={deptIDs.length === departmentList.length}
                />
                <div className="text-13-500 color-black-olive cms-12">ALL</div>
              </div>
              {departmentList.map((elem, index) => {
                const isSearch = lowerCase(elem.name).includes(
                  lowerCase(deptSearch)
                );

                return (
                  <div
                    className={`d-flex align-items-center cmb-18 ${
                      isSearch ? "" : "d-none"
                    }`}
                    key={index}
                  >
                    <CheckBox
                      type="ACTIVE"
                      onClick={() => {
                        handelCheck(elem.id);
                      }}
                      isChecked={deptIDs.includes(elem.id)}
                    />
                    <div className="text-13-500 color-subtitle-navy cms-12">
                      {`${elem.name}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <div className="center-flex cmt-30">
            <Button
              onClick={() => {
                setIsAddDept(true);
              }}
              text="Add Department"
              btnStyle="primary-dark"
              className="cps-20 cpe-20"
              isRounded
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default OurAcademies;
