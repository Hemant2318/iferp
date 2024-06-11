import React, { useEffect, useState } from "react";
import BootrsapTable from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import DatePicker from "components/form/DatePicker";
import Dropdown from "components/form/Dropdown";
import Button from "../../form/Button";
import Loader from "../Loader";
import { icons } from "utils/constants";
// import TableSearch from "./TableSearch";
import "./Table.scss";

const Table = ({
  header,
  rowData,
  searchInputChange,
  filterData,
  searchPayload,
  changeOffset,
  isLoading,
  hidePagination,
}) => {
  const [timer, setTimer] = useState("");
  const [searchObject, setSearchObject] = useState(searchPayload || {});
  const handelChangeInput = (e) => {
    let name = e.target.id;
    let value = e.target.value;
    setSearchObject({ ...searchObject, [name]: value });
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      searchInputChange({ ...searchObject, [name]: value });
    }, 800);
    setTimer(time);
  };
  useEffect(() => {
    setSearchObject(searchPayload || {});
  }, [searchPayload]);

  const totalPage = Math.ceil(filterData?.total / filterData?.limit);
  const activePage = filterData?.offset / filterData?.limit + 1;

  return (
    <div id="table-container" className="iferp-scroll">
      <BootrsapTable>
        <thead className="table-header-container">
          <tr className="header-container">
            {header.map((elem, index) => {
              return (
                <th key={index} className="column-block">
                  {elem.title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="table-body-container">
          {isLoading && (
            <tr className="loader-row">
              <td
                colSpan={header.length}
                className="loader-cell text-center color-gray"
              >
                <Loader />
              </td>
            </tr>
          )}
          {!isLoading && (
            <>
              {!hidePagination && (
                <tr className="filter-row-container">
                  {header.map((elem, index) => {
                    const {
                      isSearch,
                      isSearchDropdown,
                      isDatePicker,
                      searchInputName,
                      dropdownOptions,
                    } = elem;
                    return (
                      <td key={index} className="filter-row-block col-sm-auto">
                        {isSearch ? (
                          isSearchDropdown ? (
                            <Dropdown
                              placeholder="Select"
                              id={searchInputName}
                              value={searchObject[`${searchInputName}`]}
                              options={dropdownOptions.options}
                              optionKey={dropdownOptions?.key}
                              optionValue={dropdownOptions?.value}
                              onChange={handelChangeInput}
                              isSearchable={false}
                              isClearable
                            />
                          ) : isDatePicker ? (
                            <DatePicker
                              placeholder="Select Date"
                              id={elem.searchInputName}
                              onChange={handelChangeInput}
                              value={searchObject[`${elem.searchInputName}`]}
                              isLeftIcon
                              isClearable
                            />
                          ) : (
                            <>
                              <input
                                style={{ width: "100%" }}
                                placeholder="Search"
                                onChange={handelChangeInput}
                                id={elem.searchInputName}
                                value={searchObject[`${elem.searchInputName}`]}
                              />
                              <img
                                src={icons.search}
                                alt="search"
                                className="icon-block"
                              />
                            </>
                          )
                        ) : (
                          elem.searchLable
                        )}
                        {/* {elem.isSearch ? (
                          <TableSearch
                            id={searchInputName}
                            isDatePicker={isDatePicker}
                            optionKey={dropdownOptions?.key}
                            options={dropdownOptions?.options}
                            isSearchDropdown={isSearchDropdown}
                            optionValue={dropdownOptions?.value}
                            value={searchObject[`${searchInputName}`]}
                            onChange={handelChangeInput}
                            placeholder={
                              dropdownOptions?.placeholder || isDatePicker
                                ? "Select Date"
                                : isSearchDropdown
                                ? "Select Option"
                                : "Search"
                            }
                          />
                        ) : (
                          elem.searchLable
                        )} */}
                      </td>
                    );
                  })}
                </tr>
              )}

              {rowData.length === 0 ? (
                <tr className="no-record-found-row">
                  <td
                    colSpan={header.length}
                    className="no-record-found-cell text-center color-gray"
                  >
                    No Records Found.
                  </td>
                </tr>
              ) : (
                rowData.map((elem, index) => {
                  return (
                    <tr key={index} className="row-container">
                      {elem.data.map((cell, cellIndex) => {
                        return (
                          <td className="row-block" key={cellIndex}>
                            {cell.value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </>
          )}
        </tbody>
      </BootrsapTable>
      {totalPage > 1 && !isLoading && (
        <div className="row">
          <div className="col-md-4" />
          <div className="col-md-4 center-flex">
            <div className="d-flex gap-4 cmt-30 cpb-30">
              <Button
                icon={<i className="bi bi-chevron-left me-1" />}
                text="Previous"
                btnStyle={activePage === 1 ? "primary-gray" : "primary-dark"}
                className="cps-20 cpe-20"
                onClick={() => {
                  if (activePage !== 1) {
                    changeOffset(filterData?.offset - filterData?.limit);
                  }
                }}
                isRounded
              />
              <Button
                rightIcon={<i className="bi bi-chevron-right ms-2" />}
                text="Next"
                btnStyle={
                  activePage === totalPage ? "primary-gray" : "primary-dark"
                }
                // btnStyle="primary-dark"
                className="cps-40 cpe-30"
                onClick={() => {
                  if (activePage !== totalPage) {
                    changeOffset(filterData?.offset + filterData?.limit);
                  }
                }}
                isRounded
              />
            </div>
          </div>
          <div className="col-md-4 d-flex justify-content-end">
            <Pagination className="d-flex align-items-center unset-m">
              <div className="text-16-400 color-davys-gray me-1">Page</div>
              <Pagination.Item disabled>{activePage}</Pagination.Item>
              <div className="text-16-400 color-davys-gray ms-1 me-2">of</div>
              <Pagination.Item disabled>{totalPage}</Pagination.Item>
              {/* <Pagination.Item
                disabled={activePage === 1}
                onClick={() => {
                  changeOffset(filterData?.offset - filterData?.limit);
                }}
              >
                <i className="bi bi-chevron-left" />
              </Pagination.Item>
              <Pagination.Item
                disabled={activePage === totalPage}
                onClick={() => {
                  changeOffset(filterData?.offset + filterData?.limit);
                }}
              >
                <i className="bi bi-chevron-right" />
              </Pagination.Item> */}
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};
export default Table;
