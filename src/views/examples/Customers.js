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
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    ModalBody,
    ModalFooter
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";

const Customers = () => {
    const [childrenData, setChildrenData] = useState(null);
    const [alert, setAlert] = useState(null);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editingChild, setEditingChild] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        cnic: '',
        institutionName: '',
        course: '',
        class: '',
        semester: '',
        year: '',
        rollNumber: '',
        feeFrequency: '',
        feesPerMQY: '',
        remainingTime: '',
        totalOutstandingFees: '0' // Initial value set to '0'
    });


    useEffect(() => {
        fetchChildrenData();
    }, []);

    const fetchChildrenData = () => {
        // Fetch children data from the server
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (user && user.id) {
            fetch(`http://localhost/insurance/api/childrenDetails.php?userId=${user.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setChildrenData(data);
                })
                .catch(error => {
                    console.error('There was a problem fetching children data:', error);
                    setAlert({ type: 'error', message: 'Failed to fetch children data' });
                    setTimeout(() => {
                        setAlert(null);
                    }, 5000);
                });
        } else {
            console.error('User ID not found in session storage');
        }
    };

    const toggleModal = () => setModal(!modal);

    const handleAddChild = () => {
        // Prepare data to send to the server
        const user = JSON.parse(sessionStorage.getItem('user'));
        const dataToSend = {
            userId: user.id,
            ...formData
        };

        // Send a POST request to the server to insert child details
        fetch('http://localhost/insurance/api/insertChildDetails.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle success response
                console.log('Child details inserted successfully:', data);
                toggleModal(); // Close the modal after successful insertion
                fetchChildrenData(); // Refresh the children data
                setAlert({ type: 'success', message: data.message }); // Show success alert
                setTimeout(() => {
                    setAlert(null);
                }, 5000);
            })
            .catch(error => {
                // Handle error response
                console.error('There was a problem inserting child details:', error);
                setAlert({ type: 'error', message: 'Failed to insert child details' }); // Show error alert
                setTimeout(() => {
                    setAlert(null);
                }, 5000);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        if (name === 'feesPerMQY' || name === 'remainingTime') {
            const feesPerMQY = parseFloat(updatedFormData.feesPerMQY);
            const remainingTime = parseFloat(updatedFormData.remainingTime);
            if (!isNaN(feesPerMQY) && !isNaN(remainingTime)) {
                const totalOutstandingFees = feesPerMQY * remainingTime;
                updatedFormData = { ...updatedFormData, totalOutstandingFees: totalOutstandingFees.toFixed(2) };
            }
        }

        setFormData(updatedFormData);
    };
    const handleDeleteChild = async (childId) => {
        try {
            const response = await fetch(`http://localhost/insurance/api/deleteChild.php?id=${childId}`, {
                method: 'GET'
            });

            const data = await response.json();

          
                // If the response is not ok, handle it accordingly
                if (data && data.message === 'A claim has been submitted for this child. Cannot delete.') {
                    // Show specific message for the case when a claim has been submitted
                    setAlert({ type: 'error', message: 'A claim has been submitted for this child. Cannot delete.' });
            } else if(data && data.message === 'Child record deleted successfully.'){
                    setAlert({ type: 'success', message: 'Child deleted successfully' });
                  
            } else {
                    // Show generic error message for other cases
                    setAlert({ type: 'error', message: 'Failed to delete the child' });
                }
           
            setTimeout(() => {
                setAlert(null);
            }, 5000);
                // Refresh children data after deletion
                fetchChildrenData();
            
        } catch (error) {
            // Handle other unexpected errors
            console.error('An unexpected error occurred:', error);
            setAlert({ type: 'error', message: 'Failed to delete the child' });
            setTimeout(() => {
                setAlert(null);
            }, 5000);
        }
    };



    const toggleEditModal = (child) => {
        setEditModal(!editModal);
        setEditingChild(child); // Set the ID of the editing child
        if (child) {
            setFormData({
                name: child.name || '',
                cnic: child.form_b_cnic || '',
                institutionName: child.institution_name || '',
                course: child.course || '',
                class: child.class || '',
                semester: child.semester || '',
                year: child.year || '',
                rollNumber: child.roll_number || '',
                feeFrequency: child.fee_frequency || '',
                feesPerMQY: child.fees_per_mqy || '',
                remainingTime: child.remaining_time_to_completion || '',
                totalOutstandingFees: child.total_outstanding_fees_prs || '0'
            });
        } else {
            // Initialize formData with default values when no child is selected
            setFormData({
                name: '',
                cnic: '',
                institutionName: '',
                course: '',
                class: '',
                semester: '',
                year: '',
                rollNumber: '',
                feeFrequency: '',
                feesPerMQY: '',
                remainingTime: '',
                totalOutstandingFees: '0'
            });
        }
    };

    const handleUpdateChild = () => {
        const dataToUpdate = {
            id: editingChild.id,
            ...formData
        };

        fetch('http://localhost/insurance/api/updateChildDetails.php', {
            method: 'POST', // Assuming you're using POST method in PHP script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Child details updated successfully:', data);
                toggleEditModal();
                fetchChildrenData();
                setAlert({ type: 'success', message: 'Child details updated successfully' });
                setTimeout(() => {
                    setAlert(null);
                }, 5000);
            })
            .catch(error => {
                console.error('There was a problem updating child details:', error);
                setAlert({ type: 'error', message: 'Failed to update child details' });
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

            <Container className="mt--7 mb-3" fluid>
                <Row className="justify-content-center">
                    <Col xl="12">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Children</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        {(!childrenData || !Array.isArray(childrenData) || childrenData.length < 2) && <Button color="primary" onClick={toggleModal}>Add</Button>}
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Form B / CNIC</th>
                                            <th scope="col">Institution Name</th>
                                            <th scope="col">Course</th>
                                            <th scope="col">Class</th>
                                            <th scope="col">Semester</th>
                                            <th scope="col">Year</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {childrenData && Array.isArray(childrenData) && childrenData.map((child, index) => (
                                            <tr key={index}>
                                                <td>{child.name}</td>
                                                <td>{child.form_b_cnic}</td>
                                                <td>{child.institution_name}</td>
                                                <td>{child.course}</td>
                                                <td>{child.class}</td>
                                                <td>{child.semester}</td>
                                                <td>{child.year}</td>
                                                <td>
                                                      <Button color="warning" size="sm" onClick={() => toggleEditModal(child)}>Edit</Button>{' '}
                                                    <Button color="danger" size="sm" onClick={() => handleDeleteChild(child.id)}>Delete</Button>
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
            <Modal isOpen={editModal} toggle={toggleEditModal} size="lg">
                <ModalHeader toggle={toggleEditModal}>Edit Child Details</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-name" className="form-control-label">Name</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-single-02" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-name" name="name" value={formData.name} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-cnic" className="form-control-label">Form B / CNIC</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-credit-card" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="number" id="edit-input-cnic" name="cnic" value={formData.cnic} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-institution" className="form-control-label">Institution Name</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-building" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-institution" name="institutionName" value={formData.institutionName} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-course" className="form-control-label">Course</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-books" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-course" name="course" value={formData.course} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-class" className="form-control-label">Class</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-hat-3" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-class" name="class" value={formData.class} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-semester" className="form-control-label">Semester</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-calendar-grid-58" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-semester" name="semester" value={formData.semester} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-year" className="form-control-label">Year</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-calendar-grid-58" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="number" id="edit-input-year" name="year" value={formData.year} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-rollnumber" className="form-control-label">Roll Number</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-key-25" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-rollnumber" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-fee-frequency" className="form-control-label">Fee Frequency</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-money-coins" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-fee-frequency" name="feeFrequency" value={formData.feeFrequency} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-fees-per-m-q-y" className="form-control-label">Fees per M/Q/Y</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-money-coins" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="number" id="edit-input-fees-per-m-q-y" name="feesPerMQY" value={formData.feesPerMQY} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-remaining-time" className="form-control-label">Remaining Time to Completion (yrs)</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-time-alarm" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="number" id="edit-input-remaining-time" name="remainingTime" value={formData.remainingTime} onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="edit-input-total-outstanding-fees" className="form-control-label">Total Outstanding Fees in PRS</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-money-coins" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="edit-input-total-outstanding-fees" name="totalOutstandingFees" value={formData.totalOutstandingFees} onChange={handleChange} required readOnly />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdateChild}>Update</Button>
                    <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={modal} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>Add Child Details</ModalHeader>
                <ModalBody>
                    {/* Add child details form goes here */}
                    <Form>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <label htmlFor="input-name" className="form-control-label">Name</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-single-02" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" id="input-name" name="name" placeholder="Name" onChange={handleChange} required />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label htmlFor="input-cnic" className="form-control-label">Form B / CNIC</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-credit-card" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" id="input-cnic" name="cnic" placeholder="Form B / CNIC" onChange={handleChange} required />
                                </InputGroup>
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <label htmlFor="input-institution" className="form-control-label">Institution Name</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-building" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" id="input-institution" name="institutionName" placeholder="Institution Name" onChange={handleChange} required />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label htmlFor="input-course" className="form-control-label">Course</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-books" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" id="input-course" name="course" placeholder="Course" onChange={handleChange} required />
                                </InputGroup>
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <label htmlFor="input-class" className="form-control-label">Class</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-hat-3" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" id="input-class" name="class" placeholder="Class" onChange={handleChange} required />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label htmlFor="input-semester" className="form-control-label">Semester</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-calendar-grid-58" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" id="input-semester" name="semester" placeholder="Semester" onChange={handleChange} required />
                                </InputGroup>
                            </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="input-year" className="form-control-label">Year</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-calendar-grid-58" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="input-year" name="year" placeholder="Year" onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="input-rollnumber" className="form-control-label">Roll Number</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-key-25" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="input-rollnumber" name="rollNumber" placeholder="Roll Number" onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="input-fee-frequency" className="form-control-label">Fee Frequency</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-money-coins" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="input-fee-frequency" name="feeFrequency" placeholder="Fee Frequency" onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="input-fees-per-m-q-y" className="form-control-label">Fees per M/Q/Y</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-money-coins" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="input-fees-per-m-q-y" name="feesPerMQY" placeholder="Fees per M/Q/Y" onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="input-remaining-time" className="form-control-label">Remaining Time to Completion (yrs)</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-time-alarm" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="input-remaining-time" name="remainingTime" placeholder="Remaining Time to Completion (yrs)" onChange={handleChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label htmlFor="input-total-outstanding-fees" className="form-control-label">Total Outstanding Fees in PRS</label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-money-coins" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" id="input-total-outstanding-fees" name="totalOutstandingFees" placeholder="Total Outstanding Fees in PRS" value={formData.totalOutstandingFees} readOnly />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddChild}>Add</Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </>
    );
};

export default Customers;