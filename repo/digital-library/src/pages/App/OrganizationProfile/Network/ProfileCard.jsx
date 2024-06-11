import { Button, Profile } from "components";
import { icons } from "utils/constants";

const ProfileCard = ({
  data,
  isFollower,
  isFollowing,
  isNewRequests,
  isSentRequests,
  isDeclinedRequests,
}) => {
  const { name, bio, des, presentations, follow } = data;
  return (
    <div className="col-md-6 mb-3">
      <div className="d-flex pt-4 pb-3 ps-3 pe-3 gap-3 shadow">
        <Profile size="s-172" text={name} />
        <div className="w-100">
          <div className="text-18-500 fb-center mb-1">
            <div>{name}</div>
            <div>
              <img src={icons.verticleMore} alt="more" />
            </div>
          </div>
          <div className="text-14-400 color-5555 mb-1">{bio}</div>
          <div className="text-14-400 color-5555 mb-3">{des}</div>
          <div className="fa-center gap-1 mb-3">
            <img src={icons.play} alt="play" />
            <span></span>
            <span>{`${presentations} Presentations`}</span>
          </div>
          {isFollowing && (
            <div className="fa-center gap-4">
              <Button
                btnStyle="SD"
                btnText="Send Message"
                onClick={() => {}}
                className="h-32 text-14-500"
              />
              <div className="text-14-400 color-5555 pointer">Unfollow</div>
            </div>
          )}

          {isFollower && (
            <div className="fa-center gap-4">
              {follow ? (
                <>
                  <Button
                    btnStyle="SO"
                    btnText="Send Message"
                    onClick={() => {}}
                    className="h-32 text-14-500"
                  />
                  <div className="text-14-400 color-5555 pointer">Unfollow</div>
                </>
              ) : (
                <>
                  <Button
                    btnStyle="SD"
                    btnText="Follow"
                    onClick={() => {}}
                    className="ps-4 pe-4 h-32 text-14-500"
                  />
                  <div className="text-14-400 color-5555 pointer">
                    Send Message
                  </div>
                </>
              )}
            </div>
          )}
          {isNewRequests && (
            <div className="fa-center gap-3">
              <Button
                btnStyle="SD"
                btnText="Accept"
                onClick={() => {}}
                className="h-32 text-14-500"
              />
              <Button
                btnStyle="SO"
                btnText="Decline"
                onClick={() => {}}
                className="h-32 text-14-500"
              />
            </div>
          )}
          {isSentRequests && (
            <Button
              btnStyle="GD"
              btnText="Cancel Request"
              onClick={() => {}}
              className="h-32 text-14-500"
            />
          )}
          {isDeclinedRequests && (
            <Button
              btnStyle="SO"
              btnText="Accept"
              onClick={() => {}}
              className="h-32 text-14-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
