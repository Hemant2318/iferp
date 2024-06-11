import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { filter, findIndex } from "lodash";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { objectToFormData } from "utils/helpers";
import { useDispatch } from "react-redux";
import { deleteMessage, fetchInboxMessage, starMessage } from "store/slices";
import Compose from "./Compose";
import List from "./List";
import "./InboxNotifications.scss";
import Notifications from "./Notifications";

const InboxNotifications = () => {
  const params = useParams();
  const { memberType, type } = params;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [msgList, setMsgList] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);
  const getType = () => {
    switch (type) {
      case "inbox":
        return "incoming";
      case "sent-messages":
        return "outgoing";
      case "starred-messages":
        return "starred";

      default:
        return "";
    }
  };
  const handelDeleteId = (id) => {
    if (deleteIds.includes(id)) {
      setDeleteIds(deleteIds.filter((o) => o !== id));
    } else {
      setDeleteIds([...deleteIds, id]);
    }
  };
  const getEmailList = async () => {
    const formData = objectToFormData({ type: getType() });
    const response = await dispatch(fetchInboxMessage(formData));
    setMsgList(response?.data || []);
    setIsLoading(false);
  };
  const handelDeleteMessage = async (data) => {
    setDeleteLoading(true);
    const formData = objectToFormData(data);
    const response = await dispatch(deleteMessage(formData));
    if (response?.status === 200) {
      setDeleteIds([]);
      const removeId = data?.index_array || [data.id];
      const newList = filter([...msgList], (el) => {
        return !removeId.includes(el.id);
      });
      setMsgList(newList);
    }
    setDeleteLoading(false);
  };
  const handelStarMessage = async (data) => {
    const formData = objectToFormData(data);
    const response = await dispatch(starMessage(formData));
    if (response?.status === 200) {
      const newList = [...msgList];
      const index = findIndex(newList, ["id", data.id]);
      newList[index].is_starred = data.status;
      setMsgList(newList);
    }
  };
  useEffect(() => {
    setDeleteIds([]);
    setMsgList([]);
    if (type !== "compose" && type !== "notifications") {
      setIsLoading(true);
      getEmailList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  const activeClass = "p-2 bg-new-car color-white text-16-500";
  const inActiveClass = "p-2 color-black-olive text-16-500 pointer";
  return (
    <>
      <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div
            className={type === "inbox" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/${memberType}/inbox-notifications/inbox`);
            }}
          >
            Inbox
          </div>
          <div
            className={type === "compose" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/${memberType}/inbox-notifications/compose`);
            }}
          >
            Compose
          </div>
          <div
            className={type === "sent-messages" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/${memberType}/inbox-notifications/sent-messages`);
            }}
          >
            Sent Messages
          </div>
          <div
            className={
              type === "starred-messages" ? activeClass : inActiveClass
            }
            onClick={() => {
              navigate(`/${memberType}/inbox-notifications/starred-messages`);
            }}
          >
            Starred Messages
          </div>
          <div
            className={type === "notifications" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/${memberType}/inbox-notifications/notifications`);
            }}
          >
            Notifications
          </div>
        </div>
        {deleteIds.length > 0 && (
          <Button
            text="Delete"
            btnStyle="primary-dark"
            className="h-35"
            btnLoading={deleteLoading}
            icon={<i className="bi bi-trash text-16-400 color-white me-2" />}
            onClick={() => {
              handelDeleteMessage({ index_array: deleteIds });
            }}
          />
        )}
      </Card>
      {type === "compose" && <Compose />}

      {type === "inbox" && (
        <List
          listType={type}
          isLoading={isLoading}
          msgList={msgList}
          deleteIds={deleteIds}
          handelDeleteId={handelDeleteId}
          handelDeleteMessage={handelDeleteMessage}
          handelStarMessage={handelStarMessage}
        />
      )}

      {type === "sent-messages" && (
        <List
          listType={type}
          isLoading={isLoading}
          msgList={msgList}
          deleteIds={deleteIds}
          handelDeleteId={handelDeleteId}
          handelDeleteMessage={handelDeleteMessage}
          handelStarMessage={handelStarMessage}
        />
      )}

      {type === "starred-messages" && (
        <List
          listType={type}
          isLoading={isLoading}
          msgList={msgList}
          deleteIds={deleteIds}
          handelDeleteId={handelDeleteId}
          handelDeleteMessage={handelDeleteMessage}
          handelStarMessage={handelStarMessage}
        />
      )}
      {type === "notifications" && <Notifications />}
    </>
  );
};
export default InboxNotifications;
