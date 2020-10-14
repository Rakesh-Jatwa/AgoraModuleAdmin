import React , {Component, Fragment} from 'react'
import {Field, reduxForm } from 'redux-form';
import {floatnumbers} from '../../../../validation/TableValidation'
import {FromInputsParallel, FromSelectParallel, FormDatePickerParallel} from '../../../../Component/From/FromInputs'
class NewInvoiceFilter  extends Component {
   componentDidMount(){

   }
   ClearAll = () =>{
      this.props.reset('invoice_filter_form')
      this.props.clear();
   }

   handleSelect = (details) =>{
      this.props.handle_options(details)
   }

    render(){
      const { handleSubmit } = this.props
      return <form onSubmit={handleSubmit(this.props.handlefiltersubmit.bind(this))} className="invoice_filter">
        <div className="mt-2 row invoice-filter">
            <Field type="text" name="invoiceDto.docNumber" component={FromInputsParallel} className="form-control" placeholder="Document No. " label="Document No. :" />
            <Field type="text" name="invoiceDto.vendorName" component={FromInputsParallel} className="form-control" placeholder="Vendor Name " label="Vendor Name : " />
       
           
        </div>
        
        <div className="mt-2 row invoice-filter">
            <Field name="invoiceDto.doctype" className="form-control mb-3" component={FromSelectParallel} label={"Document Type :"}>
               <option selected="selected" value="">--Select--</option>
               <option value="INV">Invoice</option>
               <option value="BILL">Bill</option>
               <option value="CN">Credit Note</option>
               <option value="DN">Debit Note</option>
               <option value="LETTER">Letter</option>
            </Field>
            <Field component="select" className="form-control mb-3" name="invoiceDto.currency" component={FromSelectParallel} label={"Currency :"}>
               <option selected value="" >--Select--</option>
               <option value="AUD">Australian Dollar</option>
               <option value="BDT">Bangladeshi Taka</option>
               <option value="BND">Brunei Dollar</option>
               <option value="CAD">Canadian Dollar</option>
               <option value="CNY">Chinese Renminbi</option>
               <option value="DKK">Danish Kroner</option>
               <option value="EUR">European Euro</option>
               <option value="HKD">Hongkong Dollar</option>
               <option value="INR">Indian Rupee</option>
               <option value="IDR">Indonesian Rupiah</option>
               <option value="JPY">Japanese Yen</option>
               <option value="KRW">Korean Won</option>
               <option value="MYR">Malaysian Ringgit</option>
               <option value="TWD">New Taiwan Dollar</option>
               <option value="NOK">Norwegian Kroner</option>
               <option value="NZD">NZ Dollar</option>
               <option value="PKR">Pakistan Rupee</option>
               <option value="PHP">Philippine Peso</option>
               <option value="SAR">Saudi Riyal</option>
               <option value="SGD">Singapore Dollar</option>
               <option value="LKR">Sri Lanka Rupee</option>
               <option value="GBP">Sterling Pound</option>
               <option value="SEK">Swedish Krona</option>
               <option value="CHF">Swiss Franc</option>
               <option value="THB">Thai Baht</option>
               <option value="AED">UAE Dirham</option>
               <option value="USD">US Dollar</option>
            </Field>
        </div>
        {( this.props.inv_type !="paid") ? 
        <Fragment>
        <div className="mt-2 row invoice-filter">
           <Field className="col-10" component="select" name="invoiceDto.paymentMode" component={FromSelectParallel} label={"Payment Mode : "}>
               <option selected value="" >--Select--</option>
               <option value="BD">Bank Draft</option>
               <option value="CH">Cashier's Order</option>
               <option value="Cheque">Cheque</option>
               <option value="LB">Local Bank Transfer</option>
               <option value="TT">Telegraphic Transfer</option>
           </Field>
           
           <Field type="text" name="invoiceDto.payment_date" selected={this.props.date}  component={FormDatePickerParallel} className="form-control" placeholder="Payment Due Date " label="Payment Due Date :" onChange={this.props.handledate.bind(this, 'payment_date')} clear={true}/>
          
        </div>
       
        <div className="mt-2 row invoice-filter">
            <Field className="col-10" component={FromSelectParallel} name="invoiceDto.companyResident" component={FromSelectParallel} label={"Company Resident : "}>
               <option selected value="">--Select--</option>
               <option value="Y">Resident</option>
               <option value="N">Non-Resident</option>
            </Field>
            <Field type="text" name="invoiceDto.fundType" component={FromSelectParallel} className="form-control" placeholder="Fund Type " label="Fund Type :" >
               <option value="">--Select--</option>
               {(this.props.invoice_fund_type) ? this.props.invoice_fund_type.map((list_details)=>{   
                     return <option value={list_details.AC_ANALYSIS_CODE}>{list_details.AC_ANALYSIS_CODE_DESC}</option>
               }) :''}
               
            </Field>
        </div>
       
        
        <div className="mt-2 row invoice-filter">
            <Field type="text" name="invoiceDto.amountFrom"normalize={floatnumbers} component={FromInputsParallel} className="form-control" placeholder="Amount From " label="Amount From : " />
            <Field type="text" name="invoiceDto.amountTo" normalize={floatnumbers} component={FromInputsParallel} className="form-control" placeholder="Amount To " label="Amount To : " />
        </div>
        
        </Fragment>
        :''
        }
         {( this.props.inv_type =="paid") ? 
         <div className="mt-2 row invoice-filter">
             <Field type="text" name="invoiceDto.StartDate" selected={this.props.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Payment Start Date  " label="Payment Start Date :"    onChange={this.props.handleDate.bind(this, 'start_date')} clear={true}/>
             <Field type="text" name="invoiceDto.EndDate" selected={this.props.end_data} value={this.props.end_data} component={FormDatePickerParallel} className="form-control" placeholder="Payment End Date " label="Payment End Date :" minDate={this.props.start_data}  onChange={this.props.handleDate.bind(this, 'end_date')} clear={true}/>
         </div>:''}
        <div className="mt-3 justify-content-end row">
           <div className="col-lg-auto col-md-auto"> <button type="submit" className="btn btn-outline-success btn-sm">Search</button></div>
           <div className="col-lg-auto col-md-auto"><button type="button" className="btn btn-outline-danger btn-sm" onClick={this.ClearAll}>Clear</button></div>
        </div>
       
     
     </form>
     
    }
}

export default reduxForm({
   form:'invoice_filter_form'
})(NewInvoiceFilter);