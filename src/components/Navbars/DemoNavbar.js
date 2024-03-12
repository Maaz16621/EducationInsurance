import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Headroom from "headroom.js";
import { fetchLogoUrl } from "../../logoFetcher";

import {
    Navbar,
    NavbarBrand,
    UncontrolledCollapse,
    Container,
    Row,
    Col,
    Nav,
    NavLink,
} from "reactstrap";

const DemoNavbar = () => {
    const location = useLocation();
    const [collapseClasses, setCollapseClasses] = useState("");
    const [collapseOpen, setCollapseOpen] = useState(false);
   const [logoUrl, setLogoUrl] = useState("");

    useEffect(() => {
        fetchLogoUrl().then(logoUrl => {
            setLogoUrl(logoUrl);
            console.log(logoUrl); // Log the logo URL
        });
    }, []);

    useEffect(() => {
        let headroom = new Headroom(document.getElementById("navbar-main"));
        headroom.init();
    }, []);

    const onExiting = () => {
        setCollapseClasses("collapsing-out");
    };

    const onExited = () => {
        setCollapseClasses("");
    };

    const isHomePage = location.pathname === "/";

    return (
        <>
            <header className="header-global">
                <Navbar
                    className="navbar-main navbar-transparent navbar-light headroom"
                    expand="lg"
                    id="navbar-main"
                >
                    <Container>
                        <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                            <img alt="..." src={logoUrl} />
                        </NavbarBrand>
                        <button className="navbar-toggler" id="navbar_global">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <UncontrolledCollapse
                            toggler="#navbar_global"
                            navbar
                            className={collapseClasses}
                            onExiting={onExiting}
                            onExited={onExited}
                        >
                            <div className="navbar-collapse-header">
                                <Row>
                                    <Col className="collapse-brand" xs="6">
                                        <Link to="/">
                                            <img alt="..." src={logoUrl} />
                                        </Link>
                                    </Col>
                                    <Col className="collapse-close" xs="6">
                                        <button className="navbar-toggler" id="navbar_global">
                                            <span />
                                            <span />
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                            <Row >
                                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                    <NavLink to="/" className="nav-link" tag={Link}>
                                        Home
                                    </NavLink>
                                    {isHomePage && (
                                        <>
                                            <NavLink href="#about" className="nav-link">
                                                About
                                            </NavLink>
                                            <NavLink href="#contact" className="nav-link">
                                                Contact
                                            </NavLink>
                                        </>
                                    )}
                                    <NavLink to="/login-page" className="nav-link" tag={Link}>
                                        Login
                                    </NavLink>
                                    <NavLink to="/register-page" className="nav-link" tag={Link}>
                                        Register
                                    </NavLink>
                                </Nav>
                            </Row>
                        </UncontrolledCollapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default DemoNavbar;
