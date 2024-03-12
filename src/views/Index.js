/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "../components/Footers/SimpleFooter.js";


class Index extends React.Component {
    state = {
        title: '',
        logo: ''
    };

    componentDidMount() {
      
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
      this.refs.main.scrollTop = 0;

  }

  render() {
    return (
      <>
            <DemoNavbar />
            <main id="home"  ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped pb-250">
              <div className="shape shape-style-1 shape-default">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
                        <Container  className="py-lg-md d-flex">
                <div className="col px-0">
                  <Row>
                                    <Col lg="6">
                                        <h1 className="display-3 text-white">
                                            Education Insurance App{" "}
                                            <span>for a Secure Future</span>
                                        </h1>
                                        <p className="lead text-white">
                                            Secure your child's future with our Education Insurance App. It comes with a range of features to help you plan and manage your child's education expenses, ensuring a bright and secure future.
                                        </p>
                                        <div className="btn-wrapper">
                                            <Button
                                                className="btn-icon mb-3 mb-sm-0"
                                                to="/login-page" tag={Link}
                                                color="info"
                                            >
                                              
                                                <span className="btn-inner--text">Login</span>
                                            </Button>
                                           
                                        </div>
                                    </Col>
                                    <Col lg="6">
                                        <img
                                            alt="..."
                                            className="img-fluid floating"
                                            src={require("assets/img/theme/undraw_education_f8ru.png")}
                                        />
                                    </Col>

                  </Row>
                </div>
              </Container>
              {/* SVG separator */}
              <div className="separator separator-bottom separator-skew">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="fill-white"
                    points="2560 0 2560 100 0 100"
                  />
                </svg>
              </div>
            </section>
            {/* 1st Hero Variation */}
          </div>
          <section className="section section-lg pt-lg-0 mt--200">
            <Container>
              <Row className="justify-content-center">
                <Col lg="12">
                                <Row className="row-grid">
                                    <Col lg="4">
                                        <Card className="card-lift--hover shadow border-0">
                                            <CardBody className="py-5">
                                                <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                                                    <i className="ni ni-check-bold" />
                                                </div>
                                                <h6 className="text-primary text-uppercase">
                                                    Education Insurance Coverage
                                                </h6>
                                                <p className="description mt-3">
                                                    Our Education Insurance App offers comprehensive coverage for your child's education expenses, ensuring financial security and peace of mind.
                                                </p>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg="4">
                                        <Card className="card-lift--hover shadow border-0">
                                            <CardBody className="py-5">
                                                <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                                                    <i className="ni ni-istanbul" />
                                                </div>
                                                <h6 className="text-success text-uppercase">
                                                    Flexible Payment Options
                                                </h6>
                                                <p className="description mt-3">
                                                    Our Education Insurance App offers flexible payment options, allowing you to choose a plan that fits your budget and financial goals.
                                                </p>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg="4">
                                        <Card className="card-lift--hover shadow border-0">
                                            <CardBody className="py-5">
                                                <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                                                    <i className="ni ni-planet" />
                                                </div>
                                                <h6 className="text-warning text-uppercase">
                                                    Easy Claim Process
                                                </h6>
                                                <p className="description mt-3">
                                                    Our Education Insurance App offers an easy claim process, ensuring quick and hassle-free reimbursement for education-related expenses.
                                                </p>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                </Col>
              </Row>
            </Container>
          </section>
                <section className="section section-lg" id="about">
                    <Container>
                        <Row className="row-grid align-items-center">
                            <Col className="order-md-2" md="6">
                                <img
                                    alt="..."
                                    className="img-fluid floating"
                                    src={require("assets/img/theme/growth.png")}
                                />
                            </Col>
                            <Col className="order-md-1" md="6">
                                <div className="pr-md-5">
                                    <div className="icon icon-lg icon-shape icon-shape-success shadow rounded-circle mb-5">
                                        <i className="ni ni-money-coins" />
                                    </div>
                                    <h3>Empower Your Child's Future</h3>
                                    <p>
                                        Our Education Insurance App is designed to empower your child's future. With a range of features and benefits, you can rest assured that your child's education expenses are taken care of.
                                    </p>
                                    <ul className="list-unstyled mt-5">
                                        <li className="py-2">
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <Badge
                                                        className="badge-circle mr-3"
                                                        color="success"
                                                    >
                                                        <i className="ni ni-money-coins" />
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">
                                                        Comprehensive Coverage
                                                    </h6>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="py-2">
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <Badge
                                                        className="badge-circle mr-3"
                                                        color="success"
                                                    >
                                                        <i className="ni ni-credit-card" />
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">Flexible Payment Options</h6>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="py-2">
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <Badge
                                                        className="badge-circle mr-3"
                                                        color="success"
                                                    >
                                                        <i className="ni ni-support-16" />
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">
                                                        Dedicated Support Team
                                                    </h6>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Container>


          </section>
          <section className="section bg-secondary">
                    <Container>
                        <Row className="row-grid align-items-center">
                            <Col md="6">
                                <Card className="bg-default shadow border-0">
                                    <CardImg
                                        alt="..."
                                        src={require("assets/img/theme/img-1-1200x1000.jpg")}
                                        top
                                    />
                                    <blockquote className="card-blockquote">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="svg-bg"
                                            preserveAspectRatio="none"
                                            viewBox="0 0 583 95"
                                        >
                                            <polygon
                                                className="fill-default"
                                                points="0,52 583,95 0,95"
                                            />
                                            <polygon
                                                className="fill-default"
                                                opacity=".2"
                                                points="0,42 583,95 683,0 0,95"
                                            />
                                        </svg>
                                        <h4 className="display-3 font-weight-bold text-white">
                                            Transform Your Child's Future
                                        </h4>
                                        <p className="lead text-italic text-white">
                                            Our Education Insurance App is designed to transform your child's future. With a range of features and benefits, you can rest assured that your child's education expenses are taken care of.
                                        </p>
                                    </blockquote>
                                </Card>
                            </Col>
                            <Col md="6">
                                <div className="pl-md-5">
                                    <div className="icon icon-lg icon-shape icon-shape-warning shadow rounded-circle mb-5">
                                        <i className="ni ni-money-coins" />
                                    </div>
                                    <h3>Secure Your Child's Future</h3>
                                    <p className="lead">
                                        Our Education Insurance App is designed to secure your child's future. With a range of features and benefits, you can rest assured that your child's education expenses are taken care of.
                                    </p>
                                    <p>
                                        Our app provides comprehensive coverage for your child's education expenses, including tuition fees, books, and other educational materials. With flexible payment options, you can choose a plan that suits your budget and needs.
                                    </p>
                                    <p>
                                        Our dedicated support team is available to assist you with any questions or concerns you may have. We are committed to providing the best possible service to ensure that your child's education is secure and protected.
                                    </p>
                                    <a
                                        className="font-weight-bold text-warning mt-5"
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Learn more about our Education Insurance App
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Container>

          </section>
          <section className="section pb-0 mb-5 bg-gradient-warning">
            <Container>
              <Row className="row-grid align-items-center">
                <Col className="order-lg-2 ml-lg-auto" md="6">
                  <div className="position-relative pl-md-5">
                    <img
                      alt="..."
                      className="img-center img-fluid"
                      src={require("assets/img/theme/process.png")}
                    />
                  </div>
                </Col>
                            <Col className="order-lg-1" lg="6">
                                <Card className="shadow shadow-lg--hover mt-5">
                                    <CardBody>
                                        <div className="d-flex px-3">
                                            <div>
                                                <div className="icon icon-shape bg-gradient-info rounded-circle text-white">
                                                    <i className="ni ni-satisfied" />
                                                </div>
                                            </div>
                                            <div className="pl-4">
                                                <h5 className="title text-info">
                                                    Comprehensive Coverage
                                                </h5>
                                                <p>
                                                    Our Education Insurance App provides comprehensive coverage for your child's education expenses, including tuition fees, books, and other educational materials. With flexible payment options, you can choose a plan that suits your budget and needs.
                                                </p>
                                            
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card className="shadow shadow-lg--hover mt-5">
                                    <CardBody>
                                        <div className="d-flex px-3">
                                            <div>
                                                <div className="icon icon-shape bg-gradient-success rounded-circle text-white">
                                                    <i className="ni ni-satisfied" />
                                                </div>
                                            </div>
                                            <div className="pl-4">
                                                <h5 className="title text-success">
                                                    Flexible Payment Options
                                                </h5>
                                                <p>
                                                    Our Education Insurance App offers flexible payment options, allowing you to choose a plan that suits your budget and needs. With easy online payment options, you can manage your payments conveniently.
                                                </p>
                                            
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card className="shadow shadow-lg--hover mt-5">
                                    <CardBody>
                                        <div className="d-flex px-3">
                                            <div>
                                                <div className="icon icon-shape bg-gradient-warning rounded-circle text-white">
                                                    <i className="ni ni-active-40" />
                                                </div>
                                            </div>
                                            <div className="pl-4">
                                                <h5 className="title text-warning">
                                                    Dedicated Support Team
                                                </h5>
                                                <p>
                                                    Our dedicated support team is available to assist you with any questions or concerns you may have. We are committed to providing the best possible service to ensure that your child's education is secure and protected.
                                                </p>
                                               
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>

              </Row>
            </Container>
            {/* SVG separator */}
                    <div className="separator separator-bottom separator-skew zindex-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 150" // Increased height to 200
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="fill-white"
                                points="2560 0 2560 200 0 200" // Adjusted points to match the increased height
                            />
                        </svg>
                    </div>

          </section>
        
                <section className="section section-lg pt-lg pb-300 bg-gradient-default">
                    {/* SVG separator */}
                    <div className="separator separator-bottom separator-skew zindex-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 50"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="fill-white"
                                points="2560 0 2560 100 0 100"
                            />
                        </svg>
                    </div>
                </section>
                <section id="contact"  className="section section-lg pt-lg-0 section-contact-us">
                    <Container>
                        <Row className="justify-content-center mt--300">
                            <Col lg="8">
                                <h2 className="text-center text-white mb-5">Contact Us</h2> {/* Add this line */}
                                <Card className="bg-gradient-secondary shadow">
                                    <CardBody className="p-lg-5">
                                        <h4 className="mb-1">Want to work with us?</h4>
                                        <p className="mt-0">
                                            Your project is very important to us.
                                        </p>
                                        <FormGroup
                                            className={classnames("mt-5", {
                                                focused: this.state.nameFocused,
                                            })}
                                        >
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-user-run" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Your name"
                                                    type="text"
                                                    onFocus={(e) =>
                                                        this.setState({ nameFocused: true })
                                                    }
                                                    onBlur={(e) =>
                                                        this.setState({ nameFocused: false })
                                                    }
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup
                                            className={classnames({
                                                focused: this.state.emailFocused,
                                            })}
                                        >
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-email-83" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Email address"
                                                    type="email"
                                                    onFocus={(e) =>
                                                        this.setState({ emailFocused: true })
                                                    }
                                                    onBlur={(e) =>
                                                        this.setState({ emailFocused: false })
                                                    }
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup className="mb-4">
                                            <Input
                                                className="form-control-alternative"
                                                cols="80"
                                                name="name"
                                                placeholder="Type a message..."
                                                rows="4"
                                                type="textarea"
                                            />
                                        </FormGroup>
                                        <div>
                                            <Button
                                                block
                                                className="btn-round"
                                                color="default"
                                                size="lg"
                                                type="button"
                                            >
                                                Send Message
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>

            </main>
            <SimpleFooter />
      </>
    );
  }
}

export default Index;
