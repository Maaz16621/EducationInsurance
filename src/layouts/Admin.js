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
import React, { useState, useEffect, } from "react";
import { useLocation, redirect, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import { fetchLogoUrl } from "../logoFetcher";

import routes from "routes.js";

const UserPanel = (props) => {
  
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

    const [logoUrl, setLogoUrl] = useState("");
    useEffect(() => {
        fetchLogoUrl().then(logoUrl => {
            setLogoUrl(logoUrl);
            console.log(logoUrl); // Log the logo URL
        });
    }, []);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/userpanel") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = '/login-page';
        }
    }, []);


  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
            innerLink: "/admin/index",
            imgSrc: logoUrl,
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/userpanel/index" replace />} />
        </Routes>
        <Container fluid>
         
        </Container>
      </div>
    </>
  );
};

export default UserPanel;
