import React, { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
    Table,
    Input,
    FormGroup,
    Container,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    ModalFooter
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";

const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};

const Staff = () => {
    const [employees, setEmployees] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        username: '',
        email: '',
        role: '',
        password: ''
    });
    const [editEmployee, setEditEmployee] = useState({
        id: '',
        username: '',
        email: '',
        role: '',
        password: ''
    });
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        // Fetch employees data from backend/API
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`http://localhost/insurance/api/getAllEmployees.php`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('There was a problem fetching employees data:', error);
        }
    };

    const handleGeneratePassword = () => {
        const generatedPassword = generateRandomPassword();
        setNewEmployee(prevState => ({
            ...prevState,
            password: generatedPassword
        }));
    };

    const toggleModal = (type) => {
        setModalOpen(type);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddEmployee = () => {
        // Check if the user already exists with the same email
        fetch(`http://localhost/insurance/api/check_user.php?email=${newEmployee.email}`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    setAlert({
                        type: 'danger',
                        message: 'User with this email already exists!'
                    });
                    setTimeout(() => {
                        setAlert(null); // Clear the alert after 5 seconds
                    }, 5000); // 5000 milliseconds = 5 seconds
                } else {
                    // Add logic to send newEmployee data to backend/API for adding the employee
                    fetch('http://localhost/insurance/api/addUser.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newEmployee)
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Close the modal and clear the form
                            toggleModal();
                            setNewEmployee({
                                username: '',
                                email: '',
                                role: '',
                                password: ''
                            });
                            // Show success alert
                            setAlert({
                                type: 'success',
                                message: 'Employee added successfully!'
                            });
                            setTimeout(() => {
                                setAlert(null); // Clear the alert after 5 seconds
                            }, 5000); // 5000 milliseconds = 5 seconds
                            fetchEmployees();
                        })
                        .catch(error => {
                            console.error('Error adding employee:', error);
                            // Show error alert
                            setAlert({
                                type: 'danger',
                                message: 'Failed to add employee. Please try again later.'
                            });
                            setTimeout(() => {
                                setAlert(null); // Clear the alert after 5 seconds
                            }, 5000); // 5000 milliseconds = 5 seconds
                        });
                }
            })
            .catch(error => {
                console.error('Error checking user existence:', error);
                // Show error alert
                setAlert({
                    type: 'error',
                    message: 'Failed to check user existence. Please try again later.'
                });
                setTimeout(() => {
                    setAlert(null); // Clear the alert after 5 seconds
                }, 5000); // 5000 milliseconds = 5 seconds
            });
    };
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleEmployeeActivation = (employee) => {
        const newStatus = employee.active ? 0 : 1;
        // Prepare the data to be sent in JSON format
        const requestData = {
            id: employee.id,
            status: newStatus
        };
        // Update the employee's status in the database
        fetch(`http://localhost/insurance/api/updateEmployeeStatus.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setAlert({
                        type: 'success',
                        message: `Employee ${newStatus === 1 ? 'activated' : 'deactivated'} successfully!`
                    });
                    fetchEmployees();
                    setTimeout(() => {
                        setAlert(null);
                    }, 5000); // Hide alert after 5 seconds
                } else {
                    setAlert({
                        type: 'error',
                        message: 'Failed to update employee status. Please try again later.'
                    });
                    setTimeout(() => {
                        setAlert(null);
                    }, 5000); // Hide alert after 5 seconds
                }
            })
            .catch(error => {
                console.error('Error updating employee status:', error);
                setAlert({
                    type: 'error',
                    message: 'Failed to update employee status. Please try again later.'
                });
                setTimeout(() => {
                    setAlert(null);
                }, 5000); // Hide alert after 5 seconds
            });
    };

    const handleEditModal = (employee) => {
        setEditEmployee(employee);
        toggleModal('edit');
    };

    const handleEditEmployee = () => {
        // Prepare the data to be sent to the PHP script
        const requestData = {
            id: editEmployee.id,
            username: editEmployee.username,
            email: editEmployee.email,
            role: editEmployee.role,
            password: editEmployee.password
        };

        // Make a POST request to the PHP script
        fetch('http://localhost/insurance/api/updateEmployee.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success alert
                    setAlert({
                        type: 'success',
                        message: 'Employee details updated successfully!'
                    });
                } else {
                    // Show error alert
                    setAlert({
                        type: 'error',
                        message: 'Failed to update employee details. Please try again later.'
                    });
                }
                // Close the modal
                toggleModal();
                // Fetch updated employee data
                fetchEmployees();
                // Clear alert after 5 seconds
                setTimeout(() => {
                    setAlert(null);
                }, 5000);
            })
            .catch(error => {
                console.error('Error updating employee details:', error);
                // Show error alert
                setAlert({
                    type: 'error',
                    message: 'Failed to update employee details. Please try again later.'
                });
                // Close the modal
                toggleModal();
                // Clear alert after 5 seconds
                setTimeout(() => {
                    setAlert(null);
                }, 5000);
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
                    <Col xl="12">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Employees</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button color="primary" onClick={() => toggleModal('add')}>Add Employee</Button>
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
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td>{employee.id}</td>
                                                <td>{employee.username}</td>
                                                <td>{employee.email}</td>
                                                <td>{employee.role}</td>
                                                <td>
                                                    <Button color="info" size="sm">View</Button>{' '}
                                                    <Button color="warning" size="sm" onClick={() => handleEditModal(employee)}>Edit</Button>

                                                    <Button
                                                        color={employee.active ? 'danger' : 'success'}
                                                        size="sm"
                                                        onClick={() => handleEmployeeActivation(employee)}
                                                    >
                                                        {employee.active ? 'Deactivate' : 'Activate'}
                                                    </Button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                {/* Add Employee Modal */}
                <Modal isOpen={modalOpen === 'add'} toggle={() => toggleModal('add')}>
                    <ModalHeader toggle={toggleModal}>Add Employee</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-username">Username</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-single-02" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" name="username" value={newEmployee.username} placeholder="Username" onChange={handleInputChange} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-email">Email address</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-email-83" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="email" name="email" value={newEmployee.email} onChange={handleInputChange} placeholder="jesse@example.com" />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
      
                        <Row>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-password">Password</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-lock-circle-open" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" name="password" value={newEmployee.password} onChange={handleInputChange} placeholder="Password" />
                                        <InputGroupAddon addonType="append">
                                            <InputGroupText style={{ cursor: 'pointer' }} onClick={handleGeneratePassword} id="passwordTooltip">
                                                <i className="fa fa-magic" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-role">Role</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-briefcase-24" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="select" name="role" value={newEmployee.role} onChange={handleInputChange}>
                                            <option value="">Select Role</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Staff">Staff</option>
                                        </Input>
                                    </InputGroup>
                                </FormGroup>
                            </Col>

                        </Row>
                  
                     
                      
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleAddEmployee}>Add</Button>{' '}
                        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={modalOpen === 'edit'} toggle={() => toggleModal('edit')}>
                    <ModalHeader toggle={toggleModal }>Edit Employee</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-username">Username</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-single-02" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" name="username" value={editEmployee.username} placeholder="Username" onChange={handleEditInputChange} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-email">Email address</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-email-83" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="email" name="email" value={editEmployee.email} onChange={handleEditInputChange} placeholder="jesse@example.com"  disabled/>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-password">Password</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-lock-circle-open" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" name="password" value={editEmployee.password} onChange={handleEditInputChange} placeholder="Password" />
                                        <InputGroupAddon addonType="append">
                                            <InputGroupText style={{ cursor: 'pointer' }} onClick={handleGeneratePassword} id="passwordTooltip">
                                                <i className="fa fa-magic" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col lg="6">
                                <FormGroup>
                                    <label className="form-control-label" htmlFor="input-role">Role</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-briefcase-24" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="select" name="role" value={editEmployee.role} onChange={handleEditInputChange}>
                                            <option value="">Select Role</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Staff">Staff</option>
                                        </Input>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleEditEmployee}>Save Changes</Button>{' '}
                        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>


            </Container>
        


        </>
    );
};

export default Staff;
