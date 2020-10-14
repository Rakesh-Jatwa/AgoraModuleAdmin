import React,{Component} from 'react';
import {Field, reduxForm } from 'redux-form';
import {PasswordExpiredValidation} from '../../../validation'
import {UserLoading} from '../../../Actions/Auth'
import {GetChangePwdPageLoad} from '../../../Actions/Vendor'
import {ChangePassword} from '../../../Apis/Vendor'
import {ApiExtract} from '../../../Common/GetDatas'
import Common from '../../../Common'
import {connect} from 'react-redux';
import logo from './agora_logo-white.png'
import './login.css';
import Loader from '../../../Component/Loader'
import Alert from '../../../Component/Modal/alert'
class Login extends Component{
   
    constructor(props){
        super(props)
        this.closemodel = this.closemodel.bind(this);
        this.state= {
            status : false,
            model : false,
        }
    }
    closemodel = () => {
        this.setState({
            model : false,
            modal_error : false
        })
        if(this.state.status){
            this.props.history.push({
                pathname : '/'
            })
        }
    }
    componentDidMount(){
        let _details = localStorage.getItem('list_details')
        if(_details){
            _details = JSON.parse(_details);
            if(_details){
                this.props.ChangePwdPageLoad(_details)
                this.props.change('userId', _details.userId)
            }
        }
        
    }

    componentWillUnmount(){
        localStorage.removeItem('list_details')
    }

    ForgetPassword = async(values) =>{
        
        if(values){
            let _details = localStorage.getItem('list_details')
            if(_details){
                _details = JSON.parse(_details);
                values.companyId=_details.companyId
            }
           
            this.setState({loader:true})
            let _status = await ApiExtract(ChangePassword, values);
            if(_status){
                this.props.UserLoading()
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loader:false
                })
            }
        }
        else{
            this.setState({
                model:true,
                status:false,
                modal_body: 'Please fill all mandatory fields',
            })
        }
    }

    Back = () =>{
        this.props.UserLoading()
        this.props.history.push({
            pathname:'/'
        })
    }

    ClearAll = () =>{
        this.props.reset('password_expired')
    }
    

    render(){
        console.log('this.props',this.props)
        const { handleSubmit, submitting,auth_details,loading } = this.props
        return <form onSubmit={handleSubmit(this.ForgetPassword.bind(this))}  autocomplete="off">
        {loading ? <Loader />  : ''} 
        {this.state.loader ? <Loader />  : ''} 
        <section className="row login-container">
            <div className="form-container">
                <div className="form-box pass_exp">
                    <div className="logo-container">
                        <img src={logo} className="logo" alt="logo"/>
                    </div>
                    <h6 className="header_details"> Change Password</h6>  <p className="description"> {(auth_details.lblMsg) ?auth_details.lblMsg.replace(':','') : ''}</p>
                   
                    <p className="login_header">User Identification</p>
                        {this.props.auth_details && !this.props.auth_details.authstatus && this.props.auth_details.authmessage!=""  ? <p style={{color:'red', textAlign:'center'}}>{this.props.auth_details.authmessage}</p> : ''} 
                    <div className="row-form">
                        <i className="fa fa-home"></i>
                        <Field type="text" name="userId" component={Common.renderInputPlain} className="form-control" placeholder="User Id" readOnly={true} />
                    </div>
                    <div className="row-form">
                    <i className="fa fa-key"></i>
                        <Field type="password" name="oldPwd" component={Common.renderPasswordPlain} className="form-control" placeholder="Old Password" />
                    </div>
                    <div className="row-form">
                    <i className="fa fa-key"></i>
                        <Field type="password" name="newPwd" component={Common.renderPasswordPlain} className="form-control" placeholder="New Password" />
                        
                    </div>
                    <div className="row-form">
                        <i className="fa fa-key"></i>
                        <Field type="password" name="confirmPwd" component={Common.renderPasswordPlain} className="form-control" placeholder="Confirm New Password " />
                    </div>
                    <p className="login_header">Authentication Q&A</p>
                  
                    <div className="row-form">
                    
                        <Field type="password" name="questionIndex" component={'select'} className="form-control" placeholder="Answer">
                            <option value="---Select---">---Select Challenge Phrase---</option>
                            <option value="1">What is your mother's maiden name?</option>
                            <option value="2">What is your cat's name?</option>
                            <option value="3">What is your spouse's name?</option>
                            <option value="4">What is the color of your car?</option>
                            <option value="5">What is your favorite football team?</option>
                            <option value="6">Where did you meet your spouse?</option>
                            <option value="7">Where did you spend your honeymoon?</option>
                            <option value="8">What is the first name of your favorite uncle?</option>
                            <option value="9">What is your oldest cousin's name?</option>
                            <option value="10">What is your youngest child's nickname?</option>
                            <option value="11">What is your oldest child's nickname?</option>
                            <option value="12">What is the first name of your oldest niece?</option>
                            <option value="13">What is the first name of your oldest nephew?</option>
                            <option value="14">Who is your all-time favorite movie character?</option>
                            <option value="15">Who is your favorite author?</option>
                            <option value="16">What is the name of your favorite book?</option>
                            <option value="17">What is the last name of your favorite musician?</option>
                            <option value="18">What is the name of the street on which you grew up?</option>
                            <option value="19">What is the name of your favorite sports team?</option>
                            <option value="20">What was your first pet's name?</option>
                            <option value="21">What was the last name of your favorite teacher?</option>
                        </Field>
                    </div>

                    <div className="row-form">
                        <i className="fa fa-key"></i>
                        <Field type="password" name="answer" component={Common.renderInputPlain} className="form-control" placeholder="Answer" />
                    </div>

                    <div className="button-container text-center">
                        <button type="submit" disabled={submitting} className="btn btn-primary mr-2">Save</button>
                        <button type="reset" onClick={()=>this.ClearAll()}className="btn btn-warning mr-2">Clear</button>
                        <button type="button" className="btn btn-danger" onClick={()=>this.Back()}>Back</button>
                    </div>
                  
                    <p className="credits">All rights reserved @ Strateq Group</p>
                </div>
            </div>
        </section>
        <Alert 
            title="" 
            message={this.state.modal_body} 
            status={this.state.status} 
            show={this.state.model}
            confirm={this.closemodel}
        />
    </form>
                          
    }
}

const mapStateToProps = (state) =>({
    loading : state.change_password.loading,
    auth_details : state.change_password.responseList,
})
const mapDispatchToProps = (dispatch) =>({
    ChangePwdPageLoad : (values) => dispatch(GetChangePwdPageLoad(values)),
    UserLoading : ()=> dispatch(UserLoading()),
})
const MainRoute = connect(mapStateToProps, mapDispatchToProps)(Login);
export default reduxForm({
    form:'password_expired',
    validate:PasswordExpiredValidation
})(MainRoute);