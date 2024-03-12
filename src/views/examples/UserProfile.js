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
import { useState, useEffect } from "react";
// reactstrap components
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
// core components
import UserHeader from "components/Headers/UserHeader.js";
import ChangePasswordModal from './PasswordModal.js';
const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (user && user.id) {
            fetch('http://localhost/insurance/api/userData.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            })
                .then(response => response.json()) // Parse response as JSON
                .then(data => {
                    setUserData(data);
                    sessionStorage.setItem('user', JSON.stringify(data));
                })
                .catch(error => console.error('Error:', error));
        }
    }, []);

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        setProfile(file);
    };

    const handleUploadClick = () => {
        document.getElementById('profileInput').click();
    };

    const user = JSON.parse(sessionStorage.getItem('user'));
    const [alert, setAlert] = useState(null);
    const handleUpdate = () => {
        const formData = new FormData();

        formData.append('userId', user.id);
        formData.append('username', document.getElementById('input-username').value);
        formData.append('email', document.getElementById('input-email').value);
        formData.append('firstName', document.getElementById('input-first-name').value);
        formData.append('lastName', document.getElementById('input-last-name').value);
        formData.append('cnic', document.getElementById('input-cnic').value);
        formData.append('dob', document.getElementById('input-dob').value);
        formData.append('age', document.getElementById('input-age').value);
        formData.append('profession', document.getElementById('input-profession').value);
        formData.append('cellPhone', document.getElementById('input-cell-phone').value);
        formData.append('residencePhone', document.getElementById('input-residence-phone').value);
        formData.append('residenceAddress', document.getElementById('input-residence-address').value);
        formData.append('bankAccountNumber', document.getElementById('input-bank-account-number').value);
        formData.append('bankName', document.getElementById('input-bank-name').value);
        formData.append('titleOfAccount', document.getElementById('input-title-of-account').value);
        formData.append('employerName', document.getElementById('input-employer-name').value);
        formData.append('employedSince', document.getElementById('input-employed-since').value);
        formData.append('officePhone', document.getElementById('input-office-phone').value);
        formData.append('officeAddress', document.getElementById('input-office-address').value);
        if (profile) {
            formData.append('profilePic', profile);
        }

   
        fetch('http://localhost/insurance/api/updateUserData.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setAlert({ type: 'success', message: 'Data updated successfully' });

                    // Fetch the updated user data from the server
                    fetchUserData();
                } else {
                    setAlert({ type: 'danger', message: 'Failed to update data' });
                }
                setTimeout(() => {
                    setAlert(null);
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                error.text().then(errorMessage => {
                    console.error('Error Message:', errorMessage);
                    setAlert({ type: 'danger', message: errorMessage || 'An error occurred' });
                    setTimeout(() => {
                        setAlert(null);
                    }, 3000);
                });
            });

        function fetchUserData() {
            fetch('http://localhost/insurance/api/userData.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            })
                .then(response => response.json()) // Parse response as JSON
                .then(data => {
                    sessionStorage.setItem('user', JSON.stringify(data));
                })
                .catch(error => console.error('Error:', error));
        }
        


        

       
    };

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    const toggleChangePasswordModal = () => setIsChangePasswordModalOpen(!isChangePasswordModalOpen);

    const handleUpdatePassword = (currentPassword, newPassword) => {
        // Handle updating the password
        console.log('Updating password:', currentPassword, newPassword);

        // Send a POST request to the updatePassword.php script
        fetch('http://localhost/insurance/api/updatePassword.php', {
            method: 'POST',
            body: new URLSearchParams({
                userId: user.id,
                currentPassword: currentPassword,
                newPassword: newPassword,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setAlert({ type: 'success', message: 'Password updated successfully' });
                } else {
                    setAlert({ type: 'danger', message: data.message });
                }
                setTimeout(() => {
                    setAlert(null);
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                setAlert({ type: 'danger', message: 'An error occurred' });
                setTimeout(() => {
                    setAlert(null);
                }, 3000);
            });

        // Close the modal
        toggleChangePasswordModal();
    };

    return (
        <>
            {alert && (
                <Alert className={`alert-${alert.type}`} style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: '9999' }}>
                    <strong>{alert.type === 'success' ? 'Success!' : 'Error!'}</strong> {alert.message}
                </Alert>
            )}

            <UserHeader />
            {/* Page content */}
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                toggle={toggleChangePasswordModal}
                handleUpdatePassword={handleUpdatePassword}
            />
            <Container className="mt--7 mb-3" fluid style={{ zIndex: 0 }}>
                <Row className="justify-content-center">
                  
                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">My account</h3>
                                    </Col>
                                    <div className="col text-right">
                                        <div className="col text-right">
                                            <Button onClick={toggleChangePasswordModal} color="primary">Change Password</Button>
                                        </div>
                                      
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Card className="bg-secondary shadow mb-3">
                                        <CardHeader className="bg-white border-0">
                                            <h6 className="heading-small text-muted mb-4">
                                                User information
                                            </h6>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="pl-lg-4">
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-username"
                                                            >
                                                                Username
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-single-02" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.username : ''}
                                                                    id="input-username"
                                                                    placeholder="Username"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-email"
                                                            >
                                                                Email address
                                                            </label>
                                                            <InputGroup className="input-group-alternative" >
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-email-83" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.email : ''}
                                                                    id="input-email"
                                                                    placeholder="jesse@example.com"
                                                                    type="email"
                                                                    disabled
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-first-name"
                                                            >
                                                                First name
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-single-02" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.firstName : ''}
                                                                    id="input-first-name"
                                                                    placeholder="First name"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-last-name"
                                                            >
                                                                Last name
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-single-02" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.lastName : ''}
                                                                    id="input-last-name"
                                                                    placeholder="Last name"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-cnic"
                                                            >
                                                                CNIC
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-credit-card" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.cnic : ''}
                                                                    id="input-cnic"
                                                                    placeholder="CNIC"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-dob"
                                                            >
                                                                Date of Birth
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-calendar-grid-58" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.dob : ''}
                                                                    id="input-dob"
                                                                    placeholder="Date of Birth"
                                                                    type="date"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-age"
                                                            >
                                                                Age In Years
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-calendar-grid-58" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.age : ''}
                                                                    id="input-age"
                                                                    placeholder="Age In Years"
                                                                    type="number"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-profession"
                                                            >
                                                                Profession
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-briefcase-24" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.profession : ''}
                                                                    id="input-profession"
                                                                    placeholder="Profession"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-cell-phone"
                                                            >
                                                                Cell Phone
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-mobile-button" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.cellPhone : ''}
                                                                    id="input-cell-phone"
                                                                    placeholder="Cell Phone"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-residence-phone"
                                                            >
                                                                Residence Phone
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-mobile-button" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.residencePhone : ''}
                                                                    id="input-residence-phone"
                                                                    placeholder="Residence Phone"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-residence-address"
                                                            >
                                                                Residence address
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-square-pin" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.residenceAddress : ''}
                                                                    id="input-residence-address"
                                                                    placeholder="Residence address"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="12">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="logoInput">
                                                            Profile Picture
                                                        </label>
                                                        <Card
                                                            className="bg-light d-flex align-items-center justify-content-center py-5"
                                                            onClick={handleUploadClick}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <input
                                                                type="file"
                                                                id="profileInput"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                onChange={handleProfileChange}
                                                            />
                                                            <p className="text-center m-0">+ Upload New Profile Picture</p>
                                                        </Card>
                                                        </FormGroup>
                                                    </Col>

                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card className="bg-secondary shadow mb-3">
                                        <CardHeader className="bg-white border-0">
                                            <h6 className="heading-small text-muted mb-4">
                                                Bank details
                                            </h6>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="pl-lg-4">
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-bank-account-number"
                                                            >
                                                                Bank Account Number
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-credit-card" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.bankAccountNumber : ''}
                                                                    id="input-bank-account-number"
                                                                    placeholder="Bank Account Number"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-bank-name"
                                                            >
                                                                Bank Name
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-building" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.bankName : ''}
                                                                    id="input-bank-name"
                                                                    placeholder="Bank Name"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-title-of-account"
                                                            >
                                                                Title Of Account
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-briefcase-24" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.titleOfAccount : ''}
                                                                    id="input-title-of-account"
                                                                    placeholder="Title Of Account"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card className="bg-secondary shadow mb-3">
                                        <CardHeader className="bg-white border-0">
                                            <h6 className="heading-small text-muted mb-4">
                                                Job details
                                            </h6>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="pl-lg-4">
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-employer-name"
                                                            >
                                                                Employer Name
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-briefcase-24" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.employerName : ''}
                                                                    id="input-employer-name"
                                                                    placeholder="Employer Name"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-employed-since"
                                                            >
                                                                Employed Since
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-calendar-grid-58" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.employedSince : ''}
                                                                    id="input-employed-since"
                                                                    placeholder="Employed Since"
                                                                    type="date"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-office-phone"
                                                            >
                                                                Office Phone
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-mobile-button" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.officePhone : ''}
                                                                    id="input-office-phone"
                                                                    placeholder="Office Phone"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                                htmlFor="input-office-address"
                                                            >
                                                                Office Address
                                                            </label>
                                                            <InputGroup className="input-group-alternative">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="ni ni-square-pin" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input
                                                                    className="form-control-alternative"
                                                                    defaultValue={userData ? userData.officeAddress : ''}
                                                                    id="input-office-address"
                                                                    placeholder="Office Address"
                                                                    type="text"
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <div className="col text-right">
                                        <Button onClick={handleUpdate} color="primary">Update</Button>
                                    </div>
                                </Form>


                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;
