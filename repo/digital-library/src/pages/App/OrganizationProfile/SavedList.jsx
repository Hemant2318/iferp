import React from "react";
import { Button, DropdownOption, Profile, VideoPreview } from "components";
import { icons } from "utils/constants";
import YouMayAlsoLike from "./Network/YouMayAlsoLike";

const SavedList = () => {
  const postList = [
    {
      name: "Alfred Walton",
      bio: "Professor, United university",
      title:
        "Associations of Pulmonary Function with MRI Brain Volumes: A Coordinated Multi-Study Analysis",
      category: "Article",
      doi: "10.3233/JAD-220667",
      totalView: "56",
      totalShare: "26",
      totalLike: "2K",
      totalContradic: "80",
      author: [
        {
          name: "Karan R",
        },
        {
          name: "Stephen Barette",
        },
        {
          name: "Sourojit Das",
        },
      ],
    },
    {
      name: "Arumugam Nallanathan",
      bio: "Professor of Wireless Communications, University of London",
      title:
        "UAV-enabled Massive MIMO Two-Way Full-Duplex Relay Systems with Non-Orthogonal Multiple Access",
      category: "Article",
      doi: "10.3233/JAD-220667",
      totalView: "60",
      totalShare: "6",
      totalLike: "6K",
      totalContradic: "40",
      author: [
        {
          name: "Karan R",
        },
        {
          name: "Stephen Barette",
        },
        {
          name: "Sourojit Das",
        },
      ],
    },
  ];
  return (
    <div className="row mt-3">
      <div className="col-md-8">
        <div className="shadow cpt-20 cpb-20">
          <div className="bb-e3e3 cps-20 cpe-20 cpb-20 fb-center">
            <div>Saved List (26)</div>
            <div className="fa-center gap-2">
              <span>
                <img src={icons.search} alt="search" />
              </span>
              <span className="color-5555">Search</span>
            </div>
          </div>
          <div className="row cps-20 cpe-20 cpt-20">
            {postList?.map((el, index) => {
              const {
                name,
                bio,
                title,
                category,
                doi,
                totalView,
                totalShare,
                totalLike,
                totalContradic,
              } = el;
              const isLast = postList.length - 1 === index;
              return (
                <React.Fragment key={index}>
                  <div>
                    <div className="fb-center">
                      <div className="fa-center gap-3">
                        <Profile text={name} size="s-44" isRounded />
                        <div>
                          <div className="text-15-500 lh-28 color-3d3d">
                            {name}
                          </div>
                          <div className="text-14-400 lh-22 color-6666">
                            {bio}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="d-flex justify-content-end">
                          <DropdownOption
                            icons={
                              <img src={icons.moreHorizontal} alt="more" />
                            }
                          >
                            <div className="cps-10">Post Options</div>
                          </DropdownOption>
                        </div>
                      </div>
                    </div>
                    <div className="text-16-500 lh-24 color-2121 mt-3 mb-3 hover-effect pointer">
                      {title}
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <VideoPreview />
                      </div>
                      <div className="col-md-8">
                        <div className="d-flex gap-3">
                          <Button
                            btnText={category}
                            btnStyle="GD"
                            onClick={() => {}}
                            className="ps-4 pe-4 text-13-400 lh-21 h-32"
                          />
                          <Button
                            btnText="Full-text available"
                            btnStyle="PO"
                            onClick={() => {}}
                            className="text-13-400 lh-21 h-32"
                          />
                        </div>
                        <div className="fa-center gap-3 mt-3 mb-3">
                          <div className="fa-center gap-2">
                            <Profile text="Karan R" size="s-26" isRounded />
                            <div className="text-14-400 lh-21 color-3434">
                              Karan R
                            </div>
                          </div>
                          <div className="fa-center gap-2">
                            <Profile
                              text="Stephen Barette"
                              size="s-26"
                              isRounded
                            />
                            <div className="text-14-400 lh-21 color-3434">
                              Stephen Barette
                            </div>
                          </div>
                          <div className="fa-center gap-2">
                            <Profile
                              text="Sourojit Das"
                              size="s-26"
                              isRounded
                            />
                            <div className="text-14-400 lh-21 color-3434">
                              Sourojit Das
                            </div>
                          </div>
                        </div>
                        <div className="fa-center gap-4 text-14-400 lh-21 color-3d3d mb-3">
                          <div>
                            DOI -<span className="text-14-500 ms-1">{doi}</span>
                          </div>
                          <div>
                            Proceeding page -
                            <span className="text-14-500 ms-1">1 to 5</span>
                          </div>
                        </div>
                        <div className="fa-center gap-3">
                          <div className="fa-center text-14-400 color-5555 gap-1">
                            <span>
                              <img src={icons.eye} alt="eye" />
                            </span>
                            <span>{totalView} Views</span>
                          </div>
                          <div className="fa-center text-14-400 color-5555 gap-1">
                            <span>
                              <img src={icons.share} alt="eye" />
                            </span>
                            <span>{totalShare} Citations</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-4">
                        <Button
                          btnText="Presentations"
                          btnStyle="SO"
                          leftIcon={icons.downloadArrow}
                          className="h-38"
                          onClick={() => {}}
                        />
                      </div>
                      <div className="col-md-8 fa-center gap-4">
                        <div className="fa-center gap-2">
                          <span className="d-flex">
                            <img src={icons.successLike} alt="like" />
                          </span>
                          <span className="text-14-500 color-1818 lh-21">
                            {totalLike}
                          </span>
                          <span className="text-14-400 color-5555 lh-21">
                            Useful
                          </span>
                        </div>
                        <div className="fa-center gap-2">
                          <span className="d-flex">
                            <img src={icons.successDeslike} alt="like" />
                          </span>
                          <span className="text-14-500 color-1818 lh-21">
                            {totalContradic}
                          </span>
                          <span className="text-14-400 color-5555 lh-21">
                            Contradict
                          </span>
                        </div>
                        <div className="fa-center gap-2">
                          <span className="d-flex">
                            <img src={icons.successSave} alt="like" />
                          </span>
                          <span className="text-14-400 color-5555 lh-21">
                            Save
                          </span>
                        </div>
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
                  {isLast ? (
                    <div className="fj-center mt-4">
                      <Button
                        btnText="View all Posts"
                        btnStyle="SD"
                        onClick={() => {}}
                        rightIcon={icons.rightSuccess}
                      />
                    </div>
                  ) : (
                    <div className="bt-e1e1 pb-4 mt-4" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <YouMayAlsoLike />
      </div>
    </div>
  );
};

export default SavedList;
