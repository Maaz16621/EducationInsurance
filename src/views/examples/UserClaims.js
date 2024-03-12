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
   
    const [userData, setUserData] = useState({}); // Initialize as an empty object
    const [claimsData, setClaimsData] = useState([]);
    const [alert, setAlert] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        console.log(user);
        setUserData(userData); // You might not even need this line

        // Fetch user's claims data asynchronously
        fetchClaimsData()
            .then(data => {
                setClaimsData(data); // Update claimsData state with fetched data
            })
            .catch(error => {
                console.error('Error fetching claims data:', error);
                showAlert('error', 'Error fetching claims data');
            });

   
    }, []); // No dependencies here

  
    const fetchClaimsData = async () => {
        try {
            const response = await fetch(`http://localhost/insurance/api/getAllClaims.php`);
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

  
    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };
    const handleAddClaim = () => {
        setModalOpen(true); // Open the modal when "Add Claim" button is clicked
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
                                            <th scope="col">Action</th>
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
                                                <td>
                                                   <Button color="info" size="sm">View</Button>{' '}
                                                   <Button color="warning" size="sm">Decline</Button>{' '}
                                                   <Button color="success" size="sm">Approve</Button>{' '}

                                                </td>
                                              
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

export default UserClaims;
