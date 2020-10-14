
import React from 'react'
import {Field } from 'redux-form';
import {FromInputs} from '../../../../../Component/From/FromInputs';
let Filters = (props) =>{ 
   return  <div className="row">
            <div className="col-12 col-sm-6">
                <div className="row">
                    <Field type="text" name="ConvertPrSearch.rfq_num" component={FromInputs} className="form-control" placeholder="RFQ Number" label="RFQ / Quotation Number : " />
                </div>
            </div>
            <div className="col-12 col-sm-6">
                <div className="row">
                    <Field type="text" name="ConvertPrSearch.com_name" component={FromInputs} className="form-control" placeholder="Purchaser Company" label="Purchaser Company : " />
                 </div>
            </div>
            
        </div>
  
}
export default  Filters