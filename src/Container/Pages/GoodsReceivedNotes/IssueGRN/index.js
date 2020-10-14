import React, {Component, Fragment } from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import {FromInputs} from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {EscapeQuotes} from '../../../../validation/TableValidation'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class IssueGRN extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
    }

    componentDidMount(){
        let _post_data = { "issueGrn": { "PoNumber": "", "DoNumber": "" } };
        this.props.post_issue_grn(_post_data);
    }

    handlefromsubmit(values){
    
        let _form_value = values;
        let _initial_obj = {
            PoNumber: "",
            DoNumber: "",
        }
        _form_value.issueGrn = Object.assign({}, _initial_obj,(_form_value.issueGrn) ? _form_value.issueGrn : _form_value )
        _form_value.issueGrn = RemoveSpecialCharacter(_form_value.issueGrn)
        this.props.post_issue_grn(_form_value);
    }

    get_details(details){
        let _details = details
        _details.datas.fromview = "GRN"
        this.props.history.push({
            pathname : _details.pathname,
            datas : _details.datas,
        })
    }

    ClearAll = () => {
        this.props.reset('issuegrn')
    }

    get_details_page(details){
        this.props.history.push({
            pathname : '/purchaseorderDetails',
            datas : details,
        })
    }

    render(){
        const _table_header = [
            {name : "DO Number", id:"DOM_DO_NO", width:'60px', key:true, dataFormat:'button'},
            {name : "DO Date", id:"DOM_DO_DATE", width:'46px', dataFormat:'date'},
            {name : "PO Number", id:"POM_PO_NO", width:'65px'},
            {name : "PO Date", id:"POM_PO_DATE", width:'46px', dataFormat:'date'},
            {name : "Vendor Name", id:"CM_COY_NAME", width:'114px'},
        ];


       
        const { handleSubmit } = this.props
        return <Fragment>
                 {(this.props.loading) ? <Loader /> : '' }
                <PageHeading 
                    heading="Incoming Delivery Order" 
                    subheading="Select/fill in the search criteria and click Search button to list the relevant PO/DO." 
                />
                <TabHeading color={'bg-info  text-white'}>Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-2">    
                        <div className='col-12 col-md-6'>   
                            <div className="row">     
                                <Field type="text" name="issueGrn.PoNumber" normalize={EscapeQuotes} component={FromInputs} className="form-control" placeholder="PO Number" label="PO Number :" />
                            </div> 
                        </div>  
                        <div className='col-12 col-md-6'>   
                            <div className="row">   
                            <Field type="text" name="issueGrn.DoNumber" normalize={EscapeQuotes} component={FromInputs} className="form-control" placeholder="DO Number" label="DO Number :" />
                            </div>  
                        </div>
                        <div className="col-12">
                            <div className="text-right mt-2 row">
                                <div className="col-12 mt-2">
                                    <button type="submit" className="ml-4 btn btn-sm btn-outline-primary">Search</button>
                                    <button type="reset" className="ml-4 btn btn-outline-danger btn-sm" onClick={this.ClearAll} >Clear</button>
                                </div>
                            </div>
                         </div>  
                    </div>  
                </form>
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.get_issue_grn) ? this.props.get_issue_grn: [] } 
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