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
import React, { useState, useEffect } from "react";

// reactstrap components
import {Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
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

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [cnic, setCnic] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log the data before sending it to the server
        console.log({
            username: username,
            email: email,
            cnic: cnic,
            password: password,
        });

        fetch('http://localhost/insurance/api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: username,
                email: email,
                cnic: cnic,
                password: password,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    // Show success alert
                    setAlert({ type: 'success', message: data.message });
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/login-page';
                    }, 4000);
                } else {
                    // Show error alert
                    setAlert({ type: 'error', message: data.message });
                }
            })
            .catch((resonse) => {
                console.error('Error:', resonse);
                // Show error alert
                setAlert({ type: 'error', message: 'An error occurred while processing your request.' });
            });
    };

    return (
        <>
            <DemoNavbar />
            <main>
                <section className="section section-shaped section-lg">
                    <div className="shape shape-style-1 bg-gradient-default">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    {alert && (
                        <Alert className={`alert-${alert.type}`} style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                            <strong>{alert.type === 'success' ? 'Success!' : 'Error!'}</strong> {alert.message}
                        </Alert>
                    )}
                    <Container className="pt-lg-7">
                        <Row className="justify-content-center">
                            <Col lg="5">
                                <Card className="bg-secondary shadow border-0">
                                    <CardHeader className="bg-white pb-5">
                                        <div className="text-muted text-center mb-3">
                                            <small>Sign up with</small>
                                        </div>
                                        <div className="text-center">
                                            <Button
                                                className="btn-neutral btn-icon mr-4"
                                                color="default"
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <span className="btn-inner--icon mr-1">
                                                    <img
                                                        alt="..."
                                                        src={
                                                            require("assets/img/icons/common/github.svg")
                                                                .default
                                                        }
                                                    />
                                                </span>
                                                <span className="btn-inner--text">Github</span>
                                            </Button>
                                            <Button
                                                className="btn-neutral btn-icon ml-1"
                                                color="default"
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <span className="btn-inner--icon mr-1">
                                                    <img
                                                        alt="..."
                                                        src={
                                                            require("assets/img/icons/common/google.svg")
                                                                .default
                                                        }
                                                    />
                                                </span>
                                                <span className="btn-inner--text">Google</span>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <div className="text-center text-muted mb-4">
                                            <small>Or sign up with credentials</small>
                                        </div>
                                        <Form role="form" onSubmit={handleSubmit}>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative mb-3">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-hat-3" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative mb-3">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-email-83" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative mb-3">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-badge" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input placeholder="CNIC" type="text" value={cnic} onChange={(e) => setCnic(e.target.value)} />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-lock-circle-open" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input placeholder="Password" type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                </InputGroup>
                                            </FormGroup>
                                            <div className="text-muted font-italic">
                                                <small>
                                                    password strength:{" "}
                                                    <span className="text-success font-weight-700">
                                                        strong
                                                    </span>
                                                </small>
                                            </div>
                                            <Row className="my-4">
                                                <Col xs="12">
                                                    <div className="custom-control custom-control-alternative custom-checkbox">
                                                        <input
                                                            className="custom-control-input"
                                                            id="customCheckRegister"
                                                            type="checkbox"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="customCheckRegister"
                                                        >
                                                            <span>
                                                                I agree with the{" "}
                                                                <a
                                                                    href="#pablo"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    Privacy Policy
                                                                </a>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="text-center">
                                                <Button
                                                    className="mt-4"
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    Create account
                                                </Button>
                                            </div>
                                        </Form>
                                       
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </main>
        </>
    );
}

export default Register;