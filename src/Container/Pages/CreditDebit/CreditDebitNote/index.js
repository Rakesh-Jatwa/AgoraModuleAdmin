import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import Loader from '../../../../Component/Loader'
import {UserDetails} from '../../../../Common/LocalStorage'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {DNCheck, CNCheck} from '../../../../Apis/Vendor'
import CreditView from '../CreditView'
import DebitView from '../DebitView'


class CreditDebitNote extends Component {
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this);
        this.CloseDetails = this.CloseDetails.bind(this);
        this.state = {
            products:[],
            file_upload :false,
            delete :false,
            loading:false,
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            type:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[],
            invoice_number :'',
            show_details : false,
            invDetails : [],
            lineItems : [],
            relatedCreditNotes : [],
            attachments : [],
            rerendered : false,
            rendered : false,
            render_table_input :  false,
            table_inputs : []
        }
    }

  


  

    closeModel (details){
       
        this.setState({
            model : false,
           
        })
    }

    CloseDetails = () =>{
        this.setState({
            show_details : false,
            type:'',
            lineItems : [],
            relatedCreditNotes : [],
            attachments : [],
        })
    }

    ProcessRecords = async(invoice_type)=>{
        let {invoice_number} = this.state
        if(invoice_number){
            this.setState({ loading:true})
            if(invoice_type=="credit"){
                let _status = await ApiExtract(CNCheck, { "invoiceNo":invoice_number});
                if(_status){
                    if(_status.status){
                        this.setState({
                            model:false,
                            loading:false,
                            type:'credit',
                            show_details :  (_status.response && _status.response.isRedirect) ?  _status.response.isRedirect : false
                        })
                    }
                    else{
                        this.setState({
                            status: _status.status,
                            model:true,
                            modal_body: _status.message,
                            loading:false,
                            type:'credit',
                            show_details : false
                        })
                    }   
                    
                }
            }
            else{
                
                let _status = await ApiExtract(DNCheck, { "invoiceNo":invoice_number});
                if(_status.status){
                    this.setState({
                        model:false,
                        loading:false,
                        type:'debit',
                        show_details :  (_status.response && _status.response.isRedirect) ?  _status.response.isRedirect : false
                    })
                }
                else{
                    this.setState({
                        status: _status.status,
                        model:true,
                        modal_body: _status.message,
                        loading:false,
                        type:'debit',
                        show_details : false
                    })
                }   
                
            }
        }   
        else{
            this.setState({
                modal_body:"Enter invoice Number",
                status: false,
                model : true
            })
        }
    }

  

   

    


    render(){
        const _user_details = UserDetails();
        const { handleSubmit } = this.props
        

      

        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.cn_loading) ? <Loader /> : '' }
              {(this.props.dn_loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.gpdf_loading) ? <Loader /> : '' }
              {(this.props.gdopdf_loading) ? <Loader /> : '' }
              {(this.props.file_upload_ld) ? <Loader /> : '' }
              {(this.props.fd_loader) ? <Loader /> : '' }
              {(this.props.fd_loading) ? <Loader /> : '' }
              {(!this.state.show_details) ? 
                <Fragment>
                   
                    <PageHeading  heading=""  subheading=" Fill in Invoice No and click Raise button to create Debit Note or Credit Note"  />
                    <hr></hr>
                    <div className="row mt-2">
                        <div className="col-md-12"><label>Invoice No.<span className="text-danger">*</span> :  </label></div>
                            <div className="col-md-6">
                                <input name="contractcatlog.ItemCode" rem={true} className="form-control" placeholder="Invoice Number" id="contractcatlog.ItemCode" value={this.props.invoice_number} onChange={(e)=>{
                                    this.setState({
                                        invoice_number : e.target.value
                                    })
                                }}/>
                            <div className="text-danger"></div>
                        </div>
                        <div className="col-12 col-sm-12 text-left">
                            <div className="mt-4 mb-5 row">
                                <div className="col-lg-auto col-md"> <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.ProcessRecords('credit')}>Raise Credit Note</button></div>
                                <div className="col-lg-auto col-md"> <button type="submit"  className="btn btn-outline-primary btn-sm" onClick={()=>this.ProcessRecords('debit')}>Raise Debit Note</button></div>
                                <div className="col-lg-auto col-md-auto"><button type="reset" className="btn btn-outline-danger btn-sm">RESET</button></div>
                            </div>
                        </div>
                    </div>  
                </Fragment> :''}
                
                 {(this.state.show_details && this.state.type=="credit") ?   <CreditView 
                    close={this.CloseDetails}
                    invoice_number = {this.state.invoice_number}
                    
                /> :''}

                
                {(this.state.show_details && this.state.type=="debit") ?  <DebitView 
                    close={this.CloseDetails}
                    invoice_number = {this.state.invoice_number}
                    
                /> :''}
                <Alert 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closeModel}
                />
       
        </Fragment>
    }
}

export default CreditDebitNote