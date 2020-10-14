import React, {Component, Fragment } from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import {FromInputs} from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
class IssueGRN extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
    }

    componentDidMount(){
        let _post_data = { "issueGrn": { "PoNumber": "", "DoNumber": "" } };
        this.props.post_issue_grn();
    }

    handlefromsubmit(values){
        let _form_value = values;
        let _initial_obj = {
            PoNumber: "",
            DoNumber: "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.issueGrn) ? _form_value.issueGrn : _form_value )
        this.props.post_issue_grn({issueGrn:_form_value});
    }

    get_details(details){
        let _details =  details
        _details.DOM_D_Addr_Code = _details.POD_D_ADDR_CODE
        this.props.history.push({
            pathname : '/deliveryorderview',
            datas : details,
        })
    }

    render(){
     
        const _table_header = [
            {name : "PO Number", id:"POM_PO_No", width:'180px', key:true,  formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={()=>this.get_details(row)}>{row.POM_PO_No} 
                    <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span>
                    {row.HAS_ATTACHEMENT==1?<i className="fa fa-paperclip" style={{ color: 'brown',fontWeight:900 }} aria-hidden="true"></i>:""} 
                    </button>
                )
            }},
            {name : "PO Date", id:"POM_PO_Date", width:'100px', dataFormat:"POM_PO_Date"},
            {name : "Due Date", id:"DUE_DATE", width:'100px',dataFormat:"DUE_DATE"},
            {name : "Buyer Company", id:"CM_COY_NAME", width:'200px'},
            {name : "Delivery Address Code", id:"POD_D_ADDR_CODE", width:'170px'},
            {name : "Ordered Qty", id:"Tot", width:'108px',  dataFormat:'price'},
            {name : "Outstanding Qty", id:"Outs", width:'140px', dataFormat:'price'},
        ];
        const { handleSubmit } = this.props
        return <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                <PageHeading 
                    heading="Outstanding PO"
                    subheading="Click the PO Number to go to DO Details page." 
                />
           
                

                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.get_issue_grn && this.props.get_issue_grn.GetOutStandingPOWithDAddress) ? this.props.get_issue_grn.GetOutStandingPOWithDAddress : [] } 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                        />

                    </div>
                </div>
        </Fragment>
    }
}

export default reduxForm({
    form:'issuegrn',
})(IssueGRN);