import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../../Component/Loader'
import Alert from '../../../../../Component/Modal/alert'
import Filters from '../Filters'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {VendorRFQOutstandingDelete} from '../../../../../Apis/Approver'
import {UserDetails} from '../../../../../Common/LocalStorage'
import ConfirmationModel from '../../../../../Component/Modal/ConfirmationModel'
import {RemoveSpecialCharacter} from '../../../../../Actions/Common/Functions'

class OutstandingRFQ extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.getProducts = this.getProducts.bind(this)
        this.state = {
            products:[],
            all_products:[],
            start_data:'',
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "1", "4,5,0", "3"],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            status : false, 
            loading: false, 
            checked_initial : [0,1,2],
            checked_details:[],
            default_div : "quotation_list",

            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
        }
    }

    componentDidMount(){
        this.props.get_search_list({com_name: '',rfq_num: ''});
    }

    static getDerivedStateFromProps(props, state){
        if(props.search_result){
            
            return {
                all_products: (props.search_result) ? props.search_result : []
            }
        }
        return null
    }

    closemodel = () => {
        this.setState({
            model : false
        })

        if(this.state.status){
            this.props.get_search_list({com_name: '',rfq_num: ''});
        }
    }

    get_details(details){
        this.props.history.push({
            pathname : '/ViewPRDetails',
            datas : {
                rfq_id :  details.RM_RFQ_ID,
                rfq_no :  details.RFQ_Number,
            },
        })
    }

    view_quotation = (row) => {
        let _details = UserDetails();
        this.props.history.push({
            pathname : '/view_quotation',
            datas : {
                vcomid :  _details.UM_COY_ID,
                rfq_id :  row.RM_RFQ_ID,
                rfq_no :  row.RFQ_Number,
            },
        })
    }

     view_rfq = (row) => {
         console.log('view_rfq', row)
        let _details = UserDetails();
        this.props.history.push({
            pathname : '/view_rfq',
            datas : {
                vcomid :  _details.UM_COY_ID,
                rfq_id :  row.RM_RFQ_ID,
                rfq_no :  row.RFQ_Number,
            },
        })
    }
    

    raise_details(details){
        this.props.history.push({
            pathname: '/view_rfq',
            datas : {
                vcomid :  details.UM_COY_ID,
                rfq_id :  details.RM_RFQ_ID,
                rfq_no :  details.RFQ_Number,
            },
        });
    }

    confirm_function = (type, text) => {
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            modal_body: `Are you sure that you want to ${text} ?`,
        })
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="delete"){
            this.deletePO()
        }
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
                end_data:date
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
            })
       }
    }

    handlefromsubmit(values){
        let _tem_details = {};
        let _form_value = values;
        let _initial_obj = {
            rfq_num: "",
            com_name: "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _tem_details = RemoveSpecialCharacter(_form_value)
        this.props.get_search_list(_tem_details)
    }

    getProducts (values, details){
        let _all_products = this.state.products;
        if(details){
            
            _all_products.push({RFQ_ID : values.RM_RFQ_ID})
            this.setState({
                products : _all_products
            })
        }
        else{
             let products = this.state.products.filter((fieldValue, index) =>fieldValue.RFQ_ID !== values.RM_RFQ_ID);
             this.setState({
                products : products
            })
        }
    }

   ViewDetails = (row) => {
     this.props.history.push({
         pathname : 'RFQComSummary',
         datas:row
     })
   }

   deletePO = async() =>{
     if(this.state.products && this.state.products.length){
        this.setState({
            loading:true
        })

        let _status =  await ApiExtract(VendorRFQOutstandingDelete, {RFQIDList:this.state.products})
        if(_status.status){
            this.setState({
                status: _status.status,
                model: true,
                modal_body: 'Quotation Deleted',
                loading:false,
                products : []
            })
        }
     }
     else{
         this.setState({
            modal_title:'Delete Quotation',
            modal_body:'Select atleast one quotation',
            model:true,
            status : false, 
         })
     }
   }

   ClearAll = () =>{
       this.props.reset('OutstandingRFQ')
   }
   

    render(){
        
        const { handleSubmit } = this.props
        let  _table_data_header = [
            
            {name : "RFQ Number", id:"RFQ_Number", width:'160px', key:true, type:"index" , key:true, formatter: (cellContent, row) => {
              return (
                  <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.raise_details(row)}>{row.RFQ_Number} {(row.isFlagShow) ? <i className="fa fa-flag-o unble_to_supply margin-none"></i> : ''} </button>
              )
            }},
            {name : "RFQ Description", id:"RFQ_Name", width:'120px'},
            {name : "Creation Date", id:"Creation_Date", width:'78px', dataFormat:"date"},
            {name : "Expire Date", id:"Expiry_Date", width:'65px', dataFormat:"date"},
            {name : "Purchaser Company", id:"Buyer_Company", width:'90px'},
           
            
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              { this.state.default_div=="quotation_list" &&  <div className="quotation_listing">
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                <PageHeading heading="" subheading="Fill in the search criteria and click Search button to list the relevant expired RFQ. To delete the RFQ, check the box and click the Delete button."  />               
                <div className="mt-2">
                    <Filters  type="quotation" />
                    <div className="row">
                        <div className="col-12">
                            <div className="text-right mt-2 row">
                                <div className="col-12 mt-2">
                                    <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                    <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <hr></hr>
                    
                    <div className="text-right mt-4 row">
                        <div className='col-12'>   
                            <BootstrapCustomTable 
                                table_header={_table_data_header} 
                                table_body={this.state.all_products} 
                                products={this.getProducts} 
                                select={true}
                                selectname={'itemcode'} 
                                responsive={true} 
                                select={true}
                                table_name="issue_grn"
                            />
                        </div>
                        <div className="row">
                            <div className="col-12 text-left">
                                    <button type="button" className="ml-4 btn btn-sm btn-outline-danger" onClick={()=>this.confirm_function('delete', 'delete this RFQ')}>Delete</button>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
               }
               <ConfirmationModel
                     title="" 
                     confimation = {true}
                     message={this.state.modal_body} 
                     status={this.state.status} 
                     show={this.state.confimation_pop} 
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />
                <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'OutstandingRFQ',
})(OutstandingRFQ);
