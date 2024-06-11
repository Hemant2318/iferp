import { Button, Profile, TextArea } from "components";
import { icons } from "utils/constants";

const Comments = () => {
  return (
    <>
      <div className="shadow">
        <div className="cps-28 cpt-16 cpb-16 text-22-500 color-3d3d bb-e3e3">
          Comments (2)
        </div>
        <div className="cps-28 cpe-28 cpt-28 cpb-28">
          <div className="text-16-400 color-3d3d b-e3e3 rounded cp-16 mb-3">
            <div className="fb-center">
              <div className="fa-center gap-3">
                <Profile text="Priya R" size="s-60" isRounded />
                <div>
                  <div className="text-16-500 color-3d3d">Priya R</div>
                  <div className="text-12-400 color-5555">
                    University of Japan
                  </div>
                </div>
              </div>
              <div className="text-13-400 color-5555">20 June 2022</div>
            </div>
            <div className="text-14-400 color-3d3d mt-3">
              Awesome Article. Loved the overall concept of the presentation.
              Thank you.
            </div>
          </div>
          <div className="text-16-400 color-3d3d b-e3e3 rounded cp-16">
            <div className="fb-center">
              <div className="fa-center gap-3">
                <Profile text="Mitra Chitsazan" size="s-60" isRounded />
                <div>
                  <div className="text-16-500 color-3d3d">Mitra Chitsazan</div>
                  <div className="text-12-400 color-5555">
                    University of Japan
                  </div>
                </div>
              </div>
              <div className="text-13-400 color-5555">21 June 2022</div>
            </div>
            <div className="text-14-400 color-3d3d mt-3">
              Thank you for this knowledgeable article.
            </div>
          </div>
        </div>
      </div>
      <div className="shadow mt-3">
        <div className="cps-28 cpt-16 cpb-16 text-16-400 color-3d3d bb-e3e3">
          Add Comment
        </div>
        <div className="cps-28 cpe-28 cpt-28 cpb-28">
          <div className="row">
            <div className="col-md-6">
              <TextArea placeholder="Enter your comment" rows={4} />
            </div>
            <div className="mt-3">
              <Button
                btnText="Send"
                btnStyle="SO"
                onClick={() => {}}
                rightIcon={icons.successSend}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
