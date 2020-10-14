import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import Alert from '../../../../Component/Modal/alert'
import {FromateDate_YY_MM_DD, DateMinus, CompareDate} from '../../../../Component/Dates'
import {FromInputsParallel, FromCheckBoxparallel, FormDatePickerParallel} from '../../../../Component/From/FromInputs'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class CreditNoteListing extends Component {
    constructor(props){
        var _date = new Date();
        _date.setMonth(_date.getMonth() - 6);
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.state = {
            products:[],
            start_data:_date,
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            end_data:new Date(),
            check_value:false,
            model:false,
            checked_initial : [1,2],
            checked_details:[],
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


    closeModel = () => {
        this.setState({
            modal : false
        })
    }

    componentDidMount(){
        var _date = new Date();
        _date.setMonth(_date.getMonth() - 6);
        this.props.change('cndn_search.start_date', _date);
        this.props.change('cndn_search.end_date', new Date());
    }

    handleCheckboxClick(e){
        let _value = e.target.getAttribute('data-value');
        if(e.target.checked){
            let _details = this.state.checked_details
            _value = parseInt(_value)
            if(_value){
                _details.push(_value);
            }
            console.log('_details', _details, _value)
            this.setState({
                checked_details : _details
            })
        }
        else{
            let checkbox_filter = this.state.checked_details.filter((fieldValue, index) => fieldValue != _value);
            this.setState({
                checked_details : checkbox_filter
           })  
        }
       
    }

    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        this.props.history.push({
            pathname : '/approvepr',
            datas : details.datas,
        })
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data: (date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data: (date) ? date : '',
            })
       }
    }

    handlefromsubmit(values){
        let _form_value = values;
        let {checked_details} = this.state
        let _initial_obj = {
            "cn_no":"",
            "inv_no":"",
            "cn_status":"",
            "start_date":"",
            "end_date":""
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.cndn_search) ? _form_value.cndn_search : {} )
        _form_value.start_date =  ( _form_value.start_date) ? FromateDate_YY_MM_DD( _form_value.start_date) : '';
        _form_value.end_date =  (_form_value.end_date) ? FromateDate_YY_MM_DD(_form_value.end_date) : '';
        _form_value.cn_status =  (checked_details && checked_details.length) ? checked_details.toString() : '';
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    modal : true
                })

            }
        }
        else{
            this.props.get_search_list(_form_value)
        }
       
    }

    SelectAll = () =>{
        this.setState({
            checked_details : [1,2],
        })
    }

    ClearAll = () =>{
        this.props.change('cndn_search.start_date','');
        this.props.change('cndn_search.end_date','');
        this.props.reset('CreditNoteListing')
        this.setState({
            start_data :'',
            end_data :'',
            checked_details : [],
        })
    }

    render(){
        
       
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Credit Note Number", id:"CNM_CN_NO", width:'200px', key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetGenerateCREDITPDF({'CN_NO': row.CNM_CN_NO, 'CN_BCoyID': row.CNM_CN_B_COY_ID, 'CN_SCoyID': row.CNM_CN_S_COY_ID})}>{row.CNM_CN_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Creation Date", id:"CNM_CREATED_DATE", width:'118px', dataFormat:'date'},
            {name : "Invoice Number", id:"POM_PO_NO", width:'200px', formatter: (cellContent, row) => {
                return (
                   (row.CNM_INV_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetInvoicePDF({'IM_INVOICE_NO': row.CNM_INV_NO, 'POM_B_COY_ID': row.CNM_CN_B_COY_ID, 'POM_S_COY_ID': row.CNM_CN_S_COY_ID})}>{row.CNM_INV_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button> : ''
                )
            }},
            {name : "Buyer Company", id:"CM_COY_NAME", width:'144px'},
            {name : "Currency", id:"CNM_CURRENCY_CODE", width:'122px'},
            {name : "Amount", id:"CNM_CN_TOTAL", width:'122px', dataFormat:'number'},
            {name : "Status", id:"STATUS_DESC", width:'110px'},
        ];



       
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.gpopdf_loading) ? <Loader /> : '' }
              {(this.props.ipdf_loading) ? <Loader /> : '' }
              {(this.props.credit_pdf_loading) ? <Loader /> : '' }
              
             
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant Credit Note." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="cndn_search.cn_no" component={FromInputsParallel} className="form-control" placeholder="Credit Note No. " label="Credit Note No. :" />
                            <Field type="text" name="cndn_search.inv_no" component={FromInputsParallel} className="form-control" placeholder="Invoice No. " label="Invoice No. :" />
                            <Field type="text" name="cndn_search.start_date" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date " label="Start Date :" onChange={this.handleDate.bind(this, 'start_date')}  clear={true}/>
                        <Field type="text" name="cndn_search.end_date" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallel} className="form-control" placeholder="End Date " label="End Date :" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')}  clear={true}/>
                        </div>
                        <div className="row">
                        </div>
                        <div className="row mt-2">    
                                <div className="col-lg-1 col-md-2 col-12">
                                    <p>Status :</p>
                                </div>
                                <div className="ml-5 col-12 col-md-1">
                                    <div className="row">
                                        <Field  id="New" component={FromCheckBoxparallel} type="New" name="cndn_search.PoStatus[0]" label="New" onClick={this.handleCheckboxClick}  checked={this.state.checked_details.includes(1)}  inputvalue={1}/>
                                    </div>
                                </div>
                                <div className="col-12 col-md-2">
                                    <div className="row">
                                        <Field  id="PendingApproval" component={FromCheckBoxparallel} type="New" name="cndn_search.PoStatus[1]" label="Acknowledged" onClick={this.handleCheckboxClick}   checked={this.state.checked_details.includes(2)} inputvalue={2} />
                                    </div>
                                </div>
                               
                        </div>
                    </div>  
                   
                       
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                <button type="button" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>this.SelectAll()}>Select All</button>
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
                            </div>
                        </div>
                    </div>
                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result) ? this.props.search_result : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}

                        />
                         <Alert 
                            message={this.state.modal_body}
                            status={this.state.status} 
                            show={this.state.modal} 
                            confirm={this.closeModel}
                        />
                    </div>
                </div>
                </form>
        </Fragment>
    }
}

export default reduxForm({
    form:'CreditNoteListing',
})(CreditNoteListing);
