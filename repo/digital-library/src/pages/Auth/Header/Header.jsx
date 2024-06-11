// import { Button, DropdownOption } from "components";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import { icons } from "utils/constants";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
// import { Image } from "react-bootstrap";

const Header = () =>
  // { isAuthenticated }
  {
    const navigate = useNavigate();
    // let isActive = window.location.pathname.includes("conference");
    // const isAuthenticated = true;
    return (
      <>
        <Navbar expand="lg" className="bg-ffff bb-ebeb" sticky="top">
          <Container>
            <Navbar.Brand
              className="cme-30"
              href=""
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <img src={icons.newIferpLogo} alt="logo" className="pointer" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto nav_menu d-flex align-items-lg-center align-items-end gap-3">
                <Nav.Link
                  href=""
                  className={
                    window.location.pathname.includes("conference")
                      ? "active-link text-16-500"
                      : "text-16-500"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/conference");
                  }}
                >
                  Conference
                </Nav.Link>
                {/* <NavDropdown
                title="Contributors"
                id="basic-nav-dropdown"
                className="text-16-500 color-3d3d"
              >
                <NavDropdown.Item href="#action/3.1">
                  Contributors
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
              </NavDropdown> */}
                <Nav.Link
                  href=""
                  className={
                    window.location.pathname.includes("feed")
                      ? "active-link text-16-500"
                      : "text-16-500"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/discussions/feed");
                  }}
                >
                  Discussion
                </Nav.Link>
                {/* {isAuthenticated === true && <GlobalSearch />} */}
              </Nav>
              {/* {isAuthenticated ? (
              <div className="d-flex align-items-center gap-4">
                <div>
                  <img src={icons.notification} alt="n" />
                </div>

                <div>
                  <img src={icons.email} alt="n" />
                </div>
                <div className="d-flex align-items-center gap-2 position-relative">
                  <img src={icons.profileIferpLogo} alt="n" />
                  <DropdownOption
                    icons={<img src={icons.downArrow} alt="more" />}
                  >
                    <div className="cps-15 cpe-15 cpt-10 cpb-10">
                      <div
                        className="cpb-5 border-bottom row cmb-15 d-flex align-items-center pointer"
                        onClick={() => {
                          navigate("/organization-profile/profile");
                        }}
                      >
                        <div className="col-md-2">
                          <img src={icons.profileIcon} alt="profile" />
                        </div>
                        <div className="col-md-10 text-14-400">My Profile</div>
                      </div>
                      <div className="cpb-5 border-bottom row cmb-15 d-flex align-items-center">
                        <div className="col-md-2">
                          <img src={icons.savedIcon} alt="saved" />
                        </div>
                        <div className="col-md-10 text-14-400">Saved List</div>
                      </div>
                      <div className="cpb-5 border-bottom row cmb-15 d-flex align-items-center">
                        <div className="col-md-2">
                          <img src={icons.settingIcon} alt="setting" />
                        </div>
                        <div className="col-md-10 text-14-400">Settings</div>
                      </div>
                      <div className="cpb-5 row d-flex align-items-center">
                        <div className="col-md-2">
                          <img src={icons.logoutIcon} alt="logout" />
                        </div>
                        <div className="col-md-10 text-14-400">Log out</div>
                      </div>
                    </div>
                  </DropdownOption>
                </div>
                <div>
                  <div
                    style={{
                      backgroundColor: "#24B176",
                      border: "1px solid #24B176",
                      borderRadius: "4px",
                    }}
                    className="text-16-500 color-ffff cps-10 cpe-10 cpt-5 cpb-5 pointer"
                    onClick={() => {
                      navigate("/publish-new-post");
                    }}
                  >
                    <img src={icons.publish} alt="logout" />
                    <span>Publish</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fa-center gap-5">
                <div
                  className="text-16-500 color-3d3d pointer"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </div>
                <Button btnStyle="PD" btnText="Join Now" />
              </div>
            )} */}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  };
export default Header;
