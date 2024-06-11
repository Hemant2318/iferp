import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import CheckBox from "components/form/CheckBox";
import Button from "components/form/Button";
import { generatePreSignedUrl, getDataFromLocalStorage } from "utils/helpers";
import { useDispatch } from "react-redux";
import { setIsMentorPremiumBenefit, setIsPremiumPopup } from "store/slices";
import { commonFile } from "utils/constants";
import "./GuideLinePopup.scss";

const GuideLinePopup = ({ onHide, title, subTitle, applyMentor }) => {
  const dispatch = useDispatch();
  const [isCheck, setIsCheck] = useState(false);
  const data = getDataFromLocalStorage();
  const freeMember = [2, 11].includes(data?.membership_plan_id);
  const premiumMember = [3, 12].includes(data?.membership_plan_id);
  const [promoVideo, setPromoVideo] = useState("");

  const getPromo = async () => {
    const response = await generatePreSignedUrl(
      "mentorship-promo.mp4",
      commonFile
    );
    if (response) {
      setPromoVideo(response);
    }
  };

  useEffect(() => {
    getPromo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guideLineDetails = [
    {
      id: 1,
      question:
        "Are you ready to take your mentorship program to the next level?",
      isDescription: true,
      description: "Well, we've got something exciting to share with you",
      isPoints: true,
      points: [
        "Selling mentorship programs can be incredibly rewarding, but it can also come with its fair share of challenges, especially when it comes to platform fees",
        "So IFERP has made an incredible mentoring process to help mentors across the globe",
      ],
    },
    {
      id: 2,
      question: "What is the process to get started as a Mentor?",
      isPoints: true,
      points: [
        "Login / Sign up to IFERP Dashboard",
        `Under mentorship, click on “Become Mentor" button`,
        "A pop up opens displaying all the mentor guidelines",
        `On accepting the guidelines you ll be redirected to the premium benefits incase of a free member`,
      ],
    },
    {
      id: 3,
      question: "What are the premium mentor benefits?",
      isPoints: true,
      points: [
        "Our Premium Membership program, designed specifically to empower mentors like you.",
        `One of the biggest perks - A reduced platform fee of just 25% (For premium members) compared to the standard 40% (For non-premium members) for every mentorship session you sell.`,
        `Our Premium Membership opens the door to a world of exclusive benefits tailored to help you succeed. From priority support to advanced marketing tools, we've got everything you need to thrive in the competitive world of online education`,
        `With our Premium Membership, you're not just getting access to a platform, you're joining a community of like-minded mentors who are passionate about sharing their knowledge and making a difference in the world`,
      ],
    },
    {
      id: 4,
      question: "What are the next steps once I have applied as a Mentor?",
      isDescription: true,
      description: `Once you have completed your profile, the admin team will review it and you will receive a notification within 72 hours about the status of your mentor profile. Please note that only after adding the session your profile will be live on the platform.`,
    },
    {
      id: 5,
      question: "How can I create a new session?",
      isPoints: true,
      points: [
        "Once the admin approves your profile as a mentor you can add your payment bank account details. You will get paid for all your sessions to the respective account.",
        `After adding the payment details you can proceed to add your new mentoring session.`,
        `To add a session you need to fill in all the mandatory details like Its overview, skills mentees will learn, Duration of the session, Your availability based on date and time. Mentors can customize their availability for particular days as well.`,
      ],
    },
    {
      id: 6,
      question: "How can I edit a session?",
      isPoints: true,
      points: [
        "You can click on my sessions and edit whichever session you wish",
        `Availability can also be edited for that particular session`,
        `You can customize date and time according to your convenience`,
      ],
    },
    {
      id: 7,
      question: "What are the steps to set availability?",
      isPoints: true,
      points: [
        "You can pick the days or periods for when you are free or which work best for you and we will allow the mentee to make bookings only when you are available.",
        `You can set your availability manually for different time slots for each day of the week.`,
        `You can also set the Booking Period i.e. the period for which your calendar will be visible to the mentees.`,
        `Custom slots for your availability can be edited from the session availability dashboard itself.`,
      ],
    },
    {
      id: 8,
      question: "How will I share my mentor profile?",
      isPoints: true,
      points: [
        `Along with a 9 Million + IFERP community, you can share your profile with quick links across your social media handles like facebook, linkedIn, whatsapp and twitter. It will help you get bookings organically`,
        `We recommend you to share your business page link as it displays all your skills, qualifications, research items, sessions and many more.`,
      ],
    },
    {
      id: 9,
      question: "I’m unavailable for a while, what should I do?",
      isPoints: true,
      points: [
        `You can edit and set availability for whichever session you wish to from the availability section of your dashboard. The availability can be set for custom dates and you can also add custom slots for reservations on a particular reserved date.`,
        `If you are unavailable for some time, you can pause the services by editing your available days of the week by setting it as unavailable.`,
      ],
    },
    {
      id: 10,
      question: "How do I reschedule a session?",
      isPoints: true,
      points: [
        `For a particular booking, you can request a reschedule from the ‘Upcoming Meeting’ section. Once approved by the mentee, you will receive a confirmation email with the invite for the new slot.`,
        `You can reschedule or reject a session`,
      ],
    },
    {
      id: 11,
      question: "How do reviews work?",
      isDescription: true,
      description: `After every session mentees can rate and give feedback for the session and share their experience with the mentor. All the ratings and review given by the mentees will be displayed under each session`,
    },
    {
      id: 12,
      question: "What are the terms for payouts?",
      isPoints: true,
      points: [
        `Once your profile gets approved by the admin, you need to fill all your payment account details. All your payments will be settled every month.`,
        `Premium members get a very minimal platform fee of 25%`,
        `Whereas the non-premium members get a platform fee of 40% for every mentoring session`,
      ],
    },
  ];
  return (
    <Modal onHide={onHide} title={title} titleClass>
      <div id="guide-line-popup" className="cps-20 cpe-20 cpt-10 cpb-20">
        <div className="text-center cmt-10 cmb-30 text-18-400 color-4646">
          {subTitle}
        </div>
        <div className="question-block iferp-scroll">
          {guideLineDetails.map((elem, index) => {
            const { question, isDescription, description, isPoints, points } =
              elem;
            return (
              <div key={index}>
                <div className="color-1f40 text-16-500 cmb-10">{question}</div>
                {isDescription && (
                  <div className="text-15-400 color-2D2D cmb-10">
                    {description}
                  </div>
                )}
                {isPoints &&
                  points.map((pElem, pIndex) => {
                    return (
                      <ul className="list text-15-400 color-2D2D" key={pIndex}>
                        <li key={pIndex}>{pElem}</li>
                      </ul>
                    );
                  })}
              </div>
            );
          })}
        </div>
        <div className="d-flex flex-column gap-2 cmt-10 cmb-20">
          <div className="d-flex align-items-center gap-1 text-15-500 color-2D2D">
            <span>Have Doubts</span>
            <span
              className="color-00ff text-16-500 hover-text"
              onClick={() => {
                if (promoVideo) {
                  window.open(promoVideo, "_blank");
                }
              }}
            >
              Watch User Guide Video
            </span>
          </div>
          <div className="d-flex align-items-center gap-1 text-15-500 color-2D2D">
            <span>Still need help?</span>
            <div className="d-flex align-items-center gap-1">
              <span>Contact Us:</span>
              <span className="color-00ff text-16-500">helpdesk@iferp.in</span>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 cmb-30">
          <CheckBox
            type="ACTIVE"
            isChecked={isCheck}
            onClick={() => {
              setIsCheck(!isCheck);
            }}
          />
          <div className="text-16-400 color-1f40">
            I accept all the mentorship guidelines
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-2">
          <Button
            text="Submit"
            btnStyle="primary-dark"
            className="cps-20 cpe-20 text-16-500"
            onClick={() => {
              if (!premiumMember && freeMember) {
                onHide();
                dispatch(setIsMentorPremiumBenefit(true));
                dispatch(setIsPremiumPopup(true));
              } else {
                applyMentor();
                onHide();
              }
            }}
            disabled={!isCheck}
          />
          <Button
            isRounded
            text="Cancel"
            className="cps-20 cpe-20 text-15-400 color-4d53"
            onClick={onHide}
          />
        </div>
      </div>
    </Modal>
  );
};

export default GuideLinePopup;
