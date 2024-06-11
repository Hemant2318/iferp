import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { conferencePath } from "utils/constants";
import { combineArrayS3 } from "utils/helpers";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const ViewPastConferenceGallery = () => {
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const { past_conference_gallery = [] } = eventData;
  const [list, setList] = useState([]);
   const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const fetchS3Data = async () => {
    let response = await combineArrayS3(
      past_conference_gallery,
      "images",
      conferencePath
    );
    setList(response);
  };
  useEffect(() => {
    if (past_conference_gallery && past_conference_gallery?.length > 0) {
      fetchS3Data();
    } else {
      setList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [past_conference_gallery]);
  return (
    <>
      {list.length === 0 ? (
        <div className="d-flex justify-content-center text-14-400">
          No Data Found
        </div>
      ) : (
        list.map((elem, index) => {
          return (
            <>
            <div
              className="committee-members-card-container col-md-3 cmb-20"
              key={index}
             onClick={() => {
              setImgIndex(index)
               setIsOpen(true)
             }}
            >
              <div className="shadow-block">
                <div className="image-block center-flex h-200">
                  <img
                    src={elem?.s3File}
                    alt="gallary"
                    className="fill fit-image"
                  />
                </div>
              </div>
            </div>
                {isOpen && (
              <Lightbox
               className="fill fit-image"
               mainSrc={list[imgIndex]?.s3File}
               nextSrc={list[(imgIndex + 1) % list.length].s3File}
               prevSrc={list[(imgIndex + list.length - 1) % list.length].s3File}
               onCloseRequest={() => setIsOpen(false)}
               onMovePrevRequest={() =>
              setImgIndex((imgIndex + list.length - 1) % list.length)}
              onMoveNextRequest={() => setImgIndex((imgIndex + 1) % list.length)}
                />                
              )}
              </>
          );
        })
      )}
    </>
  );
};
export default ViewPastConferenceGallery;
