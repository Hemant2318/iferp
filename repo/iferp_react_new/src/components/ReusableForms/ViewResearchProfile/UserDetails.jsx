import Card from "components/Layout/Card";
import EditButton from "components/Layout/EditButton";
import UserProfile from "components/Layout/Profile";
import RequestHandleLayout from "components/Layout/RequestHandleLayout";
import Button from "components/form/Button/Button";
import { getDataFromLocalStorage } from "utils/helpers";

const UserDetails = ({
  profile_details,
  setFormType,
  isMyProfile,
  isSelfUser,
  isExist,
  isAlreadyExist,
  isConnectLoader,
  // handelConnect,
}) => {
  const {
    first_name,
    last_name,
    state_name,
    country_name,
    designation,
    university,
    area_of_interest,
    profile_photo,
    user_type,
    institution_name,
  } = profile_details || {};

  return (
    <Card className="mb-3 cps-24 cpe-24 cpt-24 cpb-24 ">
      <div className="d-flex ">
        <UserProfile
          isRounded
          url={profile_photo}
          text={first_name}
          size="s-100"
          className="me-4"
          isS3UserURL
        />
        <div className="flex-grow-1  ">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            {first_name && (
              <div className="text-20-500 color-raisin-black">{`${first_name} ${last_name}`}</div>
            )}

            {isMyProfile && (
              <EditButton
                onClick={() => {
                  setFormType(1);
                }}
              />
            )}
            {isSelfUser || isMyProfile ? (
              ""
            ) : isAlreadyExist || isExist ? (
              <Button
                onClick={() => {}}
                text={
                  isAlreadyExist
                    ? "Connected"
                    : isExist
                    ? "Request Sent"
                    : "Try To Connect"
                }
                btnStyle="primary-light"
                className="h-35 text-14-500 cps-20 cpe-20 text-nowrap"
                btnLoading={isConnectLoader}
                disabled
              />
            ) : (
              <>
                <RequestHandleLayout
                  receiverId={getDataFromLocalStorage("id")}
                  newSendRequest
                  btnText="Connect"
                />
                {/* <Button
                onClick={handelConnect}
                text="Connect"
                btnStyle="primary-light"
                className="h-35 text-14-500 cps-20 cpe-20"
                btnLoading={isConnectLoader}
              /> */}
              </>
            )}
          </div>
          <div className="text-15-400 color-black-olive mt-2 mb-2">
            {`${designation ? `${designation} -` : ""} ${
              user_type === "2" ? institution_name : university
            }`}
          </div>

          <div className="text-14-400 color-black-olive">
            {`${user_type === "2" ? (university ? `${university}` : "") : ""}${
              state_name || country_name ? " - " : ""
            } ${state_name ? `${state_name}, ` : ""}${country_name || ""}`}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between cmt-26">
        <div className="col-md-12">
          {area_of_interest && (
            <>
              <div className="text-14-500 color-black-olive">
                Research Interest
              </div>
              <div className="text-15-400 color-black-olive mt-2 d-flex gap-2 flex-wrap">
                {area_of_interest?.split(",").map((elem, index) => {
                  return (
                    <span
                      key={index}
                      className="bg-new-car-light ps-2 pe-2 pb-1 pt-1 text-13-500 text-nowrap"
                    >
                      {elem}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserDetails;
