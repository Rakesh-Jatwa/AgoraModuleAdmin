
import React from 'react'
import {Field } from 'redux-form';
import SelectField from '../../../../Component/SelectField'
import {FromInputsParallel, FormDatePickerParallel, FromCheckBoxparallel} from '../../../../Component/From/FromInputs';
let Filters = (props) =>{ 
    console.log('prop.handleChange',props)
   return  <div className='col-12 col-md-12 raise_rfq rfq_filter'>   
        <div className="row">
            
             <Field type="text" name="ConvertPrSearch.DocNum" component={FromInputsParallel} className="form-control" placeholder="RFQ / Quotation Number" label="RFQ / Quotation Number :" />
           
            <div className='col-12 col-md-6 '>  
                <div className="row">
                    <div className="col-12 col-md-3 parallel-label"><label>Vendor :</label></div>
                    <div className="col-12 col-md-9">
                        <SelectField options={(props.vendor_name_list_service && props.vendor_name_list_service.VendorList) ? props.vendor_name_list_service.VendorList : []} handleChange={props.handleChange} selectedOption={props.selectedOption}/>
                    </div>
                </div> 
            </div> 
          
        </div>
        <div className="row  parallel-label">
         {(props.type!="quotation") ? <Field type="text" name="ConvertPrSearch.StartDate" selected={props.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date :" onChange={props.handleDate.bind(this, 'start_date')} clear={true}/> : ''}
         {(props.type!="quotation") ? <Field type="text" name="ConvertPrSearch.EndDate" selected={props.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="End Date :" onChange={props.handleDate.bind(this, 'end_date')} clear={true}/>: ''}
        </div>
        {(props.type!="quotation") ? 
        <div className="row mt-2">    
            <div className="col-lg-2 col-md-2 col-12">
                <p>Item Type : </p>
            </div>
            <div className="col-12 col-md-1">
                <div className="row">
                    <Field  id="ConvertPrSearch.Spot" component={FromCheckBoxparallel} type="checkbox" name="ConvertPrSearch.Spot" label="Spot"  checked={props.checked_details.includes('1')} />
                </div>
            </div>
            <div className="col-12 col-md-1">
                <div className="row">
                    <Field  id="ConvertPrSearch.Stock" component={FromCheckBoxparallel} type="checkbox" name="ConvertPrSearch.Stock" label="Stock"  checked={props.checked_details.includes('2')} />
                </div>
            </div>
            <div className="col-12 col-md-2">
                <div className="row">
                    <Field  id="ConvertPrSearch.MRO" component={FromCheckBoxparallel} type="checkbox" name="ConvertPrSearch.MRO" label="MRO"  checked={props.checked_details.includes('3')} />
                </div>
            </div>
        </div>
        :''}

        {(props.type=="conver_pr_listing") ? 
        <div className="row mt-2">    
            <div className="col-lg-2 col-md-2 col-12">
                <p>Item Type : </p>
            </div>
            <div className="col-12 col-md-1">
                <div className="row">
                    <Field  id="ConvertPrSearch.Spot" component={FromCheckBoxparallel} type="checkbox" name="ConvertPrSearch.po" label="Po"  checked={props.checked_details.includes('1')} />
                </div>
            </div>
            
            <div className="col-12 col-md-1">
                <div className="row">
                    <Field  id="ConvertPrSearch.Stock" component={FromCheckBoxparallel} type="checkbox" name="ConvertPrSearch.rfq" label="RFQ"  checked={props.checked_details.includes('2')} />
                </div>
            </div>
        </div>
        :''}
        
    </div>  
}
export default  Filters