import React,{Component} from 'react';
import {Field, reduxForm } from 'redux-form';
import {LoginValidation} from '../../../validation'
import {UserLogin} from '../../../Actions/Auth'
import Common from '../../../Common'
import {connect} from 'react-redux';
import logo from './agora_logo-white.png'
import './login.css';
import Loader from '../../../Component/Loader'
class Login extends Component{

    componentDidMount(){
        localStorage.removeItem('list_details')
    }
   
    render(){
        
        const { handleSubmit, submitting } = this.props
        return <form onSubmit={handleSubmit(this.props.userlogin.bind(this))}  >
        {this.props.auth_details.loading ? <Loader />  : ''} 
        <section className="row login-container">
            <div className="form-container">
                <div className="form-box">
                    <div className="logo-container">
                        <img src={logo} className="logo" alt="logo"/>
                    </div>
                    <p className="description">Provide your company ID, user ID and password and hit Login Button.</p>
                        {this.props.auth_details && !this.props.auth_details.authstatus && this.props.auth_details.authmessage!=""  ? <p style={{color:'red', textAlign:'center'}}>{this.props.auth_details.authmessage}</p> : ''} 
                    <div className="row-form">
                        <i className="fa fa-home"></i>
                        <Field type="text" name="companyid" component={Common.renderInputPlain} className="form-control" placeholder="Company ID" />
                    </div>
                    <div className="row-form">
                        <i className="fa fa-user"></i>
                        <Field type="text" name="userid" component={Common.renderInputPlain} className="form-control" placeholder="User ID" />
                        
                    </div>
                    <div className="row-form">
                        <i className="fa fa-key"></i>
                        <Field type="password" name="password" component={Common.renderPasswordPlain} className="form-control" placeholder="Password" />
                    </div>
                    <div className="button-container">
                        <button type="submit" disabled={submitting} className="login-button">Login</button>
                    </div>
                    <p className="forgot-password">Forgot Password</p>
                    <p className="credits">All rights reserved @ Strateq Group</p>
                </div>
            </div>
        </section>
    </form>
                          
    }
}

const mapStateToProps = (state) =>({
    auth_details : state.auth,
})

const mapDispatchToProps = (dispatch) =>({
    userlogin : (values) => dispatch(UserLogin(values)),
})

const MainRoute = connect(mapStateToProps, mapDispatchToProps)(Login);

export default reduxForm({
    form:'login',
    validate:LoginValidation
})(MainRoute);