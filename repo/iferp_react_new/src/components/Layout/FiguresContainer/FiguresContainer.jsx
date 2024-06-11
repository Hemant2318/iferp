import { useEffect, useState } from "react";
import { generatePreSignedUrl } from "utils/helpers";
import { figuresPath } from "utils/constants";
import "./FiguresContainer.scss";

const FiguresContainer = ({ data, loadMore }) => {
  const [figureList, setFigureList] = useState([]);
  const count = data.length - 4;
  const handleFigure = async (newData) => {
    const promises = newData.map(async (elm) => {
      let response = await generatePreSignedUrl(elm.figure, figuresPath);
      return { ...elm, s3File: response };
    });
    const results = await Promise.all(promises);
    setFigureList(results);
  };
  useEffect(() => {
    if (data.length > 0) {
      handleFigure(data);
    } else {
      setFigureList([]);
    }
  }, [data]);

  return (
    <div id="figures-container">
      {figureList
        .filter((_, index) => {
          return index < 4;
        })
        .map((elm, index) => {
          let isLast = index === 3;
          return (
            <div
              className="figure-image-content pointer"
              key={index}
              onClick={loadMore}
            >
              {isLast && (
                <>
                  <div className="figure-view-block" />
                  <div className="view-text-block text-16-500 color-black-olive">
                    {data.length === 4 ? "View More" : `+${count}`}
                  </div>
                </>
              )}
              <img src={elm.s3File} alt="figure" className="fill fit-image" />
            </div>
          );
        })}
      {/* {isViewMore && (
        <div className="figure-image-content" onClick={loadMore}>
          <div className="figure-view-block" />
          <div className="view-text-block text-16-400 color-black-olive">
            View More
          </div>
        </div>
      )} */}
    </div>
  );
};

export default FiguresContainer;
