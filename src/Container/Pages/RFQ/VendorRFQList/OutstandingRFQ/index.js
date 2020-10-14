import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../../Component/Heading/PageHeading';
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../../Component/Loader'
import Alert from '../../../../../Component/Modal/alert'
import {UserDetails} from '../../../../../Common/LocalStorage'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {VendorRFQOutstandingDelete} from '../../../../../Apis/Approver'
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

            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
        }
    }

    componentDidMount(){
        this.props.get_search_list();
    }

    static getDerivedStateFromProps(props, state){
        if(props.search_result && props.search_result.length){
            console.log('getDerivedStateFromProps', (props.search_result) ? props.search_result : [])
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
            this.props.get_search_list();
        }
      
    }

    get_details(details){
        this.props.history.push({
            pathname : '/ViewPRDetails',
            datas : {
                PRM_PR_Index :  details.PRM_PR_Index,
                PRM_PR_No :  details.PRM_PR_NO,
            },
        })
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

    raise_details(details){
        let _details = UserDetails();
        this.props.history.push({
            pathname: '/CreateQuotationNew',
            datas: {
                RFQ_NO:details.RM_RFQ_No ,
                RFQ_ID:details.RM_RFQ_ID,
                vcomid :_details.UM_COY_ID,
                RESUBMIT:""
            },
            redirect_to_tab : 'OutstandingRFQ',
            redirect_to_page : 'VendorRFQList',
        });
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
            Doc_num: "",
            VenName: "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _tem_details.OutstandingRFQ = RemoveSpecialCharacter(_form_value)
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
   

    render(){
        
        const { handleSubmit } = this.props
        let  _table_data_header = [
            {name : "RFQ Number", id:"RM_RFQ_No", width:'160px', key:true, type:"index" , key:true, formatter: (cellContent, row) => {
              return (
                  <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.raise_details(row)}>{row.RM_RFQ_No} </button>
              )
            }},
            {name : "RFQ Description", id:"RM_RFQ_Name", width:'120px'},
            {name : "Creation Date", id:"RM_Created_On", width:'144px', dataFormat:"date"},
            {name : "Expire Date", id:"RM_Expiry_Date", width:'144px', dataFormat:"date"},
            {name : "Purchaser Company", id:"CM_COY_NAME", width:'144px'},
            
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              
              {(this.state.loading) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading  heading="Outstanding RFQ"  subheading="To delete the RFQ, select the RFQ and click Delete button. Click on the RFQ Number to create the quotation." 
            />
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_data_header} 
                            table_body={this.state.all_products} 
                            products={this.getProducts} select={false} selectname={'itemcode'} 
                            responsive={true} 
                            products={this.getProducts} 
                            select={true}
                            table_name="issue_grn"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-left">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={()=>this.confirm_function('delete', 'delete this RFQ')}>Delete</button>
                    </div>
                </div>
                </form>
                <Alert 
                    title="Validation" 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
                <ConfirmationModel
                     title="" 
                     confimation = {true}
                     message={this.state.modal_body} 
                     status={this.state.status} 
                     show={this.state.confimation_pop} 
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'OutstandingRFQ',
})(OutstandingRFQ);
