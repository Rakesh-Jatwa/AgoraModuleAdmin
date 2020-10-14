import React from 'react';
import {connect} from 'react-redux';
import {GetE2PApprovalDetails, GetAllPOApprovalDetails, GetPOApprovalSubmit, GetApprovalType, GetSaveApprovePerson} from '../../../../Actions/Requester'
import {E2PApprovalSubmit} from '../../../../Apis/RequesterServices';
import Alert from '../../../../Component/Modal/alert'
import Loader from '../../../../Component/Loader'
import {ApiExtract} from '../../../../Common/GetDatas'
class PurchaseApprovalSelect extends React.Component {
    constructor(props) {
        super(props);
        this.getApprovalLevelList = this.getApprovalLevelList.bind(this)
        this.closemodel = this.closemodel.bind(this)
        this.state = {
            approvalList: [],
            approvePersonDetails: [],
            selectedId: '',
            model:false,
            status:false,
            modal_body : false,
            blnCutPO: false,
            blnCutPAO: false,
            loading:false,
            GrpIndex:'',
            update_details :{}
        }
    }


    closemodel = () =>{
        this.setState({
            model:false,
            status:false,
            modal_body : false,
        })

        if(this.state.status){
            this.props.history.push({
                pathname:'/dashboard'
            })
        }
       
    }



    componentDidMount(){
        if(this.props.location && this.props.location.datas){
            this.setState({update_details : this.props.location.datas})
            this.props.GetApprovalType()
        }
        
    }
    submit = async() => {
        let _details = this.state.update_details
        let _details_resident  = (this.state.update_details && this.state.update_details.dsapplist)  ? this.state.update_details.dsapplist.filter((list_details)=>list_details.AGB_GRP_INDEX==this.state.GrpIndex) : [] 
        if(_details_resident && _details_resident.length){
            let _temp_details = { 
                "intInvIdx": (_details && _details.intInvIdx ) ? _details.intInvIdx: '' ,
                "intApprGrpIdx": this.state.GrpIndex,
                "PaymentAmt":  (_details && _details.PaymentAmt ) ? _details.PaymentAmt: '' ,
                "isResident" :  _details_resident[0].AGM_RESIDENT ,
            };

            this.setState({loading:true})
            let _status = await ApiExtract(E2PApprovalSubmit, _temp_details)
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
                if(_status.status){
                    localStorage.removeItem('e2p_aprov_details')
                    localStorage.removeItem('e2p_req_details')
                }        
            }
        }
       



        
        
    }

    async getApprovalLevelList (e){
    

        if( this.state && this.state.update_details && this.state.update_details.intInvIdx){
            let _select_target  = e.target.value;
            if (_select_target) {
              

                let req = { 
                        intWorkflowIndex: _select_target,
                        invoiceTotal : (this.state.update_details && this.state.update_details.PaymentAmt) ? this.state.update_details.PaymentAmt : 0,
                };
                console.log('getApprovalLevelList', req, this.props)
                this.setState({
                    GrpIndex :_select_target,

                })
                await this.props.GetE2PApprovalDetails(req)
                this.setState({ selectedId:  _select_target, loading:true });      
               
                setTimeout(() => { 

                    if(this.props.get_ao_list && this.props.get_ao_list.length>1){
                        this.props.get_ao_list[1].forEach((e) => {
                            e.strType = '';
                            e.Type = '';
                        }); 
                    } 
                    console.log('this.props.get_ao_list', this.props.get_ao_list_details)      
                    let temp = this.calculationfnc(this.props.get_ao_list[1], false, this.props.ApprovalType);
                    this.setState({ approvePersonDetails: temp, loading:false});
                
                }, 3000);
            } else {
                this.setState({ selectedId: e.target.value });
                this.setState({ approvePersonDetails: [] });
            }
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: 'PR Number is invalid',
                loading:false,
            })
        }

    }



    calculationfnc = (data, start, approvetype) => {
        let pocost = (this.state.update_details) ? this.state.update_details.PaymentAmt : ''
        data.forEach(e => {

            switch (approvetype) {

                case "C":
                    if (pocost < e.UM_APP_LIMIT) {
                        e.Type = '0';
                        e.strType = 'None';
                    } else {
                        e.Type = '1';
                        e.strType = 'Approval';
                        start = true;
                    }
                    break;
                case "B":
                    if (pocost <= e.UM_APP_LIMIT) {
                        e.Type = '1';
                        e.strType = 'Approval';
                    } else {
                        e.Type = '0';
                        e.strType = 'Endorsement';
                        start = true;
                    }
                    break;
                case "B+C":
                    if (e.AGA_TYPE) {
                        if (pocost) {
                            if (start) {
                                e.Type = '0';
                                e.strType = 'None';
                            } else {
                                e.Type = '1';
                                e.strType = 'Approval';
                                start = false;
                            }
                        } else {
                            e.Type = '0';
                            e.strType = 'Endorsement';
                           
                        }
                    }
                    else if (e.AGA_TYPE === "PAO") {
                        if (pocost) {
                            if (start) {
                                e.Type = '0';
                                e.strType = 'None';
                            } else {
                                e.Type = '1';
                                e.strType = 'Approval';
                                start = true;
                            }
                        } else {
                            e.Type = '0';
                            e.strType = 'Endorsement';
                            start = false;
                        }
                    }

                    break;
                case "A":
                    if (pocost < e.UM_APP_LIMIT) {
                        e.Type = '0';
                        e.strType = 'Approval';
                    } else {
                        e.Type = '0';
                        e.strType = 'Endorsement';
                    }
                    break;
                default:
                    break;
            }

        })
        return data;
    }



    


    render() {

        let approvalList = (this.state.update_details && this.state.update_details.dsapplist) ? this.state.update_details.dsapplist.map((fieldValue, index) => <option key={index} value={fieldValue.AGB_GRP_INDEX}>{fieldValue.AGM_GRP_NAME}</option>) :'';
        let approvalPersonList = this.state.approvePersonDetails.map((fieldValue, index) =>
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{fieldValue.AO_NAME}</td>
                <td>{fieldValue.AAO_NAME}</td>
                <td>{fieldValue.strType}</td>
            </tr>
        )

        return (
            <div>
               {this.props.spr_loading  ? <Loader /> : '' } 
               {this.props.get_appoval_list_details  && this.props.get_appoval_list_details.loading  ? <Loader /> : '' } 
               
               {this.state.loading  ? <Loader /> : '' } 
                <h6>Document</h6>
                <p>Please select the approval workflow from the approval list and submit the Document.</p>
                <div className="d-flex bg-info text-white p-1 mt-2">
                    <p> Approval Setup Header</p>
                </div>
                <table className="table table-bordered ">
                    <tbody>
                        <tr>
                            <th>Purchase OrderNo. :</th>
                            <td>{(this.state.update_details && this.state.update_details.inv_no) ? this.state.update_details.inv_no : '' }</td>
                        </tr>
                        
            
                        <tr>
                            <th> Approval List* :</th>
                            <td>
                               
                                <select className="form-control textboxstyle" onChange={this.getApprovalLevelList}>
                                    <option value=''>--Please Select--</option>
                                    {approvalList}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <table className="table table-bordered table-striped">
                    <tbody className="bg-info">
                        <tr>
                            <th>Level</th>
                            <th>Main AO</th>
                            <th>Alternative AO</th>
                            <th>Type</th>
                        </tr>

                    </tbody>
                    <tbody>
                        {approvalPersonList}
                    </tbody>
                </table>

                <p className="text-success">
                    * There are basically 3 types of approval for this approval sequence setup : </p><br></br>
                <ul>
                    <li className="text-success">Approval - PR will be sent to the respective approving officer for approval</li>
                    <li className="text-success">Endorsement - PR will be sent to the respective approving officer for endorsement</li>
                    <li className="text-success">None - Approving officer has no authority to approve/endorse this PR</li>
                </ul>

                <div className="mt-2 row">
                    <div className="col-12 col-sm-6 text-left go-back">
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{
                                if(this.props.history){
                                    this.props.history.push({
                                        pathname : '/e2p_document',
                                        datas:"from_approval"
                                    })
                                }
                            }} >Back</button>
                        <button type="button" onClick={this.submit} className="ml-2 btn btn-sm btn-outline-primary textboxstyle" value="Submit">Submit</button>
                    </div>
                </div>

                
                <Alert 
                    title={''} 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />

            </div>
        )
    }

}


const mapStateToProps = state => ({
    get_ao_list : state.e2p_approval_details.responseList,
    get_ao_list_details : state.e2p_approval_details,

    approvalList : state.get_po_all_approval_list.responseList,
    get_appoval_list_details : state.get_po_all_approval_list,


    ApprovalType : state.get_approval_type.responseList,
    get_approval_type_details : state.get_approval_type,

    get_final_submit_pr : state.po_approval_submit.responseList,
    get_final_submit_pr_details : state.po_approval_submit,
    spr_loading: state.po_approval_submit.loading,
  })

  
  const mapDispatchToProps = dispatch => ({
    GetE2PApprovalDetails : (values) => dispatch(GetE2PApprovalDetails(values)),
    GetAllPOApprovalDetails : (values) => dispatch(GetAllPOApprovalDetails(values)),
    GetPOApprovalSubmit : (values) => dispatch(GetPOApprovalSubmit(values)),
    GetApprovalType : (values) => dispatch(GetApprovalType(values)),
    GetSaveApprovePerson : (values) => dispatch(GetSaveApprovePerson(values)),
    
  })
  
  
  
const PRApprovalSelectHolder = connect(mapStateToProps, mapDispatchToProps)(PurchaseApprovalSelect);
export default PRApprovalSelectHolder;
