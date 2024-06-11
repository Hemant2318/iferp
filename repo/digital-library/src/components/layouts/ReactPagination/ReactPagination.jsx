import ReactPaginate from "react-paginate";
import "./ReactPagination.scss";

const ReactPagination = ({ onPageChange, pageRangeDisplayed, pageCount }) => {
  return (
    <div className="pagination d-flex justify-content-center react-pagination">
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={onPageChange}
        pageRangeDisplayed={pageRangeDisplayed}
        pageCount={pageCount}
        previousLabel="< Prev"
        renderOnZeroPageCount={null}
        containerClassName={"pagination"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default ReactPagination;
