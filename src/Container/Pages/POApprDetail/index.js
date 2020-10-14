import React from 'react';
import {connect} from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import {GetPOApprovalDetails, GetAllPOApprovalDetails, GetPOApprovalSubmit, GetApprovalType, GetSaveApprovePerson} from '../../../Actions/Requester'
import {POApprovalSubmit} from '../../../Apis/RequesterServices';
import Alert from '../../../Component/Modal/alert'
import Loader from '../../../Component/Loader'
import {ApiExtract} from '../../../Common/GetDatas'
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
            active_key : 'PurchaseOrder',
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
            this.setState({
                update_details : this.props.location.datas
            })
            this.props.GetApprovalType()
            this.props.GetAllPOApprovalDetails(this.props.location.datas)
        }
        
    }
    submit = async() => {
        let prNo = { 
            "lblPONo": (this.state.update_details && this.state.update_details.lblPONo ) ? this.state.update_details.lblPONo : '' ,
            "prIndex": (this.state.update_details && this.state.update_details.prIndex ) ? this.state.update_details.prIndex : '' ,
            "AOList": this.state.approvePersonDetails
        };



        let tempAOList = [];
        if(this.state.approvePersonDetails && this.state.approvePersonDetails.length>0){
            for (let index = 0; index < this.state.approvePersonDetails.length; index++) {
                const element = this.state.approvePersonDetails[index];
                let temp = {
                    AO: element.AGA_AO,
                    AAO: element.AGA_A_AO,
                    Seq: element.AGA_SEQ,
                    Type: element.Type,
                    GrpIndex: this.state.GrpIndex,
                    Relief: element.AGA_RELIEF_IND,
                }
                if (element.strType != "None") {
                    tempAOList.push(temp);
                }
            }
        }
        
        prNo.AOList = tempAOList;

        // let appp = this.state.approvePersonDetails.filter((fieldValue, index) => fieldValue.type !== 'None');
        let dto = prNo
        this.setState({loading:true})
        let _status = await ApiExtract(POApprovalSubmit, dto)
        if(_status){
            if(_status.status){
                localStorage.removeItem('po_form')
            }
            
            this.setState({
                status: _status.status,
                model:true,
                modal_body: _status.message,
                loading:false,
            })
        }

    }

    async getApprovalLevelList (e){
        
        if(e.target.value){
            
            
        }

        if( this.state && this.state.update_details && this.state.update_details.lblPONo){
            let _select_target  = e.target.value;
            if (_select_target) {
              
                let req = { AGA_GRP_INDEX: _select_target};
                this.setState({
                    GrpIndex :_select_target
                })
                await this.props.GetPOApprovalDetails(req)
                this.setState({ selectedId:  _select_target, loading:true });            
                setTimeout(() => { 

                    if(this.props.get_ao_list && this.props.get_ao_list.getAOList){
                        this.props.get_ao_list.getAOList[0].forEach((e) => {
                            e.strType = '';
                            e.Type = '';
                        }); 
                    } 
                    let temp = this.calculationfnc(this.props.get_ao_list.AOList.getAOList[0], false, this.props.ApprovalType);
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
        // let prcost = this.props.location.datas.pr_cost;
        let pocost = (this.state.update_details) ? this.state.update_details.POCost : ''
        data.forEach(e => {
            console.log('calculationfnc', pocost, e.UM_APP_LIMIT, approvetype)
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
                        e.Type = '2';
                        e.strType = 'Endorsement';
                        start = true;
                    }
                    break;
                case "B+C":
                    if (e.AOSource === "AO") {
                        if (pocost <= e.UM_APP_LIMIT) {
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
                        }
                    }
                    else if (e.AOSource === "PAO") {
                        if (pocost <= e.UM_APP_LIMIT) {
                            if (start) {
                                e.Type = '0';
                                e.strType = 'None';
                            } else {
                                e.Type = '1';
                                e.strType = 'Approval';
                                start = true;
                            }
                        } else {
                            e.Type = '1';
                            e.strType = 'Endorsement';
                        }
                    }

                    break;
                case "A":
                    if (pocost < e.UM_APP_LIMIT) {
                        e.Type = '1';
                        e.strType = 'Approval';
                    } else {
                        e.Type = '2';
                        e.strType = 'Endorsement';
                    }
                    break;
                default:
                    break;
            }
        });
        return data;
    }

    PrevUrl = () =>{
        this.props.history.push({
            pathname : '/RaisePo',
            reload:true
        })
    }

    


    render() {

        let approvalList = (this.props.approvalList && this.props.approvalList.AOList && this.props.approvalList.AOList.dsApprovalList) ? this.props.approvalList.AOList.dsApprovalList.map((fieldValue, index) => <option key={index} value={fieldValue.AGA_GRP_INDEX}>{fieldValue.AGM_GRP_NAME}</option>) :'';
        let approvalPersonList = this.state.approvePersonDetails.map((fieldValue, index) =>
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{fieldValue.AO_NAME}</td>
                <td>{fieldValue.AAO_NAME}</td>
                <td>{fieldValue.strType}</td>
            </tr>
        )

        return (
            <div id="tabs">
                <Tabs defaultActiveKey="ConvertOrder" transition={false} activeKey={this.state.active_key} onSelect={k => {
                    if(k=="profile"){
                        this.props.history.push({
                            pathname : '/raiseFFPO',
                            redirect_to_tab : 'profile',
                        })
                    }
                    else if(k=="contact"){
                        this.props.history.push({
                            pathname : '/raiseFFPO',
                            redirect_to_tab : 'contact',
                        })
                    }
                         
              }}>
                <Tab eventKey="PurchaseOrder" title="Purchase Order">
                    <div className="tab-content py-3 px-3 px-sm-0">
                    {this.props.spr_loading  ? <Loader /> : '' } 
                    {this.props.get_appoval_list_details  && this.props.get_appoval_list_details.loading  ? <Loader /> : '' } 
                    
                    {this.state.loading  ? <Loader /> : '' } 
                        <h6>Raise PO </h6>
                        <p>Please select the approval workflow from the approval list and submit the PO.</p>
                        <div className="d-flex bg-info text-white p-1 mt-2">
                            <p> Approval Setup Header</p>
                        </div>
                        <table className="table table-bordered ">
                            <tbody>
                                <tr>
                                    <th>Purchase OrderNo. :</th>
                                    <td>{(this.props.location && this.props.location.datas && this.props.location.datas.lblPONo) ? this.props.location.datas.lblPONo : '' }</td>
                                </tr>
                                {(this.props.approvalList && this.props.approvalList.AOList && this.props.approvalList.AOList.lblRequesterID) ? 
                                <tr>
                                    <th> Requester ID :</th>
                                    <td> {this.props.approvalList.AOList.lblRequesterID} </td>
                                </tr>
                                : ''}
                                {(this.props.approvalList && this.props.approvalList.AOList && this.props.approvalList.AOList.lblRequesterID) ? 
                                <tr>
                                    <th>Requester Name :</th>
                                    <td> {this.props.approvalList.AOList.lblRequesterName} </td>
                                </tr>
                                : ''}

                                {(this.props.approvalList && this.props.approvalList.AOList && this.props.approvalList.AOList.lblRequesterID) ? 
                                <tr>
                                    <th> PR Cost Centre :</th>
                                    <td> {this.props.approvalList.AOList.lblPRCostCentre} </td>
                                </tr>
                                : ''}

                                {(this.props.approvalList && this.props.approvalList.AOList && this.props.approvalList.AOList.lblRequesterID) ? 
                                <tr>
                                    <th> PR Approval Group Name :</th>
                                    <td> {this.props.approvalList.AOList.lblPRGApprovalGrp} </td>
                                </tr>
                                : ''}
                            
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
                            <tbody className="bg-info color-white">
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
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.PrevUrl()} >Back</button>
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
                    </Tab>
                    <Tab eventKey="profile" title="Purchase Order Cancellation">
                        <div className="tab-content py-3 px-3 px-sm-0">
                        </div>
                    </Tab>
                    <Tab eventKey="contact" title="Free Form Purchase Order">
                        <div className="tab-content py-3 px-3 px-sm-0">
                        </div>
                    </Tab>
                </Tabs>
            </div>
        )
    }

}


const mapStateToProps = state => ({
    get_ao_list : state.po_approval_setup.responseList,
    get_ao_list_details : state.po_approval_setup,

    approvalList : state.get_po_all_approval_list.responseList,
    get_appoval_list_details : state.get_po_all_approval_list,


    ApprovalType : state.get_approval_type.responseList,
    get_approval_type_details : state.get_approval_type,

    get_final_submit_pr : state.po_approval_submit.responseList,
    get_final_submit_pr_details : state.po_approval_submit,
    spr_loading: state.po_approval_submit.loading,
  })

  
  const mapDispatchToProps = dispatch => ({
    GetPOApprovalDetails : (values) => dispatch(GetPOApprovalDetails(values)),
    GetAllPOApprovalDetails : (values) => dispatch(GetAllPOApprovalDetails(values)),
    GetPOApprovalSubmit : (values) => dispatch(GetPOApprovalSubmit(values)),
    GetApprovalType : (values) => dispatch(GetApprovalType(values)),
    GetSaveApprovePerson : (values) => dispatch(GetSaveApprovePerson(values)),
    
  })
  
  
  
const PRApprovalSelectHolder = connect(mapStateToProps, mapDispatchToProps)(PurchaseApprovalSelect);
export default PRApprovalSelectHolder;
