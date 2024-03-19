import React, { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
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

const Customers = () => {
    const [customerData, setCustomerData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        getAllCustomers();
    }, []);

    const getAllCustomers = async () => {
        try {
            const response = await fetch('http://localhost/insurance/api/getAllUsers.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCustomerData(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setAlert({ type: 'error', message: 'Failed to fetch customers' });
        }
    };

    const toggleViewModal = () => {
        setViewModalOpen(!viewModalOpen);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        toggleViewModal();
    };

    const handleDisableUser = async (userId) => {
        try {
            const response = await fetch('http://localhost/insurance/api/disableUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, action: 0 }) // Action 0 represents disable
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setAlert({ type: 'success', message: data.message });
            getAllCustomers();
        } catch (error) {
            console.error('Error disabling user:', error);
            setAlert({ type: 'danger', message: 'Failed to disable user' });
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            const response = await fetch('http://localhost/insurance/api/disableUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, action: 1 }) // Action 1 represents activate
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setAlert({ type: 'success', message: data.message });
            getAllCustomers();
        } catch (error) {
            console.error('Error activating user:', error);
            setAlert({ type: 'danger', message: 'Failed to activate user' });
        }
    };

    // After setting the alert state
    setTimeout(() => {
        setAlert(null);
    }, 5000); // 5000 milliseconds = 5 seconds


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
                                        <h3 className="mb-0">Customers</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Active</th>
                                            <th>Created At</th>
                                            <th>Updated At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerData.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.active ? 'Active' : 'Inactive'}</td>
                                                <td>{user.createdAt}</td>
                                                <td>{user.updatedAt}</td>
                                                <td>
                                                    <Button color="info" size="sm" onClick={() => handleViewUser(user)}>View</Button>{' '}
                                                    {user.active ?
                                                        <Button color="danger" size="sm" onClick={() => handleDisableUser(user.id)}>Disable</Button>
                                                        :
                                                        <Button color="success" size="sm" onClick={() => handleActivateUser(user.id)}>Activate</Button>
                                                    }

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
            <Modal isOpen={viewModalOpen} toggle={toggleViewModal} size="lg">
                <ModalHeader toggle={toggleViewModal}>View User Details</ModalHeader>
                <ModalBody>
                    {selectedUser && (
                        <div className="table-responsive">
                            <table className="table">
                                <tbody><tr>
                                    <td ><strong>Profile Picture:</strong></td>
                                    <td >
                                        {selectedUser.profilePicUrl && (
                                            <img src={selectedUser.profilePicUrl} alt="Profile Picture" className="img-fluid rounded-circle" style={{ maxWidth: '300px', height: 'auto' }} />
                                        )}
                                    </td>
                                </tr>
                                    <tr>
                                        <td><strong>ID:</strong></td>
                                        <td>{selectedUser.id}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Username:</strong></td>
                                        <td>{selectedUser.username}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email:</strong></td>
                                        <td>{selectedUser.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Password:</strong></td>
                                        <td>{selectedUser.password}</td>
                                    </tr>
                                    
                                    <tr>
                                        <td><strong>CNIC:</strong></td>
                                        <td>{selectedUser.cnic}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>First Name:</strong></td>
                                        <td>{selectedUser.firstName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Last Name:</strong></td>
                                        <td>{selectedUser.lastName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Date of Birth:</strong></td>
                                        <td>{selectedUser.dob}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Age:</strong></td>
                                        <td>{selectedUser.age}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Profession:</strong></td>
                                        <td>{selectedUser.profession}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Employer Name:</strong></td>
                                        <td>{selectedUser.employerName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Employed Since:</strong></td>
                                        <td>{selectedUser.employedSince}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cell Phone:</strong></td>
                                        <td>{selectedUser.cellPhone}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Residence Phone:</strong></td>
                                        <td>{selectedUser.residencePhone}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Residence Address:</strong></td>
                                        <td>{selectedUser.residenceAddress}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Office Phone:</strong></td>
                                        <td>{selectedUser.officePhone}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Office Address:</strong></td>
                                        <td>{selectedUser.officeAddress}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bank Account Number:</strong></td>
                                        <td>{selectedUser.bankAccountNumber}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bank Name:</strong></td>
                                        <td>{selectedUser.bankName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Title of Account:</strong></td>
                                        <td>{selectedUser.titleOfAccount}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Active:</strong></td>
                                        <td>{selectedUser.active ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Created At:</strong></td>
                                        <td>{selectedUser.createdAt}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Updated At:</strong></td>
                                        <td>{selectedUser.updatedAt}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleViewModal}>Close</Button>
                </ModalFooter>
            </Modal>


        </>
    );
};

export default Customers;
