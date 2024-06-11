import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, filter, forEach, isEqual, unionBy } from "lodash";
import { Table } from "react-bootstrap";
import { map } from "lodash";
import Button from "components/form/Button";
import CheckBox from "components/form/CheckBox";
import TextInput from "components/form/TextInput";
import Loader from "components/Layout/Loader";
import { icons } from "utils/constants";
import { titleCaseString, trimAllSpace, trimLeftSpace } from "utils/helpers";
import {
  deleteAddOnPricing,
  deleteEventPricing,
  fetchEventPricing,
  showSuccess,
  updateEventPricing,
  updatePricingCategory,
} from "store/slices";
import "./Registration.scss";

const Registration = ({ hideButton, eventId, onHide, fetchEventDetails }) => {
  const dispatch = useDispatch();
  const { allMembershipList, send_to } = useSelector((state) => ({
    allMembershipList: state.global.membershipList,
    send_to: state.global.eventData.send_to || "",
  }));
  const membershipList = filter(allMembershipList, (e) =>
    send_to?.split(",").includes(e.id)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [categoryBtnLoading, setCategoryBtnLoading] = useState(false);
  const [deleteLoading, setDeleteBtnLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [oldData, setOldData] = useState(null);

  const [data, setData] = useState({
    pricing_categories: [
      {
        id: "",
        category: "",
      },
    ],
    event_pricing: [],
    add_on_pricing: [],
    dashboard_pricing_selection: [],
  });

  const updateCategory = async () => {
    setCategoryBtnLoading(true);
    let payload = data.pricing_categories?.map((elm) => {
      return { ...elm, event_id: eventId };
    });
    const resposne = await dispatch(
      updatePricingCategory({
        pricing_categories: payload,
      })
    );
    if (resposne.status === 200) {
      getPricing();
    }
    setCategoryBtnLoading(false);
  };

  const addCategory = (type) => {
    let oldData = cloneDeep(data);
    if (type === "pricing_categories") {
      oldData.pricing_categories = [
        ...oldData.pricing_categories,
        { id: "", category: "" },
      ];
    } else if (type === "event_pricing") {
      const categories = map(category, (el) => {
        return { ...el, oral: "", poster: "" };
      });

      oldData.event_pricing = [
        ...oldData.event_pricing,
        {
          id: "",
          physical: cloneDeep(categories),
          virtual: cloneDeep(categories),
        },
      ];
    } else if (type === "add_on_pricing") {
      oldData.add_on_pricing = [
        ...oldData.add_on_pricing,
        { id: "", category: "", premium_members: "", non_premium_members: "" },
      ];
    } else {
      // Nothing
    }
    setData(oldData);
  };

  const deleteCategory = async (type, index, id) => {
    let oldData = cloneDeep(data);
    setDeleteBtnLoading(`${type}_${index}`);
    if (type === "pricing_categories") {
      oldData.pricing_categories.splice(index, 1);
    } else if (type === "event_pricing") {
      if (id) {
        const resDelete = await dispatch(deleteEventPricing(id));
        if (resDelete.status === 200) {
          oldData.event_pricing.splice(index, 1);
        }
      } else {
        oldData.event_pricing.splice(index, 1);
      }
    } else if (type === "add_on_pricing") {
      if (id) {
        const resDelete = await dispatch(deleteAddOnPricing(id));
        if (resDelete.status === 200) {
          oldData.add_on_pricing.splice(index, 1);
        }
      } else {
        oldData.add_on_pricing.splice(index, 1);
      }
    } else {
      // Nothing
    }
    setDeleteBtnLoading("");
    setData(oldData);
  };

  const handelChangeInput = (e) => {
    const id = e.target.id;
    const sID = cloneDeep(id.split("-"));
    let value = trimLeftSpace(titleCaseString(e.target.value));
    let oldData = cloneDeep(data);

    if (sID[0] === "pricing_categories") {
      oldData.pricing_categories[sID[1]].category = value;
    } else if (sID[0] === "event_pricing") {
      if (sID.length > 2) {
        oldData.event_pricing[sID[1]][sID[2]][sID[3]][sID[4]] = trimAllSpace(
          value
        ).replace(/\D/g, "");
      } else {
        oldData.event_pricing[sID[1]].category = value;
      }
    } else if (sID[0] === "add_on_pricing") {
      if (sID[2] !== "category") {
        value = trimAllSpace(value.replace(/\D/g, ""));
      }
      oldData.add_on_pricing[sID[1]][sID[2]] = value;
    } else {
      // Nothing
    }

    setData(oldData);
  };

  const updatePrice = async (data) => {
    setIsBtnLoading(true);
    const isAddOnBtn = data.add_on_pricing.every(
      (o) => o.category && o.premium_members && o.non_premium_members
    );
    if (!isAddOnBtn) {
      data = { ...data, add_on_pricing: [] };
    }
    const payload = { ...data, event_id: eventId };
    const response = await dispatch(updateEventPricing(payload));
    if (response?.status === 200) {
      getPricing();
      if (fetchEventDetails) {
        fetchEventDetails();
      }
      const text = oldData?.event_pricing?.[0]?.category ? "update" : "add";
      dispatch(showSuccess(`Registration price ${text} successfully.`));
    }
    setIsBtnLoading(false);
  };

  const getData = (resData) => {
    // console.log(resData);
    const {
      pricing_categories,
      event_pricing: eventPricing,
      add_on_pricing,
      dashboard_pricing_selection,
    } = resData;
    let event_pricing = eventPricing?.map((el) => {
      return {
        ...el,
        physical: el?.physical || [],
        virtual: el?.virtual || [],
      };
    });
    const categories = map(pricing_categories, (el) => {
      return { ...el, oral: "", poster: "" };
    });
    const memberList = map(membershipList, (elem) => {
      const findData =
        dashboard_pricing_selection.find((o) => isEqual(o.id + "", elem.id))
          ?.data || [];
      const newfindData = unionBy(
        findData,
        pricing_categories.map((el) => ({ ...el, is_checked: false })),
        "id"
      );
      return {
        ...elem,
        data:
          newfindData.length > 0
            ? newfindData
            : map(pricing_categories, (el) => {
                return { ...el, is_checked: false };
              }),
      };
    });
    const dataWithOralPosterPrice = [
      {
        id: "",
        category: "",
        physical: cloneDeep(categories),
        virtual: cloneDeep(categories),
      },
    ];

    let setList =
      event_pricing.length > 0 ? event_pricing : dataWithOralPosterPrice;

    if (event_pricing.length > 0) {
      if (categories.length !== event_pricing[0]?.physical.length) {
        let diff = categories.length - event_pricing[0]?.physical.length;

        if (diff > 0) {
          // let arr = Array.apply(null, Array(diff)).map(() => ({
          //   id: "",
          //   category: "",
          //   oral: "",
          //   poster: "",
          // }));
          let arr = [];
          categories.forEach((ele) => {
            event_pricing[0]?.physical.forEach((phyEle) => {
              if (ele.category !== phyEle.category) {
                arr.push(ele);
              }
            });
          });

          setList = setList.map((elm) => {
            return {
              ...elm,
              physical: cloneDeep([...elm.physical, ...arr]),
              virtual: cloneDeep([...elm.virtual, ...arr]),
            };
          });
        } else if (diff < 0) {
          setList = setList.map((elm) => {
            return {
              ...elm,
              physical: cloneDeep(
                elm.physical.splice(-diff, elm.physical.length - 1)
              ),
              virtual: cloneDeep(
                elm.virtual.splice(-diff, elm.virtual.length - 1)
              ),
            };
          });
        } else {
          // Nothing
        }
      }
    }
    const newData = {
      ...data,
      pricing_categories:
        pricing_categories?.length > 0
          ? pricing_categories
          : [{ id: "", category: "" }],
      event_pricing: setList,
      add_on_pricing:
        add_on_pricing.length > 0
          ? add_on_pricing
          : [
              {
                id: "",
                category: "",
                premium_members: "",
                non_premium_members: "",
              },
            ],
      dashboard_pricing_selection: memberList,
    };
    setData(newData);
    setOldData(newData);
    setIsLoading(false);
  };

  const getPricing = async () => {
    const response = await dispatch(fetchEventPricing({ event_id: eventId }));
    const resData = response?.data;
    if (resData) {
      const { pricing_categories } = response.data;
      setCategory(pricing_categories);
      getData(resData);
    }
  };

  useEffect(() => {
    getPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    pricing_categories: pricingCategories,
    event_pricing: eventPricing,
    add_on_pricing: addOnPricing,
    dashboard_pricing_selection: dashboardPricingSelection,
  } = data;
  const isPriceBtn = pricingCategories.every((o) => o.category);
  const isAddOnBtn = addOnPricing.every(
    (o) => o.category && o.premium_members && o.non_premium_members
  );
  let isEventBtn = true;
  forEach(eventPricing, (elm) => {
    if (
      !elm.category ||
      elm.physical.some((o) => !o.oral || !o.poster) ||
      elm.virtual.some((o) => !o.oral || !o.poster)
    ) {
      isEventBtn = false;
    }
  });
  let isAnyCheck = false;
  forEach(dashboardPricingSelection, (o) => {
    forEach(o.data, (c) => {
      if (c.is_checked) {
        isAnyCheck = true;
      }
    });
  });

  const isCategory =
    pricingCategories && pricingCategories[0]?.id ? true : false;
  const isbtnEnable = isEqual(oldData, data) || !isEventBtn || !isAnyCheck;
  const isCategoryBtn = pricingCategories?.every((o) => !o.category);
  return (
    <>
      {isLoading ? (
        <div className="cpt-80 cpb-80">
          <Loader size="md" />
        </div>
      ) : (
        <div id="common-registration-block">
          <div className="text-18-500 color-black-olive mb-3 cpt-20">
            Pricing Categories
          </div>
          {pricingCategories.map((elem, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-xl-6 col-md-6 cmb-22">
                  <TextInput
                    label={`Pricing Category ${index + 1}`}
                    id={`pricing_categories-${index}`}
                    placeholder="Enter Price Category"
                    onChange={handelChangeInput}
                    value={elem.category}
                  />
                </div>
                <div className="col-xl-6 col-md-6 d-flex align-items-end cmb-22">
                  {pricingCategories.length > 1 && (
                    <Button
                      isSquare
                      btnStyle="primary-gray"
                      text="Delete"
                      className="pt-2 pb-2 ps-3 pe-3"
                      icon={
                        <img
                          src={icons.deleteIcon}
                          alt="delete"
                          className="h-21 me-3"
                        />
                      }
                      onClick={() => {
                        deleteCategory("pricing_categories", index);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          <div className="d-flex gap-3">
            <Button
              text={isCategory ? "Update" : "Add"}
              btnStyle="primary-dark"
              className="text-15-500 ps-3 pe-3"
              disabled={
                isCategory
                  ? isEqual(pricingCategories, category)
                  : isCategoryBtn
              }
              onClick={updateCategory}
              btnLoading={categoryBtnLoading}
            />
            <Button
              text="+ Add Another Category"
              btnStyle="primary-light"
              className="text-15-500 ps-3 pe-3"
              onClick={() => {
                addCategory("pricing_categories");
              }}
              disabled={!isPriceBtn}
            />
          </div>
          {isCategory && (
            <>
              <div className="text-18-500 color-black-olive mb-3 cpt-30">
                Event Pricing
              </div>
              <Table bordered responsive className="mb-0">
                <thead className="table-header-container">
                  <tr className="table-header-row-container">
                    <th className="header-cell">Registration Categories</th>
                    <th className="header-cell" />
                    {category.map((elem, index) => {
                      return (
                        <th className="header-cell" key={index}>
                          {elem.category}
                        </th>
                      );
                    })}
                    {eventPricing.length > 1 && <th className="header-cell" />}
                  </tr>
                </thead>
                <tbody className="table-body-container">
                  {eventPricing.map((elem, index) => {
                    const { physical, virtual } = elem;
                    return (
                      <React.Fragment key={index}>
                        <tr className="table-body-row-container">
                          <td
                            className="text-14-400 color-black-olive row-cell ps-2 pe-2"
                            rowSpan={2}
                          >
                            <TextInput
                              id={`event_pricing-${index}`}
                              onChange={handelChangeInput}
                              placeholder="Enter Category"
                              value={elem.category}
                            />
                          </td>
                          <td className="text-16-500 color-black-olive row-cell ps-5 pe-5">
                            Physical
                          </td>
                          {physical.map((pElem, pIndex) => {
                            return (
                              <td className="row-cell ps-2 pe-2" key={pIndex}>
                                <div className="d-flex gap-2">
                                  <TextInput
                                    id={`event_pricing-${index}-physical-${pIndex}-oral`}
                                    placeholder="Early Bird Price"
                                    onChange={handelChangeInput}
                                    value={pElem.oral}
                                  />
                                  <TextInput
                                    id={`event_pricing-${index}-physical-${pIndex}-poster`}
                                    placeholder="Final Price"
                                    onChange={handelChangeInput}
                                    value={pElem.poster}
                                  />
                                </div>
                              </td>
                            );
                          })}
                          {eventPricing.length > 1 && (
                            <td
                              className="text-14-400 color-black-olive row-cell ps-2 pe-2"
                              rowSpan={2}
                            >
                              <Button
                                isSquare
                                btnStyle="light-outline"
                                className="pt-1 pb-1 ps-2 pe-2 h-35"
                                icon={
                                  deleteLoading === `event_pricing${index}` ? (
                                    ""
                                  ) : (
                                    <img
                                      src={icons.deleteIcon}
                                      alt="delete"
                                      className="h-21"
                                    />
                                  )
                                }
                                onClick={() => {
                                  deleteCategory(
                                    "event_pricing",
                                    index,
                                    elem.id
                                  );
                                }}
                                btnLoading={
                                  deleteLoading === `event_pricing_${index}`
                                }
                              />
                            </td>
                          )}
                        </tr>
                        <tr className="table-body-row-container">
                          <td className="text-16-500 color-black-olive row-cell ps-5 pe-5">
                            Virtual
                          </td>
                          {virtual.map((vElem, vIndex) => {
                            return (
                              <td className="row-cell ps-2 pe-2" key={vIndex}>
                                <div className="d-flex gap-2">
                                  <TextInput
                                    id={`event_pricing-${index}-virtual-${vIndex}-oral`}
                                    placeholder="Early Bird Price"
                                    onChange={handelChangeInput}
                                    value={vElem.oral}
                                  />
                                  <TextInput
                                    id={`event_pricing-${index}-virtual-${vIndex}-poster`}
                                    placeholder="Final Price"
                                    onChange={handelChangeInput}
                                    value={vElem.poster}
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>
              <div className="d-flex mt-2">
                <Button
                  text="+ Add Another Category"
                  btnStyle="primary-light"
                  className="text-15-500 ps-3 pe-3"
                  disabled={!isEventBtn}
                  onClick={() => {
                    addCategory("event_pricing");
                  }}
                />
              </div>

              <div className="text-18-500 color-black-olive mb-3 cpt-30">
                Add On Pricing
              </div>
              <Table bordered>
                <thead className="table-header-container">
                  <tr className="table-header-row-container">
                    <th className="header-cell">Add On Categories</th>
                    <th className="header-cell">Premium Members</th>
                    <th className="header-cell">Non-Premium Members</th>
                    {addOnPricing.length > 1 && <th className="header-cell" />}
                  </tr>
                </thead>
                <tbody className="table-body-container">
                  {addOnPricing.map((elem, index) => {
                    const { category, premium_members, non_premium_members } =
                      elem;
                    return (
                      <tr className="table-body-row-container" key={index}>
                        <td className="text-14-400 color-black-olive row-cell ps-2 pe-2">
                          <TextInput
                            id={`add_on_pricing-${index}-category`}
                            onChange={handelChangeInput}
                            placeholder="Enter Add ons Category"
                            value={category}
                          />
                        </td>
                        <td className="text-14-400 color-black-olive row-cell ps-2 pe-2">
                          <TextInput
                            id={`add_on_pricing-${index}-premium_members`}
                            onChange={handelChangeInput}
                            placeholder="Enter Price"
                            value={premium_members}
                          />
                        </td>
                        <td className="text-14-400 color-black-olive row-cell ps-2 pe-2">
                          <TextInput
                            id={`add_on_pricing-${index}-non_premium_members`}
                            onChange={handelChangeInput}
                            placeholder="Enter Price"
                            value={non_premium_members}
                          />
                        </td>

                        {addOnPricing.length > 1 && (
                          <td className="text-14-400 color-black-olive row-cell ps-2 pe-2">
                            <Button
                              isSquare
                              btnStyle="light-outline"
                              className="pt-1 pb-1 ps-2 pe-2 h-35"
                              icon={
                                deleteLoading === `add_on_pricing_${index}` ? (
                                  ""
                                ) : (
                                  <img
                                    src={icons.deleteIcon}
                                    alt="delete"
                                    className="h-21"
                                  />
                                )
                              }
                              onClick={() => {
                                deleteCategory(
                                  "add_on_pricing",
                                  index,
                                  elem.id
                                );
                              }}
                              btnLoading={
                                deleteLoading === `add_on_pricing_${index}`
                              }
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <div className="d-flex">
                <Button
                  text="+ Add Another Category"
                  btnStyle="primary-light"
                  className="text-15-500 ps-3 pe-3"
                  disabled={!isAddOnBtn}
                  onClick={() => {
                    addCategory("add_on_pricing");
                  }}
                />
              </div>

              <div className="text-18-500 color-black-olive mb-3 cpt-30">
                Dashboard Pricing Selection
              </div>
              <Table bordered>
                <thead className="table-header-container">
                  <tr className="table-header-row-container">
                    <th className="header-cell">Registration Categories</th>

                    {category.map((elem, index) => {
                      return (
                        <th className="header-cell" key={index}>
                          {elem.category}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="table-body-container">
                  <tr className="table-body-row-container">
                    <td className="text-14-400 color-black-olive row-cell ps-2 pe-2">
                      ALL
                    </td>
                    {category.map((elem, index) => {
                      let isSelectALL = true;
                      dashboardPricingSelection?.forEach((p) => {
                        p?.data?.forEach((c) => {
                          if (elem?.id === c?.id) {
                            if (!c?.is_checked) {
                              isSelectALL = false;
                            }
                          }
                        });
                      });
                      return (
                        <td
                          className="text-14-400 color-black-olive row-cell"
                          key={index}
                        >
                          <div className="center-flex">
                            <CheckBox
                              className="checkbox-size-24"
                              type="ACTIVE"
                              onClick={() => {
                                let oldData = cloneDeep(data);
                                oldData.dashboard_pricing_selection.map((p) => {
                                  let newP = p;
                                  newP.data = p.data.map((c) => {
                                    let newC = c;
                                    if (c.id === elem.id) {
                                      newC.is_checked = !isSelectALL;
                                    }
                                    return newC;
                                  });
                                  return newP;
                                });
                                // console.log(
                                //   oldData.dashboard_pricing_selection
                                // );
                                // oldData.dashboard_pricing_selection[
                                //   index
                                // ].data[cIndex].is_checked =
                                //   !cElem.is_checked;
                                setData(oldData);
                              }}
                              isChecked={isSelectALL}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {dashboardPricingSelection.map((elem, index) => {
                    return (
                      <tr className="table-body-row-container" key={index}>
                        <td className="text-14-400 color-black-olive row-cell ps-2 pe-2">
                          {elem.name}
                        </td>
                        {elem?.data.map((cElem, cIndex) => {
                          return (
                            <td
                              className="text-14-400 color-black-olive row-cell"
                              key={cIndex}
                            >
                              <div className="center-flex">
                                <CheckBox
                                  className="checkbox-size-24"
                                  type="PRIMARY-ACTIVE"
                                  onClick={() => {
                                    let oldData = cloneDeep(data);

                                    oldData.dashboard_pricing_selection[
                                      index
                                    ].data[cIndex].is_checked =
                                      !cElem.is_checked;
                                    setData(oldData);
                                  }}
                                  isChecked={cElem.is_checked}
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {!hideButton && (
                <div className="d-flex justify-content-center gap-4 cmt-40">
                  <Button
                    isRounded
                    text="Cancel"
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={() => {
                      setData(oldData);
                    }}
                  />
                  <Button
                    isRounded
                    text="Done"
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    btnLoading={isBtnLoading}
                    disabled={isbtnEnable}
                    onClick={() => {
                      updatePrice(data);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Registration;
