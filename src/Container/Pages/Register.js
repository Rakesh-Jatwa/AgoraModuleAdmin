import React,{Component} from 'react';
import { Col, Container, Label, Row } from 'reactstrap';
import {Link} from 'react-router-dom';
import {Field, reduxForm } from 'redux-form';
import {RegisterValidation} from '../../validation'
import Common from '../../Common'
class Login extends Component{
    componentDidUpdate(nextProps,nextState){

    }
    render(){
        const { handleSubmit, submitting } = this.props
        return <Container>
                    {this.props.loginmessage}
                    <div className="d-flex h-100  ">
                        <Col sm={12}>
                            <div className="row justify-content-center align-self-center">
                                <form onSubmit={handleSubmit(this.props.userlogin.bind(this))}>
                                    <Row>
                                        <Label htmlFor="exampleEmail" sm={12}>First Name</Label>
                                        <Col sm={12}>
                                            <Field type="text" name="first_name" component={Common.renderInput} className="form-control" placeholder="Enter Your First Name" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Label htmlFor="examplePassword" sm={12}>Last Name</Label>
                                        <Col sm={12}>
                                            <Field type="text" name="last_name" component={Common.renderInput} className="form-control" placeholder="Enter Your Last Name" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Label htmlFor="examplePassword" sm={12}>E-Mail</Label>
                                        <Col sm={12}>
                                            <Field type="text" name="email" component={Common.renderInput} className="form-control" placeholder="Enter EMail" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Label htmlFor="examplePassword" sm={12}>Mobile Number</Label>
                                        <Col sm={12}>
                                            <Field type="text" name="mobile_number" component={Common.renderInput} className="form-control" placeholder="Enter Your Mobile Number" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Label htmlFor="examplePassword" sm={12}>Password</Label>
                                        <Col sm={12}>
                                            <Field type="text" name="password" component={Common.renderInput} className="form-control" placeholder="Enter Your Password" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                            <div className="text-center">
                                                <button type="submit" disabled={submitting}>Register</button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12}>
                                            <div className="text-center">
                                                <Link to="/"> Login</Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                              
                            </div>
                        </Col>
                        
                    </div>
                </Container>
    }
}

export default reduxForm({
    form:'login',
    validate:RegisterValidation
})(Login);