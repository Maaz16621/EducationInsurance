/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";


import { fetchLogoUrl } from "../../logoFetcher";

const AdminNavbar = (props) => {
  
    const [user, setUser] = useState(null);
  
    useEffect(() => {
        // Fetch user data from session
        const sessionData = sessionStorage.getItem("user");
        if (sessionData) {
            const userData = JSON.parse(sessionData);
            setUser(userData);
          

        }
    }, []);
    const userProfilePic = user ? user.profilePicUrl : null;
    const handleLogout = () => {
        // Clear session data
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isLoggedIn");
        // Redirect to login page
        window.location.href = "/login-page";
    };

      const [logoUrl, setLogoUrl] = useState("");
    useEffect(() => {
        fetchLogoUrl().then(logoUrl => {
            setLogoUrl(logoUrl);
            console.log(logoUrl); // Log the logo URL
        });
    }, []);
  return (
    <>
          <Navbar className="navbar-top navbar-dark" style={{ posistion: 'absolute' }} expand="lg" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-lg-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-lg-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                                      <img
                                          alt="User Profile"
                                          src={userProfilePic || require("../../assets/img/theme/team-4-800x800.jpg")}
                                      />
                  </span>
                                  <Media className="ml-2 d-none d-lg-block mr-5">
                                      <span className="mb-0 text-sm font-weight-bold">
                                          {user && user.username}
                                      </span>
                                  </Media>
                </Media>
              </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow mr-5 mt-5" style={{ zIndex: 999, position: 'absolute' }}>
                              <DropdownItem className="noti-title" header tag="div">
                                  <h6 className="text-overflow m-0">Welcome!</h6>
                              </DropdownItem>
                              <DropdownItem to="/admin/user-profile" tag={Link}>
                                  <i className="ni ni-single-02" />
                                  <span>My profile</span>
                              </DropdownItem>
                              <DropdownItem to="/admin/Settings" tag={Link}>
                                  <i className="ni ni-settings-gear-65" />
                                  <span>Settings</span>
                              </DropdownItem>

                              <DropdownItem divider />
                              <DropdownItem href="#pablo" onClick={handleLogout}>
                                  <i className="ni ni-user-run" />
                                  <span>Logout</span>
                              </DropdownItem>
                          </DropdownMenu>

            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
