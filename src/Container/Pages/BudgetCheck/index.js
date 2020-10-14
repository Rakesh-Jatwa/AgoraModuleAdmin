import React,{Component, Fragment} from 'react';
import Loader from '../../../Component/Loader'
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import {UserDetails} from '../../../Common/LocalStorage'
import {GetCheckBudgetAmount} from '../../../Actions/Requester'
import {CheckBudgetTopup} from '../../../Apis/RequesterServices'
import Alert from '../../../Component/Modal/alert'
import {ApiExtract} from '../../../Common/GetDatas'
class BudgetCheck extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
         
        
        this.state = {
            products:{},
            modal_body : '',
            details:{},
            modal : false,
            status : false,
            modal : false,
            rendered: false,
            title:'',
            message:'',
            status:false,
            show:false,
            render:false,
            selected_row : [],
            user_details :{},
            reason:'',
            search_object : {
                "frm":"master",
                "role":""
            }
        }
    }

    componentDidMount(){
        let _user_details = UserDetails()
        if(_user_details && this.props.location  && this.props.location.data){
            let _details = this.props.location.data
            this.props.GetCheckBudgetAmount({amount:_details.amount, account_code:_details.AM_ACCT_CODE})
            this.setState({
                user_details : _user_details,
                details : _details,
                products : {
                    AM_ACCT_CODE : _details.AM_ACCT_CODE,
                    AM_ACCT_DESC : _details.AM_ACCT_DESC,
                    AM_ACCT_INDEX : _details.AM_ACCT_INDEX,
                    AM_ACCT_INDEX : _details.AM_DEPT_INDEX,
                }
            })
        }
    }



    closeModel (details){
        this.setState({
            show : false,
            rendered : false
        })
    }


    SendRequest = async() =>{
        let {reason} = this.state
        this.setState({loading:true})
        let _status =  await ApiExtract(CheckBudgetTopup, {remark:reason})
        if(_status){
            this.setState({
                title : '',
                loading : false,
                message : _status.response,
                status : _status.status,
                show  :  true 
            })
        }
    }

   
    
    render(){
    
        const _table_header = [{name : "Report Name", id:"RM_REPORT_NAME", key:true}]
        let {products, user_details} = this.state
        let {check_budget_amount} = this.props

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
           
              <div className="show_list">  
                <PageHeading  heading="Requisition Exceeds Budget" subheading="Your purchase has exceeded the current budget limit for the selected accounts under your profile. You may request for a budget top up through a finance manager in this form, or cancel the PR. An email will be sent to your finance manager. " />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Request Budget Top-up</TabHeading> 
                    <div className="row">    
                        <div className='col-12'>   
                            <div className="row">  
                                <div className='col-12 col-sm-8'>    
                                    <table className="table table-striped table-hover table-bordered mt-4">
                                        <tbody>
                                            <tr>
                                                <th>Department Name</th>
                                                <td>{products.AM_ACCT_DESC}</td>
                                            </tr>
                                            <tr>
                                                <th>Buyer Name: </th>
                                                <td>{user_details.UM_USER_NAME}</td>
                                            </tr>
                                            <tr>
                                                <th>Buyer ID: </th>
                                                <td>{user_details.UM_USER_ID}</td>
                                            </tr>
                                            <tr>
                                                <th>Buyer Email:  </th>
                                                <td>{user_details.UM_EMAIL}</td>
                                            </tr>
                                            <tr>
                                                <th>Current Account(s) Exceed :  </th>
                                                <td className="padding-none">
                                                    <table className="table margin-bottom-none">
                                                        <thead>
                                                            <tr>
                                                                <td>Budget Account Code</td>
                                                                <td>Amount Exceed</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th>{products.AM_ACCT_CODE}</th>
                                                                <td className="text-right">{(check_budget_amount) ? parseFloat(check_budget_amount).toFixed(2) : 0}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>  
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Remarks :  </th>
                                                <td><textarea onChange={(e)=>this.setState({reason:e.target.value})} className="form-control" /></td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>  
                                    <div className="row">  
                                        <div className='col-12 text-center'>  
                                            <button type="submit" className="btn btn-outline-primary mr-2" onClick={()=>this.SendRequest()}>Submit</button>  
                                            <button type="submit" className="btn btn-outline-danger mr-2" onClick={()=>this.props.history.push({
                                                pathname : this.state.details.page,
                                                reload:true}
                                            )}>Back</button>  
                                        </div>
                                    </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                    
                </div>
                <Alert 
                    title={''}
                    message={this.state.message} 
                    status={this.state.status} 
                    show={this.state.show} 
                    confirm={this.closeModel}
                />
     </Fragment>
    }
}


const mapStateToProps = state => ({
    check_budget_amount : state.check_budget_amount.responseList,
    loading : state.check_budget_amount.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetCheckBudgetAmount  : (values) => dispatch(GetCheckBudgetAmount(values)),
})

const BudgetCheckHolder = connect(mapStateToProps, mapDispatchToProps)(BudgetCheck);
export default BudgetCheckHolder