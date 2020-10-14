import React,{useEffect,useState,Fragment} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {GetvendorDetails} from '../../../../Actions/Approver'
import Loader from '../../../../Component/Loader'
import {ddmmyy, CalcDate, DateDiff} from '../../../../Component/Dates'
import BackButton from '../../../../Component/Buttons/Back'



let VendorDetailsPage = (props) => {
    let _dispatch = useDispatch();

    let {company_details, loading, local_domestic_sale, export_sales_areas} = useSelector(state => ({
        company_details: (state.vendor_details.responseList && state.vendor_details.responseList.companyDetails && state.vendor_details.responseList.companyDetails.length > 0) ? state.vendor_details.responseList.companyDetails[0] : [], 
        loading : state.vendor_details.loading,
        local_domestic_sale :(state.vendor_details.responseList && state.vendor_details.responseList) ? state.vendor_details.responseList.LocalSalesArea : "",
        export_sales_areas : (state.vendor_details.responseList && state.vendor_details.responseList) ? state.vendor_details.responseList.ExportSalesArea : "",
    }));
   
    useEffect(() => {
        // _dispatch(GetvendorDetails({"v_com_id":"339201C145"} ));
        _dispatch(GetvendorDetails((props.location && props.location.datas) ? props.location.datas : {}));
    }, []);

   
    return <Fragment>
         {(loading) ? <Loader /> : '' }
        <div className="container-fluid">
            <div className="d-flex bg-info text-white p-1 mt-2 mb-2"><strong>Vendor Detail</strong></div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Company Name : </label></div>
                <div className="col"><p>{company_details.CM_COY_NAME}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Company Logo : </label></div>
                <div className="col"><p></p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Company Long Name : </label></div>
                <div className="col"><p></p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Parent Company : </label></div>
                <div className="col"><p></p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Business Registration No. : </label></div>
                <div className="col"><p>{company_details.CM_BUSINESS_REG_NO} </p></div>
            </div>
            <hr />
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Address : </label></div>
                <div className="col"><address> {company_details.CM_ADDR_LINE1}<br />{company_details.CM_ADDR_LINE2}</address></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>City : </label></div>
                <div className="col"><p>{company_details.CM_CITY}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>State :  </label></div>
                <div className="col"><p>{company_details.STATE_NAME}  </p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Post Code :</label></div>
                <div className="col"><p>{company_details.CM_POSTCODE}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Country : </label></div>
                <div className="col"><p>{company_details.COUNTR_NAME}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Web Sites : </label></div>
                <div className="col"><p>{company_details.CM_WEBSITE}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Email :    </label></div>
                <div className="col"><p>{company_details.CM_EMAIL} </p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Phone :</label></div>
                <div className="col"><p>{company_details.CM_PHONE}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Fax : </label></div>
                <div className="col"><p>{company_details.CM_FAX}</p></div>
            </div>
            <div className="d-flex bg-info text-white p-1 mt-2 mb-2">Company Registration</div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Year of Registration :</label></div>
                <div className="col"><p>{company_details.CM_YEAR_REG}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Paid-up Capital : </label></div>
                <div className="col"><p>{company_details.CM_PAIDCAPITAL}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Company Ownership :</label></div>
                <div className="col"><p></p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Others, Please specify : </label></div>
                <div className="col"><p></p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Business Nature :</label></div>
                <div className="col"><p></p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Commodity Type :</label></div>
                <div className="col"><p></p></div>
            </div>
            <div className="row mt-2">
                    
                <div className="col-lg-2 col-md-2 col-xs-6"><label>SST Registration No. :</label></div>
                <div className="col"><p>{company_details.CM_TAX_REG_NO}  {/* , {ddmmyy((company_details.CM_LAST_DATE) ? company_details.CM_LAST_DATE : new Date())} ({DateDiff(company_details.CM_LAST_DATE ? company_details.CM_LAST_DATE : new Date())}  Days Lapsed) */}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Organization Code :</label></div>
                <div className="col"><p></p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Bank Name :</label></div>
                <div className="col"><p>{company_details.CM_BANK}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Bank Account No. :</label></div>
                <div className="col"><p>{company_details.CM_ACCT_NO}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Bank Branch Code : </label></div>
                <div className="col"><p>{company_details.CM_BRANCH}</p></div>
                <div className="col-lg-2 col-md-2 col-xs-6"><label>Bank Code : </label></div>
                <div className="col"><p>{company_details.CM_BANK} </p></div>
            </div>
            <div className="d-flex bg-info text-white p-1 mt-2 mb-2">Previous Year Sales Area</div>
            <div className="row mt-2">
                <div className="col-lg-3 col-md-3 col-xs-6"><label>Local Domestic Sales (%)  : </label></div>
                <div className="col"><p>{local_domestic_sale}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-3 col-md-3 col-xs-6"><label>Export Sales (%)  :</label></div>
                <div className="col"><p>{export_sales_areas}</p></div>
            </div>
            <div className="d-flex bg-info text-white p-1 mt-2">Sales Turnover</div>
            <div className="table-responsive">
                <table bordered className="">
                    <thead>
                        <tr className="bg-info text-white">
                            <th>Year</th>
                            <th>Currency</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="d-flex bg-info text-white p-1 mt-2 mb-2">Software Application</div>
            <div className="row mt-2">

            </div>
            <div className="d-flex bg-info text-white p-1 mt-2 mb-2">Quality Standard Attachments</div>
            <div className="row mt-2">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs6"><label>File(s) Attached :</label></div>
                <div><p>No Files Attached  </p></div>
            </div>
            <div className="row mt-2">
               
                    <BackButton back_data={(props.location  && props.location.redirect_to_page) ? true : false}  {...props.location} goBack={props.history} history={props.history}/>
                 
            </div>
        </div>
        </Fragment>
    
}   


  
  

export default VendorDetailsPage;
