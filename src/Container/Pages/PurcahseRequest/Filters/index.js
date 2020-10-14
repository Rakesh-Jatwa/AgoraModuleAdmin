
import React from 'react'
import {Field } from 'redux-form';
import {FromInputsParallel,FromSelectParallel, FormDatePickerParallel, FromCheckBoxparallel} from '../../../../Component/From/FromInputs';
let Filters = (props) =>{ 

   return  <div className='col-12 col-md-12 convert_pr'>   
        <div className="row">
            <Field type="text" name="ConvertPrSearch.PRNo" component={FromInputsParallel} className="form-control" placeholder="PR No. " label="PR No. :" />
            {(props.type=="conver_pr") ?<Field name="ConvertPrSearch.CommodityType" className="form-control mb-3" component={FromSelectParallel} label={"Commodity Type :"}>
            <option selected value="">--Select--</option>
            {props.commodity_list && props.commodity_list.CommodityList && props.commodity_list.CommodityList.map((list)=>{
                return     <option key={list.value} value={list.value} >{list.label}</option>
            })} 
        </Field>
        : ''}
            {(props.type=="conver_pr_listing") ? <Field type="text" name="ConvertPrSearch.ConvertedDocNo" component={FromInputsParallel} className="form-control" placeholder="Converted Doc No." label="Converted Doc No. :" /> : ''}
        </div>
        <div className="row">
            <Field type="text" name="ConvertPrSearch.StartDate" selected={props.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date :" onChange={props.handleDate.bind(this, 'start_date')}  clear={true}/>
            <Field type="text" name="ConvertPrSearch.EndDate" selected={props.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="End Date :" minDate={props.start_data} onChange={props.handleDate.bind(this, 'end_date')} clear={true}/>
        </div>
        {(props.type=="conver_pr") ? 
        <div className="row mt-2">    
            <div className="col-lg-2 col-md-2 col-12">
                <p>Item Type : </p>
            </div>
            <div className="col-12 col-md-1">
                <div className="row">
                    <Field  id="ConvertPrSearch.Spot[1]" component={FromCheckBoxparallel} type="checkbox" onClick={props.handleCheckbox} name="ConvertPrSearch.Spot" label="Spot"  checked={props.checked_details.includes('1')} />
                </div>
            </div>
            <div className="col-12 col-md-1">
                <div className="row">
                    <Field  id="ConvertPrSearch.Stock[2]" component={FromCheckBoxparallel} type="checkbox" onClick={props.handleCheckbox} name="ConvertPrSearch.Stock" label="Stock"  checked={props.checked_details.includes('2')} />
                </div>
            </div>
            <div className="col-12 col-md-2">
                <div className="row">
                    <Field  id="ConvertPrSearch.MRO[3]" component={FromCheckBoxparallel} type="checkbox" onClick={props.handleCheckbox} name="ConvertPrSearch.MRO" label="MRO"  checked={props.checked_details.includes('3')} />
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
                    <Field  id="ConvertPrSearch.Spot[1]" component={FromCheckBoxparallel} type="checkbox" name="ConvertPrSearch.po[1]" onClick={props.handleCheckbox} label="PO"  checked={props.checked_details.includes('1')} />
                </div>
            </div>
            <div className="col-12 col-md-1">
                <div className="row">
                    <Field  id="ConvertPrSearch.Stock[2]" component={FromCheckBoxparallel} type="checkbox" name="ConvertPrSearch.rfq[2]" onClick={props.handleCheckbox} label="RFQ"  checked={props.checked_details.includes('2')} />
                </div>
            </div>
        </div>
        :''}
    </div>  
}
export default  Filters