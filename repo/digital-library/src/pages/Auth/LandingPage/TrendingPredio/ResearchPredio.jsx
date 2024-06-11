import { Profile, VideoPreview } from "components";
import { icons } from "utils/constants";

const ResearchPredio = () => {
  const prediaArray = [
    {
      name: "Alfred Walton",
      designation: " Professor, was cited in a publication",
      subTitle:
        "Analysis on homomorphic technique for data security in fog computing",
      ago: "6h ago",
      like: icons.successLike,
      disLike: icons.successDeslike,
      comment: icons.comment,
      share: icons.successShare,
    },
    {
      name: "Alfred Walton",
      designation: " Professor, was cited in a publication",
      subTitle:
        "Analysis on homomorphic technique for data security in fog computing",
      ago: "6h ago",
      like: icons.successLike,
      disLike: icons.successDeslike,
      comment: icons.comment,
      share: icons.successShare,
    },
  ];
  return (
    <div className="bg-ffff">
      <div className="container cpt-60 cpb-60">
        <div className="text-40-600 color-1919 text-center cmb-30">
          Trending Research Predio
        </div>
        <div className="row">
          {prediaArray?.map((elem, index) => {
            return (
              <div className="col-md-6 gy-4" key={index}>
                <div className="shadow">
                  <div className="cp-23 cpb-20">
                    <div className="fa-center gap-3">
                      <Profile text={elem?.name} size="s-72" isRounded />
                      <div className="flex-grow-1">
                        <div className="fb-center mb-2">
                          <div className="text-18-500 color-3434">
                            {elem?.name}
                          </div>
                          <div>
                            <img
                              src={icons.moreHorizontal}
                              alt="more"
                              className="pointer"
                            />
                          </div>
                        </div>
                        <div className="fb-center">
                          <div className="text-14-400 color-6666">
                            {elem?.designation}
                          </div>
                          <div className="text-13-400 color-7070">
                            {elem?.ago}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-16-500 color-3d3d cmt-20 mb-3">
                      {elem?.subTitle}
                    </div>
                    <VideoPreview size="md" />
                  </div>
                  <div className="bt-e3e3" />
                  <div className="cp-20">
                    <div className="row">
                      <div className="col-md-3 col-6 cmb-20">
                        <div className="fa-center gap-2">
                          <span className="d-flex">
                            <img src={elem?.like} alt="like" />
                          </span>
                          <span className="text-14-500 color-1818 lh-21">
                            70
                          </span>
                          <span className="text-14-400 color-5555 lh-21">
                            Useful
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="fa-center gap-2">
                          <span className="d-flex">
                            <img src={elem?.disLike} alt="like" />
                          </span>
                          <span className="text-14-500 color-1818 lh-21">
                            20
                          </span>
                          <span className="text-14-400 color-5555 lh-21">
                            Contradict
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="fa-center gap-2">
                          <span className="d-flex">
                            <img src={elem?.comment} alt="like" />
                          </span>

                          <span className="text-14-500 color-1818 lh-21">
                            10
                          </span>
                          <span className="text-14-400 color-5555 lh-21">
                            Comments
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="fa-center gap-2">
                          <span className="d-flex">
                            <img src={elem?.share} alt="like" />
                          </span>
                          <span className="text-14-400 color-5555 lh-21">
                            Share
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* <div className="col-md-6">
            <div className="shadow">
              <div className="cp-23 cpb-20">
                <div className="fa-center gap-3">
                  <Profile text="Alfred Walton" size="s-72" isRounded />
                  <div className="flex-grow-1">
                    <div className="fb-center mb-2">
                      <div className="text-18-500 color-3434">
                        Alfred Walton
                      </div>
                      <div>
                        <img
                          src={icons.moreHorizontal}
                          alt="more"
                          className="pointer"
                        />
                      </div>
                    </div>
                    <div className="fb-center">
                      <div className="text-14-400 color-6666">
                        Professor, was cited in a publication
                      </div>
                      <div className="text-13-400 color-7070">6h ago</div>
                    </div>
                  </div>
                </div>
                <div className="text-16-500 color-3d3d cmt-20 mb-3">
                  Analysis on homomorphic technique for data security in fog
                  computing
                </div>
                <VideoPreview size="md" />
              </div>
              <div className="bt-e3e3" />
              <div className="cp-20">
                <div className="row">
                  <div className="col-md-3">
                    <div className="fa-center gap-2">
                      <span className="d-flex">
                        <img src={icons.successLike} alt="like" />
                      </span>
                      <span className="text-14-500 color-1818 lh-21">70</span>
                      <span className="text-14-400 color-5555 lh-21">
                        Useful
                      </span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="fa-center gap-2">
                      <span className="d-flex">
                        <img src={icons.successDeslike} alt="like" />
                      </span>
                      <span className="text-14-500 color-1818 lh-21">20</span>
                      <span className="text-14-400 color-5555 lh-21">
                        Contradict
                      </span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="fa-center gap-2">
                      <span className="d-flex">
                        <img src={icons.comment} alt="like" />
                      </span>

                      <span className="text-14-500 color-1818 lh-21">10</span>
                      <span className="text-14-400 color-5555 lh-21">
                        Comments
                      </span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="fa-center gap-2">
                      <span className="d-flex">
                        <img src={icons.successShare} alt="like" />
                      </span>
                      <span className="text-14-400 color-5555 lh-21">
                        Share
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ResearchPredio;
