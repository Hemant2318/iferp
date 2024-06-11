import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import ExportButton from "components/Layout/ExportButton";
import { editSponsors, fetchSponsorsDetail } from "store/slices";
import { formatDate, objectToFormData } from "utils/helpers";
import SponsorsForm from "./SponsorsForm";

const SponsorsDetails = ({ id, setSponsorId }) => {
  const dispatch = useDispatch();

  const [editData, setEditData] = useState(null);
  const [statusLoader, setStatusLoader] = useState("");
  const [sponsorsData, setSponsorsData] = useState({});
  const getProfiles = async () => {
    let forData = objectToFormData({ id: id });
    const response = await dispatch(fetchSponsorsDetail(forData));
    let data = {};
    if (response?.data) {
      data = response.data;
    }
    setSponsorsData(data);
  };
  const handelSave = async (type) => {
    setStatusLoader(type);
    let forData = objectToFormData({
      status: type,
      id: id,
    });
    const response = await dispatch(editSponsors(forData));
    if (response?.status === 200) {
      getProfiles();
    }
    setStatusLoader("");
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    status,
    organization_name,
    email_id,
    contact_number,
    country_name,
    state_name,
    event_name,
    address,
    name_of_head,
    designation_of_head,
    name_of_contact_person,
    designation_of_contact_person,
    event_start_date,
  } = sponsorsData;
  const testData = [
    {
      title: "",
      data: [
        {
          key: "Organization name",
          value: organization_name,
        },
        {
          key: "Email ID",
          value: email_id,
        },
        {
          key: "Contact Number",
          value: contact_number,
        },
        {
          key: "Country",
          value: country_name,
        },
        {
          key: "State/Province",
          value: state_name,
        },
        {
          key: "Event Name",
          value: event_name,
        },
        {
          key: "Venue",
          value: address,
        },
        {
          key: "Date",
          value: formatDate(event_start_date),
        },
      ],
    },
    {
      title: "Head of the Organization Details (CEO/MD/CMD/Director etc)",
      data: [
        {
          key: "Name of the head",
          value: name_of_head,
        },
        {
          key: "Designation",
          value: designation_of_head,
        },
        {
          key: "Name of the Contact Person",
          value: name_of_contact_person,
        },
        {
          key: "Designation",
          value: designation_of_contact_person,
        },
        {
          key: "Email",
          value: email_id,
        },
      ],
    },
  ];
  return (
    <div id="career-management-container">
      {editData && (
        <SponsorsForm
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getProfiles();
          }}
          editData={editData}
        />
      )}
      <Card className="cps-30 cpe-30 cpb-30 cpt-20">
        <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12">
          <div className="d-flex align-items-center">
            <span
              className="d-flex"
              onClick={() => {
                setSponsorId("");
              }}
            >
              <img
                src={icons.leftArrow}
                alt="back"
                className="h-21 me-3 pointer"
              />
            </span>
            <span className="text-18-500 color-black-olive">
              {organization_name}
            </span>
          </div>
          <div className="d-flex gap-3">
            {status !== "0" && (
              <Button
                isSquare
                text="Edit"
                btnStyle="light-outline"
                className="pe-3 ps-3 h-35 text-13-400"
                icon={<i className="bi bi-pencil pe-2" />}
                onClick={() => {
                  setEditData({
                    id: id,
                    ...sponsorsData,
                  });
                }}
              />
            )}
            <ExportButton
              exportAPI={fetchSponsorsDetail}
              payload={objectToFormData({ id: id, export_status: "1" })}
            />
          </div>
        </div>
        <div>
          {testData.map((elem, index) => {
            return (
              <div key={index}>
                {elem.title && (
                  <div className="text-18-500 color-new-car cmb-16">
                    {elem.title}
                  </div>
                )}
                {elem.data.map((childElem, childIndex) => {
                  return (
                    <div className="row cmb-16" key={childIndex}>
                      <div className="col-md-3 text-16-400 color-black-olive">
                        {childElem.key}
                      </div>
                      <div className="col-md-9 text-16-500 color-black-olive">
                        {childElem.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {status === "0" && (
          <div className="d-flex gap-4 cmt-40">
            <Button
              isRounded
              text="Accept"
              btnStyle="primary-dark"
              className="cps-40 cpe-40"
              onClick={() => {
                handelSave("1");
              }}
              btnLoading={statusLoader === "1"}
            />
            <Button
              isRounded
              text="Reject"
              btnStyle="primary-gray"
              className="cps-40 cpe-40"
              onClick={() => {
                handelSave("2");
              }}
              btnLoading={statusLoader === "2"}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
export default SponsorsDetails;
