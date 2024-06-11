import Card from "components/Layout/Card";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import { omit } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteNewsLetter,
  exportNewsLetter,
  fetchNewsLetter,
} from "store/slices";
import { icons, limit } from "utils/constants";
import { objectToFormData } from "utils/helpers";
import NewsLetterUpdatePopup from "./NewsLetterUpdatePopup";

const NewsLetter = () => {
  const dispatch = useDispatch();
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [newsLetterId, setNewsLetterId] = useState(null);

  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });

  const getNewsLetter = async (obj) => {
    const payload = omit(obj, ["total"]);
    let forData = objectToFormData(payload);
    const response = await dispatch(fetchNewsLetter(forData));
    setTableList(response?.data?.subscribeUserData || []);
    setFilterData({
      ...obj,
      total: response?.data?.totalSubscribeUserData || 0,
    });
    setIsLoading(false);
  };

  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getNewsLetter(newData);
  };

  useEffect(() => {
    getNewsLetter({ ...filterData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      title: "Sr.No",
    },
    {
      title: "Date",
    },
    {
      title: "Email ID",
    },
    {
      title: "Verified",
    },
    {
      title: "Unverified",
    },
    {
      title: "Source",
    },

    {
      title: "Edit/Delete",
    },
  ];

  const rowData = [];
  tableList?.forEach((elem, index) => {
    let obj = [
      {
        value: index + 1,
      },
      {
        value: (
          <div className="text-nowrap">
            {moment(elem?.created_at).format("DD.MM.YYYY hh:mm A")}
          </div>
        ),
      },
      {
        value: <div className="text-nowrap">{elem?.email}</div>,
      },
      {
        value: (
          <div className="text-nowrap">
            {elem?.is_verified === 0 ? "Yes" : "-"}
          </div>
        ),
      },
      {
        value: (
          <div className="text-nowrap">
            {elem?.is_verified === 1 ? "Yes" : "-"}
          </div>
        ),
      },
      {
        value: (
          <div className="text-nowrap">{elem?.source ? elem?.source : "-"}</div>
        ),
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
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setNewsLetterId(elem?.id);
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
    <div id="new-letter-component">
      {newsLetterId && (
        <DeletePopup
          id={newsLetterId}
          onHide={() => {
            setNewsLetterId(null);
          }}
          handelSuccess={() => {
            setNewsLetterId(null);
            getNewsLetter({ ...filterData });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: newsLetterId });
            const response = await dispatch(deleteNewsLetter(forData));
            return response;
          }}
        />
      )}
      {editData && (
        <NewsLetterUpdatePopup
          editData={editData}
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getNewsLetter({ ...filterData });
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
          <div className="table-title">Newsletters ({filterData?.total})</div>
          <div className="d-flex gap-3">
            <ExportButton
              exportAPI={exportNewsLetter}
              payload={objectToFormData({
                ...filterData,
              })}
            />
          </div>
        </div>
        <Table
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          filterData={filterData}
          changeOffset={handelChangePagination}
        />
      </Card>
    </div>
  );
};

export default NewsLetter;
