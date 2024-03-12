import React, { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    InputGroupAddon,
    InputGroupText,
    Input,
    InputGroup,
    FormGroup,
    Form,
    Table
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";
import FormWizard from "react-form-wizard-component";
import 'react-form-wizard-component/dist/style.css';

const Claim = () => {
    const [kinDetails, setKinDetails] = useState({
        name: "",
        cnic: "",
        cell_phone: "",
        email: "",
        bank_account_number: "",
        bank_name: "",
        title_of_account: ""
    });
    const [userData, setUserData] = useState({}); // Initialize as an empty object

    const [claimsData, setClaimsData] = useState([]);
    const [childrenData, setChildrenData] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [alert, setAlert] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
    const [isChildSelected, setIsChildSelected] = useState(false); // State to track if a child is selected

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        console.log(user);
        setUserData(user); // You might not even need this line

        // Fetch user's claims data asynchronously
        fetchClaimsDataByCurrentUser(user.id)
            .then(data => {
                setClaimsData(data); // Update claimsData state with fetched data
            })
            .catch(error => {
                console.error('Error fetching claims data:', error);
                showAlert('error', 'Error fetching claims data');
            });

        // Fetch user's children data asynchronously
        fetchChildrenDataByUserId(user.id)
            .then(data => {
                setChildrenData(data); // Update childrenData state with fetched data
            })
            .catch(error => {
                console.error('Error fetching children data:', error);
                showAlert('error', 'Error fetching children data');
            });

        fetchKinDetails(user.id);
    }, []); // No dependencies here

    const fetchKinDetails = async (userId) => {
        try {
            const response = await fetch(`http://localhost/insurance/api/kinDetails.php?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.length > 0) {
                setKinDetails(data[0]);
            }
        } catch (error) {
            console.error('There was a problem fetching kin details:', error);
            // Handle error
        }
    };
    const fetchClaimsDataByCurrentUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost/insurance/api/getUserClaims.php?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There was a problem fetching claims data:', error);
            throw error;
        }
    };

    const fetchChildrenDataByUserId = async (userId) => {
        try {
            const response = await fetch(`http://localhost/insurance/api/childrenDetails.php?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There was a problem fetching children data:', error);
            throw error;
        }
    };

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };
    const [selectedChildren, setSelectedChildren] = useState([]);
    const handleChildSelection = (index) => {
        if (selectedChildren.includes(index)) {
            // If the child is already selected, deselect it
            setSelectedChildren(selectedChildren.filter((item) => item !== index));
        } else {
            // If the child is not selected, select it
            setSelectedChildren([...selectedChildren, index]);
        }
    };

    const handleNextStep = () => {
        if ( isChildSelected != true) {
            showAlert('error', 'Please select a child before proceeding.');
        } else {
            setCurrentStep(currentStep + 1);
        }
    };


    const handleAddClaim = () => {
        setModalOpen(true); // Open the modal when "Add Claim" button is clicked
    };

    const handleComplete = () => {
        // Gather user input and other necessary data
        const selectedChildData = selectedChildren.map(index => childrenData[index]);

        const claimData = {
            user_id: userData.id, // Assuming userData contains the user's ID
            claim_number: generateClaimNumber(), // Generate a unique claim number, you need to implement this function
            user_details: userData,
            kin_details: kinDetails,
            children_details: selectedChildData, // Changed key to children_details
            status: 'Pending', // Set status to 'pending'
            payment_status: 'Pending', // Set payment status to 'pending'
            // Other fields as needed
            receipt: null, // Placeholder for receipt, you need to implement the logic for this
            cover_note_sent: false, // Placeholder for cover note sent status
            claim_form: null, // Placeholder for claim form, you need to implement the logic for this
            applied_at: new Date().toISOString(), // Timestamp for when the claim was applied
            updated_at: null // Placeholder for updated timestamp
        };

        fetch('http://localhost/insurance/api/addClaim.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(claimData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Read response as text
            })
            .then(htmlResponse => {
                console.log('HTML response:', htmlResponse);
                // Process HTML response here
                // For example, display the HTML response in a modal or update a section of the page
            })
            .catch(error => {
                console.error('There was a problem adding the claim:', error);
                setAlert({ type: 'error', message: 'Failed to add claim' });
                // Handle error
            });
    };

    // Function to generate a unique claim number (you need to implement this)
    const generateClaimNumber = () => {
        const prefix = 'CL';
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Generate a random 8-digit number
        return prefix + randomNumber;
    };



    const handleTabChange = (nextIndex) => {
        setCurrentStep(nextIndex);
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen); // Toggle modal visibility
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
                    <Col xl="12">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Claims</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button color="primary" onClick={handleAddClaim}>Add Claim</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Claim ID</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Payment Status</th>
                                            <th scope="col">Applied At</th>
                                            <th scope="col">Updated At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claimsData.map((claim, index) => (
                                            <tr key={index}>
                                                <td>{claim.id}</td>
                                                <td>{claim.status}</td>
                                                <td>{claim.payment_status}</td>
                                                <td>{claim.applied_at}</td>
                                                <td>{claim.updated_at}</td>
                                              
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={modalOpen} toggle={toggleModal} size="xl">
                <ModalHeader toggle={toggleModal}>Add Claim</ModalHeader>
                <ModalBody>
                    <FormWizard
                        color="#5E72E4"
                        onComplete={handleComplete}
                        currentStep={currentStep}
                        initialStep={0}
                        onNext={handleNextStep} // Call handleNextStep function when "Next" is clicked
                    >
                        <FormWizard.TabContent title="Child details" icon="ti-user">
                            <h1>Select Child</h1>
                            <Card>
                                <CardBody style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {childrenData.map((child, index) => (
                                        <div key={index} onClick={() => handleChildSelection(index)} className={`child-card ${selectedChildren.includes(index) ? 'selected' : ''}`}>
                                            <i className="ti-user fa-3x mb-2"></i>
                                            <p>{child.name}</p>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>
                        </FormWizard.TabContent>
                        <FormWizard.TabContent title="Kin Details" icon="ti-settings">
                            <h1>Kin Details</h1>
                            <p>Enter Kin Details:</p>
                            <Form>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <FormGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><i className="ni ni-single-02" /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Name"
                                                    type="text"
                                                    defaultValue={kinDetails.name}
                                                    onChange={(e) => setKinDetails({ ...kinDetails, name: e.target.value })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    <div className="col-lg-6">
                                        <FormGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><i className="ni ni-badge" /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="CNIC"
                                                    type="text"
                                                    defaultValue={kinDetails.cnic}
                                                    onChange={(e) => setKinDetails({ ...kinDetails, cnic: e.target.value })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <FormGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><i className="ni ni-mobile-button" /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Cell Phone"
                                                    type="text"
                                                    defaultValue={kinDetails.cell_phone}
                                                    onChange={(e) => setKinDetails({ ...kinDetails, cell_phone: e.target.value })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    <div className="col-lg-6">
                                        <FormGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><i className="ni ni-email-83" /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Email id"
                                                    type="email"
                                                    defaultValue={kinDetails.email}
                                                    onChange={(e) => setKinDetails({ ...kinDetails, email: e.target.value })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <FormGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><i className="ni ni-credit-card" /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Bank Account Number"
                                                    type="text"
                                                    defaultValue={kinDetails.bank_account_number}
                                                    onChange={(e) => setKinDetails({ ...kinDetails, bank_account_number: e.target.value })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    <div className="col-lg-6">
                                        <FormGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><i className="ni ni-building" /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Bank Name"
                                                    type="text"
                                                    defaultValue={kinDetails.bank_name}
                                                    onChange={(e) => setKinDetails({ ...kinDetails, bank_name: e.target.value })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <FormGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><i className="ni ni-book-bookmark" /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Title Of Account"
                                                    type="text"
                                                    defaultValue={kinDetails.title_of_account}
                                                    onChange={(e) => setKinDetails({ ...kinDetails, title_of_account: e.target.value })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </div>
                            </Form>
                        </FormWizard.TabContent>


                        <FormWizard.TabContent title="Personal Details" icon="ti-layout-list-thumb">
                            <h1>Personal Details</h1>
                            <div className="user-details-container">
                                <div className="user-detail">
                                    <table style={{ textAlign: 'left' }}>
                                        <tbody>
                                            <tr>
                                                <td><strong>ID:</strong></td>
                                                <td>{userData.id || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Username:</strong></td>
                                                <td>{userData.username || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Email:</strong></td>
                                                <td>{userData.email || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Password:</strong></td>
                                                <td>{userData.password || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>CNIC:</strong></td>
                                                <td>{userData.cnic || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>First Name:</strong></td>
                                                <td>{userData.firstName || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Last Name:</strong></td>
                                                <td>{userData.lastName || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Date of Birth:</strong></td>
                                                <td>{userData.dob || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Age:</strong></td>
                                                <td>{userData.age || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Profession:</strong></td>
                                                <td>{userData.profession || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Employer Name:</strong></td>
                                                <td>{userData.employerName || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Employed Since:</strong></td>
                                                <td>{userData.employedSince || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Cell Phone:</strong></td>
                                                <td>{userData.cellPhone || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Residence Phone:</strong></td>
                                                <td>{userData.residencePhone || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Residence Address:</strong></td>
                                                <td>{userData.residenceAddress || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Office Phone:</strong></td>
                                                <td>{userData.officePhone || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Office Address:</strong></td>
                                                <td>{userData.officeAddress || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Profile Picture URL:</strong></td>
                                                <td>{userData.profilePicUrl || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Bank Account Number:</strong></td>
                                                <td>{userData.bankAccountNumber || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Bank Name:</strong></td>
                                                <td>{userData.bankName || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Title of Account:</strong></td>
                                                <td>{userData.titleOfAccount || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Created At:</strong></td>
                                                <td>{userData.createdAt || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Updated At:</strong></td>
                                                <td>{userData.updatedAt || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2"><h3><strong>Kin Details:</strong></h3></td>
                                              
                                            </tr>
                                            <tr>
                                                <td><strong>Next of Kin:</strong></td>
                                                <td>{kinDetails.name|| 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Kin's CNIC:</strong></td>
                                                <td>{kinDetails.cnic || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Phone Number:</strong></td>
                                                <td>{kinDetails.cell_phone || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Email :</strong></td>
                                                <td>{kinDetails.email || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Email :</strong></td>
                                                <td>{kinDetails.email || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Account Number :</strong></td>
                                                <td>{kinDetails.bank_account_number || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Bank Name:</strong></td>
                                                <td>{kinDetails.bank_name || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Title of Account:</strong></td>
                                                <td>{kinDetails.title_of_account || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2"><h3><strong>Children Details:</strong></h3></td>
                                            </tr>
                                            {childrenData.map((child, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td colSpan="2"><h4><strong>Child Details #{index + 1}</strong></h4></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Name:</strong></td>
                                                        <td>{child.name || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>CNIC:</strong></td>
                                                        <td>{child.form_b_cnic || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Institution Name:</strong></td>
                                                        <td>{child.institution_name || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Course:</strong></td>
                                                        <td>{child.course || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Class:</strong></td>
                                                        <td>{child.class || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Semester:</strong></td>
                                                        <td>{child.semester || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Year:</strong></td>
                                                        <td>{child.year || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Roll Number:</strong></td>
                                                        <td>{child.roll_number || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Fee Frequency:</strong></td>
                                                        <td>{child.fee_frequency || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Fees Per MQY:</strong></td>
                                                        <td>{child.fees_per_mqy || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Remaining Time:</strong></td>
                                                        <td>{child.remaining_time_to_completion || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Total Outstanding Fees:</strong></td>
                                                        <td>{child.total_outstanding_fees_prs || 'N/A'}</td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </FormWizard.TabContent>

                    </FormWizard>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    {/* Optionally add a submit button */}
                    {/* <Button color="primary" onClick={handleClaimSubmit}>Submit</Button> */}
                </ModalFooter>
            </Modal>

            <style>{`
                @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
            `}</style>
            <style>{`
            .child-card {
                cursor: pointer;
                width: 200px; /* Set your desired width */
                height: 150px; /* Set your desired height */
                padding: 10px;
                border: 1px solid #ccc;
                margin: 5px; /* Add margin for spacing */
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .child-card.selected {
                border-color: #5E72E4;
                box-shadow: 0px 0px 5px 0px rgba(94, 114, 228, 0.5);
            }
        `}</style>
        </>
    );
};

export default Claim;
