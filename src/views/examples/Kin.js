import React, { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Table,
    Container,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";

const Kin = () => {
    const [kinData, setKinData] = useState(null);
    const [alert, setAlert] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        fetchKinData();
    }, []);

    const fetchKinData = () => {
        // Fetch kin data from the server
        // Assuming you have user data stored in sessionStorage
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (user && user.id) {
            fetch(`http://localhost/insurance/api/kinDetails.php?userId=${user.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setKinData(data);
                })
                .catch(error => {
                    console.error('There was a problem fetching kin data:', error);
                    setAlert({ type: 'error', message: 'Failed to fetch kin data' });
                    setTimeout(() => {
                        setAlert(null);
                    }, 5000);
                });
        } else {
            console.error('User ID not found in session storage');
        }
    };
    const toggleModal = () => setModal(!modal);

    const handleAddKin = () => {
        // Add kin details logic goes here
        // You can send a request to the server to add kin details
        toggleModal();
    };

    return (
        <>
            {alert && (
                <Alert className={`alert-${alert.type}`} style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: '9999' }}>
                    <strong>{alert.type === 'success' ? 'Success!' : 'Error!'}</strong> {alert.message}
                </Alert>
            )}

            <UserHeader />

            <Container className="mt--7 mb-3" fluid>
                <Row className="justify-content-center">
                    <Col xl="12">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Kin Details</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        {(kinData === null || kinData.length === 0) && <Button color="primary" onClick={toggleModal}>Add</Button>}
                                    </Col>

                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">CNIC</th>
                                            <th scope="col">Cell Phone</th>
                                            <th scope="col">Email id</th>
                                            <th scope="col">Bank Account Number</th>
                                            <th scope="col">Bank Name</th>
                                            <th scope="col">Title Of Account</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kinData && kinData.map((kin, index) => (
                                            <tr key={index}>
                                                <td>{kin.name}</td>
                                                <td>{kin.cnic}</td>
                                                <td>{kin.cellPhone}</td>
                                                <td>{kin.email}</td>
                                                <td>{kin.bankAccountNumber}</td>
                                                <td>{kin.bankName}</td>
                                                <td>{kin.titleOfAccount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add Kin Details</ModalHeader>
                <ModalBody>
                    {/* Add kin details form goes here */}
                    <Form>
                        <FormGroup>
                            <Input type="text" placeholder="Name" />
                        </FormGroup>
                        {/* Add more form fields for kin details */}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddKin}>Add</Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default Kin;
