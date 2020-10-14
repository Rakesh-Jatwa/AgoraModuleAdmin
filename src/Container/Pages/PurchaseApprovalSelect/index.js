import React from 'react';
import {connect} from 'react-redux';
import {GetAOList, GetAppovalList, GetFinalSubmitPR, GetApprovalType, GetSaveApprovePerson,ResetPr} from '../../../Actions/Requester'
import {FinalSubmitPR} from '../../../Apis/RequesterServices';
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
            approval_flow:{},
        }
    }

    closemodel = () =>{
        this.setState({
            model:false,
            status:false,
            modal_body : false,
        })

        if(this.state.status){
            window.open('/', '_self');
        }
       
    }



    componentDidMount(){
        let _details = localStorage.getItem('pr_approval_flow')
        if(_details){
            _details = JSON.parse(_details)
            console.log('_details', _details)
            this.setState({
                approval_flow : _details
            })
            this.props.GetApprovalType()
            this.props.GetAppovalList({PR_TOTAL_COST:(_details.datas) ?_details.datas.PR_TOTAL_COST : ''})
        }
       
       
    }
    submit = () => {

        this.props.ResetPr()
        let prNo = { "prNo": (this.state.approval_flow) ? this.state.approval_flow.datas.pr_no : '', "groupindexId": this.state.selectedId };
        let appp = this.state.approvePersonDetails.filter((fieldValue, index) => fieldValue.type !== 'None');
        let dto = { appp, ...prNo };
        this.props.GetSaveApprovePerson(dto)

    }

    async getApprovalLevelList (e){
        if( this.state.approval_flow && this.state.approval_flow.datas && this.state.approval_flow.datas.pr_no ){
            let selectedValue = e.target.value;
            if (selectedValue) {
                await this.props.GetAOList({ "AGA_GRP_INDEX": selectedValue})
                this.setState({ selectedId: selectedValue, loading:true });
                
                setTimeout(() => { 

                    if(this.props.get_ao_list && this.props.get_ao_list.getAOList){
                        this.props.get_ao_list.getAOList[0].forEach((e) => {
                            e.strType = '';
                            e.Type = '';
                        }); 
                    } 
                    let temp = this.calculationfnc(this.props.get_ao_list.getAOList[0], false, this.props.ApprovalType);
                    this.setState({ approvePersonDetails: temp, loading:false});
                
                }, 1000);
                
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
        let prcost = (this.state.approval_flow) ? this.state.approval_flow.datas.pr_cost : 0;
        data.forEach(e => {
            switch (approvetype) {
                case 'B+C':
                    if (e.AOSource === "AO") {
                        if (prcost <= e.UM_APP_LIMIT) {
                            if (start) {
                                e.Type = '0';
                                e.strType = 'None';
                            }
                            else {
                                e.Type = '1';
                                e.strType = 'Approval';
                                start = true;
                            }
                        }
                        else {
                            e.Type = '2';
                            e.strType = 'Endorsement';
                        }
                    }
                    else if (e.AOSource === 'PAO') {
                        if (prcost <= e.UM_APP_LIMIT) {
                            if (start) {
                                e.Type = '0';
                                e.strType = 'None';
                            }
                            else {
                                e.Type = '1';
                                e.strType = 'Approval';
                                start = true;
                            }
                        }
                        else {
                            e.Type = '2';
                            e.strType = 'Endorsement';
                        }
                    }
                    break;
                case "C":
                    if (prcost < e.UM_APP_LIMIT) {
                        if (start) {
                            e.Type = '0';
                            e.strType = 'None';
                        } else {
                            e.Type = '1';
                            e.strType = 'Approval';
                            start = true;
                        }
                    }
                    else {
                        e.Type = '0';
                        e.strType = 'None';

                    }
                    break;

                case "B":

                    if (prcost <= e.UM_APP_LIMIT) {
                        e.Type = '1';
                        e.strType = 'Approval';
                    } else {
                        e.Type = '2';
                        e.strType = 'Endorsement';
                    }
                    break;

                case "A":
                    if (prcost < e.UM_APP_LIMIT) {
                        e.Type = '1';
                        e.strType = 'Approval';
                    } else {
                        e.Type = '0';
                        e.strType = 'None';
                    }
                    break;
                default:
                    break;
            }
        });
        return data;
    }



     onsubmit = async() => {
        let selectedValue = this.state.selectedId;
        if (selectedValue != '') {
            
            var tempapprovallist = this.state.approvePersonDetails.filter((va, i) => {
                va['GrpIndex'] = this.state.selectedId;
                return va.strType !== 'None';
            })
            let temparr = { 'aoList': tempapprovallist, "prDto": { "prNo": this.state.approval_flow.datas.pr_no, "msg": this.state.approval_flow.datas.msg } }
            this.setState({
                loading:true,
            })
            let _status = await ApiExtract(FinalSubmitPR, temparr)
            if(_status){
                localStorage.removeItem('pr_approval_flow')
                localStorage.removeItem('pr_details')
                
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        } 
        else {
            this.setState({
                status: false,
                model:true,
                modal_body: 'Select approver form your approval list',
                loading:false,
            })
        }
    }

    componentWillUnmount(){
        localStorage.removeItem('pr_approval_flow')
    }


    render() {

        let approvalList = (this.props.approvalList && this.props.approvalList.getAppovalList) ? this.props.approvalList.getAppovalList.map((fieldValue, index) => <option key={index} value={fieldValue.AGA_GRP_INDEX}>{fieldValue.AGM_GRP_NAME}</option>) :'';

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
                {this.state.loading  ? <Loader /> : '' } 
                {this.props.al_loading  ? <Loader /> : '' } 
              
                <table className="table table-bordered ">
                    <tbody >
                        <tr>
                            <th> Purchase Requisition  No. :</th>
                            <td>{(this.props.location && this.state.approval_flow.datas ) ? this.state.approval_flow.datas.pr_no : ''}</td>
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
                <p className="text-success">* Indicates required field</p><br></br>
                <table className="table table-bordered table-striped">
                    <tbody className="bg-info color-white">
                        <tr>
                            <th>Level</th>
                            <th>Main AO</th>
                            <th>Alternative AO</th>
                            <th>Type*</th>
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
                            localStorage.removeItem('pr_approval_flow')
                            this.props.history.push({
                                pathname: "/purchaseRequest",
                                datas : "approval"
                            })
                        }} >Back</button>
                        <button type="button" onClick={this.onsubmit} className="ml-2 btn btn-sm btn-outline-primary textboxstyle" value="Submit">Submit</button>
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
    get_ao_list : state.get_ao_list.responseList,
    get_ao_list_details : state.get_ao_list,

    approvalList : state.get_appoval_list.responseList,
    al_loading : state.get_appoval_list.loading,
    get_appoval_list_details : state.get_appoval_list,

    get_final_submit_pr : state.get_final_submit_pr.responseList,
    get_final_submit_pr_details : state.get_final_submit_pr,
    spr_loading: state.get_final_submit_pr.loading,

    ApprovalType : state.get_approval_type.responseList,
    get_approval_type_details : state.get_approval_type,

    get_save_approve_person : state.get_save_approve_person.responseList,
    get_save_approve_person_details : state.get_save_approve_person,
  })

  
  const mapDispatchToProps = dispatch => ({
    GetAOList : (values) => dispatch(GetAOList(values)),
    GetAppovalList : (values) => dispatch(GetAppovalList(values)),
    GetFinalSubmitPR : (values) => dispatch(GetFinalSubmitPR(values)),
    GetApprovalType : (values) => dispatch(GetApprovalType(values)),
    GetSaveApprovePerson : (values) => dispatch(GetSaveApprovePerson(values)),
    ResetPr : () =>dispatch(ResetPr()), 
  })
  
  
const PRApprovalSelectHolder = connect(mapStateToProps, mapDispatchToProps)(PurchaseApprovalSelect);
export default PRApprovalSelectHolder;
