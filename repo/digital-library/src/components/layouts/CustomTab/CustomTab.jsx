import "./CustomTab.scss";

const CustomTab = ({ options = [], active, activeTabClassName }) => {
  return (
    <div id="custom-tab-container">
      {options?.map((elm, index) => {
        return (
          <div
            key={index}
            className={`tab-block ${
              active === elm?.activeText
                ? activeTabClassName
                  ? "active-tab-discussion"
                  : "active-tab"
                : "inactive-tab"
            }`}
            onClick={elm?.onClick}
          >
            {elm?.title}
          </div>
        );
      })}
    </div>
  );
};

export default CustomTab;
