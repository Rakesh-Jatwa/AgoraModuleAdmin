
import React, {Fragment} from 'react'
import {Field} from 'redux-form';
import {normalizePhone} from '../../../../Actions/Common/Functions'
import {FromInputsParallel, FromSelectParallel, FormDatePickerParallel} from '../../../../Component/From/FromInputs';
let Filters = (props) =>{ 

   return <Fragment>

<div className="row mt-2">
   <Field component={FromInputsParallel} name="rfqDto.rfqNumber" placeholder="To Be Allocated By System" label="RFQ Number :" readonly={true} />
   <Field component={FromSelectParallel} name="rfqDto.currency" label="Currency :" >
   <option defaultValue=''>--Select--</option>
      {props.currency_list.map((res, index) => {return (<option key={index} value={res.CODE_ABBR}>{res.CODE_DESC}</option>)})}
   </Field>
  
</div>
<div className="row mt-2">
   <Field component={FromInputsParallel} name="rfqDto.RFQDescription" placeholder="RFQ Description" label="RFQ Description :" />
</div>
<div className="row mt-2">
      <Field type="text" name="rfqDto.rfqUIExpiryDate" selected={props.start_date} component={FormDatePickerParallel} className="form-control " placeholder="RFQ Expiry Date" label="RFQ Expiry Date :" onChange={props.handleDate.bind(this, 'start_date')} />
      <Field type="text" name="rfqDto.quotationUIValidityDate" selected={props.end_date} component={FormDatePickerParallel} className="form-control " placeholder="Quotation Validity Date" label="Quotation Validity Date :" onChange={props.handleDate.bind(this, 'end_date')} />
</div>
<div className="row mt-2">
   <Field component={FromInputsParallel} name="rfqDto.contactPerson" placeholder="Contact Person" label="Contact Person :" />
   <Field component={FromInputsParallel} name="rfqDto.contactNumber" placeholder="Contact Number" label="Contact Number :" />
</div>

<div className="row mt-2">
   <Field component={FromInputsParallel} name="rfqDto.email" placeholder="Enter Email" label="Email :" />
</div>

<div className="row mt-2">
   <Field component={FromSelectParallel} name="rfqDto.paymentTerm" label="Payment Term :" >
       <option defaultValue=''>--Select--</option>
      {props.payment_term_list.map((res, index) => {return (<option key={index} value={res.CODE_DESC}>{res.CODE_DESC}</option>)})}
   </Field>
   <Field component={FromSelectParallel} name="rfqDto.paymentMethod" label="Payment Method :" >
       <option defaultValue=''>--Select--</option>
      {props.payment_method_list.map((res, index) => {return (<option key={index} value={res.CODE_DESC}>{res.CODE_DESC}</option>)})}
   </Field>
</div>

<div className="row mt-2">
   <Field component={FromSelectParallel} name="rfqDto.shipmentMode" label="Shipment Mode :" >
       <option defaultValue=''>--Select--</option>
      {props.shipment_mode_list.map((res, index) => {return (<option key={index} value={res.CODE_DESC}>{res.CODE_DESC}</option>)})}
   </Field>
   <Field component={FromSelectParallel} name="rfqDto.shipmentTerm" label="Shipment Term :">
       <option defaultValue=''>--Select--</option>
      {props.shipment_term_list.map((res, index) => {return (<option key={index} value={res.CODE_DESC}>{res.CODE_DESC}</option>)})}
   </Field>
</div>


<div className="row mt-2">
      <Field component={FromInputsParallel} name="rfqDto.externalRemarks" placeholder="External Remarks" label="External Remarks :" />
</div>

</Fragment>

}
export default  Filters