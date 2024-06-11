import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  Button,
  Back,
  Profile,
  VideoPreview,
  ExportButton,
  Loader,
} from "components";
import { icons, posterPath, CoverImagePath } from "utils/constants";
import {
  generatePreSignedUrl,
  getDataFromLocalStorage,
  getEventDate,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  eventPostList,
  getSponsors,
  fetchUserEventDetails,
} from "store/globalSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";

const ConferenceDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { eventID } = params;

  const [eventData, setEventData] = useState({});
  const [eventPoster, setEventPoster] = useState(null);
  // const [sponsorsList, setSponsorsList] = useState([]);
  const [eventPosts, setEventPosts] = useState([]);
  const [isPageLoader, setIsPageLoader] = useState(true);

  const getEventDetails = async () => {
    const res = await dispatch(
      fetchUserEventDetails({
        event_id: eventID,
        user_id: getDataFromLocalStorage("id"),
      })
    );

    const s3Poster = await generatePreSignedUrl(
      res?.data?.poster_path,
      posterPath
    );

    let subEventS3Posters = [];
    if (res?.data?.cover_image?.length > 0) {
      const promises = res?.data?.cover_image?.map(async (url) => {
        const URL = await generatePreSignedUrl(url, CoverImagePath);
        return URL;
      });
      subEventS3Posters = await Promise.all(promises);
    }
    const newEventDetails = {
      ...res?.data,
      s3Poster,
      subEventS3Posters,
    };
    setEventData(newEventDetails);
    setEventPoster(subEventS3Posters[0]);
    setIsPageLoader(false);
  };
  const getEventPostList = async () => {
    const response = await dispatch(
      eventPostList(objectToFormData({ event_id: eventID }))
    );
    if (response?.status === 200 && response?.data?.["0"]?.id) {
      const dataArray = Object.values(response?.data).filter(
        (item) => item?.id
      );
      setEventPosts(dataArray);
    }
  };
  // const getEventSponsors = async () => {
  //   const response = await dispatch(getSponsors());
  //   setSponsorsList(response?.data?.sponsor_details || []);
  // };
  useEffect(() => {
    // getEventSponsors();
    getEventPostList();
    getEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    event_name,
    organizer_name,
    about_the_conference,
    start_date,
    end_date,
    city_name,
    country_name,
    s3Poster,
    subEventS3Posters,
    proceeding_book,
  } = eventData;

  // console.log("eventPoster", eventPoster);

  return (
    <div className="container bg-feff">
      {isPageLoader ? (
        <div className="shadow cpt-150 f-center cpb-150">
          <Loader size="lg" />
        </div>
      ) : (
        <>
          <div className="shadow cpt-28 cps-28 cpe-28 cpb-28">
            <div className="row col-md-12">
              <div className="col-md-10">
                <Back>
                  <div className="text-22-500 color-3d3d">{event_name}</div>
                </Back>
              </div>
              {/* <div className="col-md-2">
                <div className="text-13-400 text-nowrap text-center">
                  Credit Score
                </div>
                <div className="f-center">
                  <img src={icons.creditScore} alt="credit-score" />
                </div>
              </div> */}
            </div>
            <div className="row mt-4 gy-2">
              <div className="col-md-4 h-100">
                {(s3Poster || eventPoster) && (
                  <div className="cmb-10 w-100">
                    <img
                      src={eventPoster === null ? s3Poster : eventPoster}
                      alt="poster"
                      className="child-image"
                    />
                  </div>
                )}

                <Swiper
                  modules={[Navigation]}
                  slidesPerView={"3"}
                  navigation
                  spaceBetween={10}
                >
                  {subEventS3Posters?.map((url, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <span style={{ width: "96px", height: "70px" }}>
                          <img
                            src={url}
                            alt="poster"
                            className="child-image"
                            onClick={() => {
                              setEventPoster(url);
                            }}
                          />
                        </span>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <div className="col-md-8">
                <div>{titleCaseString(about_the_conference)}</div>
                {organizer_name && (
                  <div className="text-16-500 color-3d3d lh-24 mt-3">
                    <span>Organizer -</span>
                    <span className="text-16-400 ms-2 text-decoration-underline">
                      {titleCaseString(organizer_name)}
                    </span>
                  </div>
                )}
                {/* {sponsorsList?.length > 0 && (
                  <div className="text-16-500 color-3d3d lh-24 mt-3 d-flex flex-wrap">
                    <span>Sponsors -</span>
                    {sponsorsList?.map((elm, index) => {
                      return (
                        <span
                          className="fa-center gap-2 ms-2 mb-md-2 mb-sm-2 mb-2"
                          key={index}
                        >
                          <Profile
                            url=""
                            text={elm?.organization_name}
                            size="s-26"
                            isRounded
                          />
                          <div className="text-16-400 text-decoration-underline">
                            {elm?.organization_name}
                          </div>
                        </span>
                      );
                    })}
                  </div>
                )} */}

                <div className="fa-center gap-4 mt-3">
                  <div className="fa-center gap-2">
                    <span>
                      <img src={icons.location} alt="map" />
                    </span>
                    {country_name && (
                      <span className="text-16-400 lh-24 color-3d3d">
                        {`${city_name ? `${city_name},` : ""} ${country_name}`}
                      </span>
                    )}
                  </div>
                  <div className="fa-center gap-2">
                    <span>
                      <img src={icons.calendar} alt="calender" />
                    </span>
                    <span className="text-16-400 lh-24 color-3d3d">
                      {getEventDate(start_date, end_date)}
                    </span>
                  </div>
                </div>
                <div className="fa-center gap-4 mt-3">
                  {proceeding_book !== "" && (
                    <>
                      <ExportButton
                        exportAPI={getSponsors}
                        // payload="export_status=1"
                        btnName="Proceeding"
                      />
                      {/* <Button
                  btnText="Proceeding"
                  btnStyle="SO"
                  onClick={() => {}}
                  leftIcon={icons.downloadArrow}
                /> */}
                    </>
                  )}
                  <Button
                    btnText="Find Session"
                    btnStyle="SO"
                    leftIcon={icons.successSearch}
                    onClick={() => {
                      navigate(`/conference/${eventID}/find-session`);
                    }}
                  />
                  <Button
                    btnText="Office Bearers"
                    btnStyle="SO"
                    onClick={() => {
                      navigate(`/conference/${eventID}/office-bearer`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="shadow cpt-28 cps-28 cpe-28 cpb-28 mt-3">
            <div className="fb-center cmb-30">
              <div className="text-20-500 color-1919 lh-30">
                All Presentations{" "}
                {eventPosts?.length > 0 && (
                  <span className="text-20-400">({eventPosts?.length})</span>
                )}
              </div>
            </div>
            {eventPosts.length === 0 ? (
              <div className="pt-1 pb-1 text-center text-18-400">
                No Presentations Found.
              </div>
            ) : (
              eventPosts?.map((el, index) => {
                const {
                  author_details,
                  co_authors,
                  doi,
                  page_number_from,
                  page_number_to,
                } = el;
                let acList = [];
                if (author_details?.name) {
                  acList.push(author_details);
                }
                if (co_authors?.length > 0) {
                  acList.push(...co_authors);
                }
                return (
                  <div key={index} className="bb-e3e3 mb-3">
                    <div className="row">
                      <div className="col-md-4">
                        <VideoPreview
                          size="md"
                          isVideoURL
                          poster={el?.thumbnail}
                          src={el?.presentation_link}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="text-18-500 color-2121 mb-3">
                          {el?.title}{" "}
                          <span className="text-14-400 color-5555">
                            {moment(
                              el?.created_date,
                              "DD-MM-YYYY HH:mm:ss"
                            ).format("DD")}{" "}
                            {moment(
                              el?.created_date,
                              "DD-MM-YYYY HH:mm:ss"
                            ).format("MMMM")}{" "}
                            {moment(
                              el?.created_date,
                              "DD-MM-YYYY HH:mm:ss"
                            ).format("YYYY")}
                          </span>
                        </div>
                        <div className="d-flex gap-3 flex-wrap">
                          {(el?.sub_category_name !== "" ||
                            el?.category_name !== "") && (
                            <Button
                              btnText={
                                el?.sub_category_name !== ""
                                  ? el?.sub_category_name
                                  : el?.category_name
                              }
                              btnStyle="GD"
                              onClick={() => {}}
                              className="ps-4 pe-4 text-13-400 lh-21 h-32"
                            />
                          )}
                          {el?.post !== "" && (
                            <Button
                              btnText="Full-text available"
                              btnStyle="PO"
                              onClick={() => {}}
                              className="text-13-400 lh-21 h-32"
                            />
                          )}

                          <Button
                            btnText="Keynote"
                            btnStyle="PD"
                            onClick={() => {}}
                            className="text-13-400 lh-21 h-32"
                          />
                        </div>
                        <div className="fa-center gap-3 mt-3 mb-3">
                          {acList?.map((author, index) => {
                            return (
                              <div
                                className={`fa-center gap-2 ${
                                  author?.name ? "" : "d-none"
                                }`}
                                key={index}
                              >
                                <Profile
                                  url={author?.profile_photo}
                                  text={author?.name}
                                  size="s-26"
                                  isRounded
                                  isS3UserURL
                                />
                                <div className="text-14-400 lh-21 color-3434">
                                  {author?.name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {(doi || page_number_from) && (
                          <div className="fa-center gap-4 text-14-400 lh-21 color-3d3d mb-3">
                            {doi && (
                              <div>
                                DOI -
                                <span className="text-14-500 ms-1">{doi}</span>
                              </div>
                            )}
                            {page_number_from && (
                              <div>
                                Proceeding page -
                                <span className="text-14-500 ms-1">
                                  {`${page_number_from} to ${page_number_to}`}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {/* <div
                          className="text-15-500 color-b176 d-flex gap-1 pointer pb-3"
                          onClick={() => {
                            navigate(
                              `/presentations/${eventID}/${el?.id}/abstract`
                            );
                          }}
                        >
                          <span className="text-decoration-underline">
                            View Abstract
                          </span>
                          <span>
                            <img src={icons.successRightArrow} alt="right" />
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ConferenceDetail;
