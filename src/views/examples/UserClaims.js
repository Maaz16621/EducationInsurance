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
import 'react-form-wizard-component/dist/style.css';

const UserClaims = () => {
    const [userData, setUserData] = useState({});
    const [claimsData, setClaimsData] = useState([]);
    const [alert, setAlert] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [kinDetails, setKinDetails] = useState({});
    const [childDetails, setChildDetails] = useState([]);

    // Function to parse JSON strings into objects
    const parseModalData = () => {
        const userDetailString = modalData.user_details || '{}';
        const kinDetailString = modalData.kin_details || '{}';
        const childDetailString = modalData.child_details || '[]';

        setUserDetails(JSON.parse(userDetailString));
        setKinDetails(JSON.parse(kinDetailString));
        setChildDetails(JSON.parse(childDetailString));
    };

    useEffect(() => {
        // Parse modal data when modalData changes
        if (modalData) {
            parseModalData();
        }
    }, [modalData]);

    // Fetch user's claims data asynchronously
    const fetchClaimsData = async () => {
        try {
            const response = await fetch(`http://localhost/insurance/api/getAllClaims.php`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setClaimsData(data);
        } catch (error) {
            console.error('There was a problem fetching claims data:', error);
            showAlert('error', 'Error fetching claims data');
        }
    };

    // Function to fetch claims data periodically
    const fetchClaimsPeriodically = async () => {
        await fetchClaimsData();
        setTimeout(fetchClaimsPeriodically, 60000); // Fetch claims data every 1 minute (adjust as needed)
    };

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        console.log(user);
        setUserData(userData); // You might not even need this line

        // Fetch user's claims data asynchronously
        fetchClaimsData();

        // Start fetching claims data periodically
        fetchClaimsPeriodically();
    }, []); // No dependencies here

  
    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };
    const viewClaim = (claim) => {
        setModalData(claim); // Set claim data to modal data state
        setModalOpen(true); // Open the modal
    };


   
    const [declineModalOpen, setDeclineModalOpen] = useState(false);
    const [claimIdToDecline, setClaimIdToDecline] = useState(null);
    const [reason, setReason] = useState('');

    const toggleModal = () => setModalOpen(!modalOpen);
    const toggleDeclineModal = () => setDeclineModalOpen(!declineModalOpen);

    const declineClaim = async () => {
        try {
            const response = await fetch(`http://localhost/insurance/api/declineClaim.php?id=${claimIdToDecline}&reason=${reason}`, {
                method: 'GET'
            });
            const data = await response.json();
            if (data && data.message === 'Declined') {
                // Show specific message for the case when a claim has been submitted
                setAlert({ type: 'success', message: 'A claim has been declined successfully.' });
            } else {
                // Show generic error message for other cases
                setAlert({ type: 'danger', message: 'Failed to Decline the claim' });
            }

            setTimeout(() => {
                setAlert(null);
            }, 5000);
            // Refresh children data after deletion
            fetchClaimsData();
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            setAlert({ type: 'error', message: 'Failed to Decline the claim!' });
            setTimeout(() => {
                setAlert(null);
            }, 5000);
        }
    };

    const approveClaim = async (claimId) => {
        try {
            const response = await fetch(`http://localhost/insurance/api/approveClaim.php?id=${claimId}`, {
                method: 'GET'
            });
            const data = await response.json();
            if (data && data.message === 'Approved') {
                // Show specific message for the case when a claim has been submitted
                setAlert({ type: 'success', message: 'A claim has been Approved.' });
            } else {
                // Show generic error message for other cases
                setAlert({ type: 'danger', message: 'Failed to Approve the claim' });
            }

            setTimeout(() => {
                setAlert(null);
            }, 5000);
            // Refresh children data after deletion
            fetchClaimsData();
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            setAlert({ type: 'error', message: 'Failed to Approve the claim!' });
            setTimeout(() => {
                setAlert(null);
            }, 5000);
        }
    };

    const openDeclineModal = (claimId) => {
        setClaimIdToDecline(claimId);
        setReason('');
        setDeclineModalOpen(true);
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
                                        <h3 className="mb-0"> User Claims</h3>
                                    </Col>
                                  
                                </Row>
                            </CardHeader>
                            <CardBody>
                          <div className="table-responsive">
            <table className="table align-items-center table-flush">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">Claim ID</th>
                        <th scope="col">Status</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Applied At</th>
                        <th scope="col">Updated At</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {claimsData.map((claim, index) => (
                        <tr key={index}>
                            <td>{claim.claim_number}</td>
                            <td>
                                {/* Render badge based on claim status */}
                                {claim.status === 'Pending' && <span className="badge badge-info">Pending</span>}
                                {claim.status === 'Declined' && <span className="badge badge-danger">Declined</span>}
                                {claim.status === 'Approved' && <span className="badge badge-success">Approved</span>}
                            </td>
                            <td>{claim.payment_status}</td>
                            <td>{claim.applied_at}</td>
                            <td>{claim.updated_at}</td>
                            <td>
                                <Button color="info" size="sm" onClick={() => viewClaim(claim)}>View</Button>
                                {claim.status === 'Pending' && (
                                    <>
                                        <Button color="warning" size="sm" onClick={() => openDeclineModal(claim.id)}>Decline</Button>{' '}
                                        <Button color="success" size="sm" onClick={() => approveClaim(claim.id)}>Approve</Button>{' '}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>View Details</ModalHeader>
                <ModalBody>
                    {modalData && (

                        <>
                    
                           
                    <div className="user-details-container">
                        <div className="user-detail">
                            <table style={{ textAlign: 'left' }}>
                                <tbody>
                                         
                                    <tr>
                                                <td><strong>ID:</strong> </td>
                                                <td>{modalData.claim_number || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Status: </strong> </td>
                                                <td>{modalData.status || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                        <td><strong>Username:</strong></td>
                                        <td>{userDetails.username || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email:</strong></td>
                                        <td>{userDetails.email || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Password:</strong></td>
                                        <td>{userDetails.password || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>CNIC:</strong></td>
                                        <td>{userDetails.cnic || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>First Name:</strong></td>
                                        <td>{userDetails.firstName || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Last Name:</strong></td>
                                        <td>{userDetails.lastName || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Date of Birth:</strong></td>
                                        <td>{userDetails.dob || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Age:</strong></td>
                                        <td>{userDetails.age || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Profession:</strong></td>
                                        <td>{userDetails.profession || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Employer Name:</strong></td>
                                        <td>{userDetails.employerName || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Employed Since:</strong></td>
                                        <td>{userDetails.employedSince || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cell Phone:</strong></td>
                                        <td>{userDetails.cellPhone || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Residence Phone:</strong></td>
                                        <td>{userDetails.residencePhone || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Residence Address:</strong></td>
                                        <td>{userDetails.residenceAddress || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Office Phone:</strong></td>
                                        <td>{userDetails.officePhone || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Office Address:</strong></td>
                                        <td>{userDetails.officeAddress || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Profile Picture URL:</strong></td>
                                        <td>{userDetails.profilePicUrl || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bank Account Number:</strong></td>
                                        <td>{userDetails.bankAccountNumber || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bank Name:</strong></td>
                                        <td>{userDetails.bankName || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Title of Account:</strong></td>
                                        <td>{userDetails.titleOfAccount || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Created At:</strong></td>
                                        <td>{userDetails.createdAt || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Updated At:</strong></td>
                                        <td>{userDetails.updatedAt || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2"><h3><strong>Kin Details:</strong></h3></td>

                                    </tr>
                                    <tr>
                                        <td><strong>Next of Kin:</strong></td>
                                        <td>{ kinDetails.name || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Kin's CNIC:</strong></td>
                                        <td>{ kinDetails.cnic || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Phone Number:</strong></td>
                                        <td>{ kinDetails.cell_phone || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email :</strong></td>
                                        <td>{ kinDetails.email || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email :</strong></td>
                                        <td>{ kinDetails.email || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Account Number :</strong></td>
                                        <td>{ kinDetails.bank_account_number || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bank Name:</strong></td>
                                        <td>{ kinDetails.bank_name || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Title of Account:</strong></td>
                                        <td>{ kinDetails.title_of_account || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2"><h3><strong>Children Details:</strong></h3></td>
                                    </tr>
                                            {modalData && childDetails && Array.isArray(childDetails) && childDetails.map((child, index) => (
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
                     </>
                    )}
                </ModalBody>
                <ModalFooter>
                    
                <Button color="secondary" onClick={toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={declineModalOpen} toggle={toggleDeclineModal}>
                <ModalHeader toggle={toggleDeclineModal}>Decline Claim</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Input type="text" placeholder="Enter Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => { toggleDeclineModal(); declineClaim(); }}>Submit</Button>{' '}
                    <Button color="secondary" onClick={toggleDeclineModal}>Cancel</Button>
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

export default UserClaims;
