import React, { useState } from "react";
import { useSelector } from "react-redux";
import { cloneDeep, forEach } from "lodash";
import { Table } from "react-bootstrap";
import RadioInput from "components/form/RadioInput";
import { getDataFromLocalStorage } from "utils/helpers";
import "./Registration.scss";

const ViewRegistration = ({
  isEdit,
  handelPriceSelection,
  isNational,
  inrPrice,
}) => {
  const [priceArray, setPriceArray] = useState([]);
  const [addOnPriceArray, setAddOnPriceArray] = useState([]);
  const userData = getDataFromLocalStorage();
  const { user_type, membership_plan_id } = userData;
  const { eventData } = useSelector((state) => ({
    eventData:
      user_type === "0" ? state.global.eventData : state.global.eventData,
  }));
  const {
    event_pricing = [],
    add_on_pricing = [],
    dashboard_pricing_selection = [],
    pricing_categories = [],
    event_mode,
  } = eventData;
  const findCategory =
    user_type === "0"
      ? pricing_categories
      : dashboard_pricing_selection.find(
          (o) => `${o.id}` === `${membership_plan_id}`
        )?.data || [];

  const handelClick = (e) => {
    const elemID = e.target.id;
    let list = cloneDeep(priceArray);
    let addonlist = cloneDeep(addOnPriceArray);
    if (elemID.includes("event_pricing")) {
      if (list.includes(elemID)) {
        list = list.filter((o) => o !== elemID);
      } else {
        // list = [...list, elemID];
        list = [elemID];
      }
      setPriceArray(list);
    } else {
      if (addonlist.includes(elemID)) {
        addonlist = addonlist.filter((o) => o !== elemID);
      } else {
        const idArray = elemID.split("-");

        addonlist = addonlist.filter(
          (o) =>
            o !==
            `${idArray[0]}-${idArray[1]}-${
              idArray[2] === "non_premium_members"
                ? "premium_members"
                : "non_premium_members"
            }`
        );
        addonlist = [...addonlist, elemID];
      }
      setAddOnPriceArray(addonlist);
    }
    let amount = 0;
    forEach(list, (elm) => {
      const splitData = elm.split("-");
      if (splitData[0] === "event_pricing") {
        const parentFind = event_pricing.find(
          (o) => `${o.id}` === splitData[1]
        )?.[splitData[2]];
        let childFind = parentFind.find((o) => `${o.id}` === splitData[3])?.[
          splitData[4]
        ];
        let priceAmount = childFind ? +childFind : 0;
        amount = amount + priceAmount;
      }
    });
    forEach(addonlist, (elm) => {
      const splitData = elm.split("-");
      if (splitData[0] === "add_on_pricing") {
        const res = add_on_pricing.find((o) => `${o.id}` === splitData[1])?.[
          splitData[2]
        ];
        amount = amount + +res;
      }
    });
    if (handelPriceSelection) {
      handelPriceSelection(amount);
    }
  };

  const showEventPricing =
    findCategory.some((o) => o.is_checked) || user_type === "0";
  return (
    <div
      id="common-registration-block"
      className="w-100 overflow-auto iferp-scroll"
    >
      {event_pricing.length === 0 && (
        <div className="d-flex justify-content-center text-14-400 cpb-20 cmt-24">
          No Data Found
        </div>
      )}
      {event_pricing.length > 0 && showEventPricing && (
        <>
          <div className="text-18-500 color-title-navy font-poppins mb-3">
            Event Pricing
          </div>
          <Table bordered>
            <thead className="table-header-container">
              <tr className="table-header-row-container">
                <th className="header-cell" rowSpan={2}>
                  Registration Categories
                </th>
                <th className="header-cell" rowSpan={2}>
                  Event Type
                </th>
                {findCategory.map((elem, index) => {
                  return (
                    <th
                      className={`header-cell ${
                        elem?.is_checked || user_type === "0" ? "" : "d-none"
                      }`}
                      key={index}
                      colSpan={2}
                    >
                      {elem.category}
                    </th>
                  );
                })}
              </tr>
              <tr className="table-header-row-container">
                {findCategory.map((elem, index) => {
                  return (
                    <React.Fragment key={index}>
                      <th
                        className={`header-cell ${
                          elem?.is_checked || user_type === "0" ? "" : "d-none"
                        }`}
                      >
                        Early Bird Price
                      </th>
                      <th
                        className={`header-cell ${
                          elem?.is_checked || user_type === "0" ? "" : "d-none"
                        }`}
                      >
                        Final Price
                      </th>
                    </React.Fragment>
                  );
                })}
              </tr>
            </thead>
            <tbody className="table-body-container">
              {event_pricing.map((elem, index) => {
                const { id, physical, virtual } = elem;
                return (
                  <React.Fragment key={index}>
                    <tr className="table-body-row-container">
                      <td
                        className="text-16-400 color-black-olive row-cell ps-2 pe-2 text-start"
                        rowSpan={event_mode === "Physical" ? 1 : 2}
                      >
                        {elem.category}
                      </td>
                      {["Hybrid", "Physical"].includes(event_mode) && (
                        <td className="text-16-500 color-black-olive row-cell ps-5 pe-5 text-start">
                          Physical
                        </td>
                      )}
                      {["Hybrid", "Physical"].includes(event_mode) &&
                        physical?.map((pElem, pIndex) => {
                          const isShow =
                            findCategory.find((o) => o.id === pElem.id)
                              ?.is_checked || user_type === "0";

                          const newOralPrice = isNational
                            ? pElem.oral
                            : (pElem.oral * inrPrice).toFixed(2);
                          const newPosterPrice = isNational
                            ? pElem.poster
                            : (pElem.poster * inrPrice).toFixed(2);

                          return (
                            <React.Fragment key={pIndex}>
                              <td
                                className={`row-cell ps-3 pe-2 text-start ${
                                  isShow ? "" : "d-none"
                                }`}
                              >
                                <div>
                                  {isEdit ? (
                                    <RadioInput
                                      id={`event_pricing-${id}-physical-${pElem.id}-oral`}
                                      label={`${
                                        isNational ? "₹" : "$"
                                      }${newOralPrice}`}
                                      className="pe-4"
                                      value="1"
                                      checked={priceArray.includes(
                                        `event_pricing-${id}-physical-${pElem.id}-oral`
                                      )}
                                      onChange={handelClick}
                                    />
                                  ) : (
                                    `${isNational ? "₹" : "$"}${newOralPrice}`
                                  )}
                                </div>
                              </td>
                              <td
                                className={`row-cell ps-3 pe-2 text-start ${
                                  isShow ? "" : "d-none"
                                }`}
                              >
                                <div>
                                  {isEdit ? (
                                    <RadioInput
                                      id={`event_pricing-${id}-physical-${pElem.id}-poster`}
                                      label={`${
                                        isNational ? "₹" : "$"
                                      }${newPosterPrice}`}
                                      className="pe-4"
                                      value="1"
                                      checked={priceArray.includes(
                                        `event_pricing-${id}-physical-${pElem.id}-poster`
                                      )}
                                      onChange={handelClick}
                                    />
                                  ) : (
                                    `${isNational ? "₹" : "$"}${newPosterPrice}`
                                  )}
                                </div>
                              </td>
                            </React.Fragment>
                          );
                        })}
                    </tr>
                    {["Hybrid", "Virtual"].includes(event_mode) && (
                      <tr className="table-body-row-container">
                        <td className="text-16-500 color-black-olive row-cell ps-5 pe-5 text-start">
                          Virtual
                        </td>
                        {virtual?.map((vElem, vIndex) => {
                          const isShow =
                            findCategory.find((o) => o.id === vElem.id)
                              ?.is_checked || user_type === "0";
                          const newOralPrice = isNational
                            ? vElem.oral
                            : (vElem.oral * inrPrice).toFixed(2);
                          const newPosterPrice = isNational
                            ? vElem.poster
                            : (vElem.poster * inrPrice).toFixed(2);
                          return (
                            <React.Fragment key={vIndex}>
                              <td
                                className={`row-cell ps-3 pe-2 text-start ${
                                  isShow ? "" : "d-none"
                                }`}
                              >
                                <div>
                                  {isEdit ? (
                                    <RadioInput
                                      id={`event_pricing-${id}-virtual-${vElem.id}-oral`}
                                      label={`${
                                        isNational ? "₹" : "$"
                                      }${newOralPrice}`}
                                      className="pe-4"
                                      value="1"
                                      checked={priceArray.includes(
                                        `event_pricing-${id}-virtual-${vElem.id}-oral`
                                      )}
                                      onChange={handelClick}
                                    />
                                  ) : (
                                    `${isNational ? "₹" : "$"}${newOralPrice}`
                                  )}
                                </div>
                              </td>
                              <td
                                className={`row-cell ps-3 pe-2 text-start ${
                                  isShow ? "" : "d-none"
                                }`}
                              >
                                <div>
                                  {isEdit ? (
                                    <RadioInput
                                      id={`event_pricing-${id}-virtual-${vElem.id}-poster`}
                                      label={`${
                                        isNational ? "₹" : "$"
                                      }${newPosterPrice}`}
                                      className="pe-4"
                                      value="1"
                                      checked={priceArray.includes(
                                        `event_pricing-${id}-virtual-${vElem.id}-poster`
                                      )}
                                      onChange={handelClick}
                                    />
                                  ) : (
                                    `${isNational ? "₹" : "$"}${newPosterPrice}`
                                  )}
                                </div>
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
      {add_on_pricing.length > 0 && (
        <>
          <div className="text-18-500 color-title-navy font-poppins mb-3 pt-3">
            Add On Pricing
          </div>
          <Table bordered>
            <thead className="table-header-container">
              <tr className="table-header-row-container">
                <th className="header-cell">Add On Categories</th>
                <th className="header-cell">Premium Members</th>
                <th className="header-cell">Non-Premium Members</th>
              </tr>
            </thead>
            <tbody className="table-body-container">
              {add_on_pricing.map((elem, index) => {
                const { id, category, premium_members, non_premium_members } =
                  elem;
                const newPremiumPrice = isNational
                  ? premium_members
                  : (premium_members * inrPrice).toFixed(2);
                const newNonPremiumPrice = isNational
                  ? non_premium_members
                  : (non_premium_members * inrPrice).toFixed(2);
                return (
                  <tr className="table-body-row-container" key={index}>
                    <td className="text-16-400 color-black-olive row-cell text-start ps-5 pe-2">
                      {category}
                    </td>
                    <td className="text-16-500 color-black-olive row-cell text-start ps-5 pe-2">
                      {isEdit ? (
                        <RadioInput
                          id={`add_on_pricing-${id}-premium_members`}
                          checked={addOnPriceArray.includes(
                            `add_on_pricing-${id}-premium_members`
                          )}
                          label={`${isNational ? "₹" : "$"}${newPremiumPrice}`}
                          className="pe-4"
                          value="1"
                          onChange={handelClick}
                        />
                      ) : (
                        `${isNational ? "₹" : "$"}${newPremiumPrice}`
                      )}
                    </td>
                    <td className="text-16-500 color-black-olive row-cell text-start ps-5 pe-2">
                      {isEdit ? (
                        <RadioInput
                          id={`add_on_pricing-${id}-non_premium_members`}
                          checked={addOnPriceArray.includes(
                            `add_on_pricing-${id}-non_premium_members`
                          )}
                          label={`${
                            isNational ? "₹" : "$"
                          }${newNonPremiumPrice}`}
                          className="pe-4"
                          value="1"
                          onChange={handelClick}
                        />
                      ) : (
                        `${isNational ? "₹" : "$"}${newNonPremiumPrice}`
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};
export default ViewRegistration;
