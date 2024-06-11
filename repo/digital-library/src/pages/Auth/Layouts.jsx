import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import "./Layouts.scss";

const Layouts = ({ children, id, isAuthenticated }) => {
  return (
    <div id="layout-container">
      <Header isAuthenticated={isAuthenticated} />
      <main className="main-body-content">
        <div id={id}>{children}</div>
        <Footer />
      </main>
    </div>
  );
};

export default Layouts;
