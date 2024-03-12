import { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Container,
    Row,
    Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";

const Settings = () => {
    const [websiteData, setWebsiteData] = useState(null);
    const [logo, setLogo] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchWebsiteData();
    }, []);

    const fetchWebsiteData = () => {
        fetch('http://localhost/insurance/api/settings.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setWebsiteData(data);
                console.log(websiteData);
            })
            .catch(error => {
                console.error('There was a problem fetching website data:', error);
                setAlert({ type: 'error', message: 'Failed to fetch website data' });
                setTimeout(() => {
                    setAlert(null); // Clear alert after 5 seconds
                }, 5000); // 5000 milliseconds = 5 seconds
            });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
    };

    const handleUploadClick = () => {
        document.getElementById('logoInput').click();
    };

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('title', document.getElementById('input-title').value);
        formData.append('description', document.getElementById('input-description').value);
        if (logo) {
            formData.append('logo', logo);
        }

        fetch('http://localhost/insurance/api/updateWebsite.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Receive response as text
            })
            .then(data => {
                console.log('Website data updated successfully:', data);
                setAlert({ type: 'success', message: 'Website data updated successfully' });
                setTimeout(() => {
                    setAlert(null); // Clear alert after 5 seconds
                }, 5000); // 5000 milliseconds = 5 seconds
            })
            .catch(error => {
                console.error('There was a problem updating website data:', error);
                setAlert({ type: 'error', message: 'Failed to update website data' });
                setTimeout(() => {
                    setAlert(null); // Clear alert after 5 seconds
                }, 5000); // 5000 milliseconds = 5 seconds
            });
    };
    const [email, setEmail] = useState('');
    const [protocol, setProtocol] = useState('');
    const [port, setPort] = useState('');
    const [password, setPassword] = useState('');
    const handleEmailUpdate = () => {
        // Send a POST request to your PHP script with form data
        fetch('http://localhost/insurance/api/updateEmail.php', {
            method: 'POST',
            body: JSON.stringify({ email, protocol, port, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('Record updated successfully');
                    setAlert({ type: 'success', message: 'Email settings updated successfully' });
                    setTimeout(() => {
                        setAlert(null); // Clear alert after 5 seconds
                    }, 5000); // 5000 milliseconds = 5 seconds
                } else {
                    console.error('Error updating record');
                    setAlert({ type: 'error', message: 'Failed to update email settings' });
                    setTimeout(() => {
                        setAlert(null); // Clear alert after 5 seconds
                    }, 5000); // 5000 milliseconds = 5 seconds
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setAlert({ type: 'error', message: 'Failed to update email settings' });
                setTimeout(() => {
                    setAlert(null); // Clear alert after 5 seconds
                }, 5000); // 5000 milliseconds = 5 seconds
            });
    };

    return (
        <>
            {alert && (
                <Alert className={`alert-${alert.type}`} style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: '9999' }}>
                    <strong>{alert.type === 'success' ? 'Success!' : 'Error!'}</strong> {alert.message}
                </Alert>
            )}

            <UserHeader />

            <Container className="mt--7 mb-3" fluid style={{ zIndex: 0 }}>
                <Row className="justify-content-center">
                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Website Settings</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    {websiteData && (
                                        <>
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="input-title">
                                                    Title
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-title"
                                                    placeholder="Website Title"
                                                    type="text"
                                                    defaultValue={websiteData.length > 0 ? websiteData[0].title : ''}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="input-description">
                                                    Description
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-description"
                                                    placeholder="Website Description"
                                                    type="textarea"
                                                    defaultValue={websiteData.length > 0 ? websiteData[0].description : ''}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="logoInput">
                                                    Logo
                                                </label>
                                                <Card
                                                    className="bg-light d-flex align-items-center justify-content-center py-5"
                                                    onClick={handleUploadClick}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <input
                                                        type="file"
                                                        id="logoInput"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={handleLogoChange}
                                                    />
                                                    <p className="text-center m-0">+ Upload New Logo</p>
                                                </Card>
                                            </FormGroup>
                                        </>
                                    )}
                                    <div className="col text-right">
                                        <Button onClick={handleUpdate} color="primary">Update</Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                        <Card className="bg-secondary shadow mt-4">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Email Settings</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    {websiteData && ( // Check if websiteData is not null
                                        <>
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="input-email">
                                                    Email
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-email"
                                                    placeholder="Email"
                                                    type="email"
                                                    value={websiteData[0].email}
                                                    onChange={e => setEmail(e.target.value)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="input-protocol">
                                                    Protocol
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-protocol"
                                                    placeholder="Protocol"
                                                    type="text"
                                                    defaultValue={websiteData[0].protocol}
                                                    onChange={e => setProtocol(e.target.value)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="input-port">
                                                    Port
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-port"
                                                    placeholder="Port"
                                                    type="number"
                                                    value={websiteData[0].port}
                                                    onChange={e => setPort(e.target.value)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="input-password">
                                                    Password
                                                </label>
                                                <Input
                                                    className="form-control-alternative"
                                                    id="input-password"
                                                    placeholder="Password"
                                                    type="password"
                                                    value={websiteData[0].password}
                                                    onChange={e => setPassword(e.target.value)}
                                                />
                                            </FormGroup>
                                            <div className="col text-right">
                                                <Button onClick={handleEmailUpdate} color="primary">Update</Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Settings;
