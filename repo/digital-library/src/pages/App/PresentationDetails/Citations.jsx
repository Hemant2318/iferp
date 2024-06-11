import React from "react";
import { Button, Profile, VideoPreview } from "components";

const Citations = () => {
  const postList = [
    {
      id: "1",
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
      id: "2",
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
    <div className="shadow cps-30 cpe-30 cpt-30 cpb-30">
      {postList?.map((el, index) => {
        const { title, category, doi } = el;
        const isLast = postList.length - 1 === index;
        return (
          <React.Fragment key={index}>
            <div>
              <div className="row">
                <div className="col-md-4">
                  <VideoPreview size="md" />
                </div>
                <div className="col-md-8">
                  <div className="text-20-500 color-2121 mb-3">{title}</div>
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
                      <Profile text="Stephen Barette" size="s-26" isRounded />
                      <div className="text-14-400 lh-21 color-3434">
                        Stephen Barette
                      </div>
                    </div>
                    <div className="fa-center gap-2">
                      <Profile text="Sourojit Das" size="s-26" isRounded />
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
                  <div className="fa-center gap-4">
                    <Button
                      btnText="Download"
                      btnStyle="SO"
                      onClick={() => {}}
                      className="text-13-400 lh-21 h-32"
                    />
                    <div className="text-13-400 color-3d3d pointer">View</div>
                  </div>
                </div>
              </div>
            </div>
            {isLast ? "" : <div className="bt-e1e1 pb-4 mt-4" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Citations;
