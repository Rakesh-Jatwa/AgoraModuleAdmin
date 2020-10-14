import React, {lazy, Suspense, useEffect} from 'react';

import {Route, withRouter, Switch, HashRouter, Redirect} from 'react-router-dom';

import {connect} from 'react-redux';

import Login from '../Container/Pages/Login/Login';

import actioncreators from '../Actions/ActionCreators'

import PortLayout from '../Container/Layout/Layout'

import ErrorBoundary from '../Component/Error'

import Loader from '../Component/Loader'

import UnderConstruction from '../Container/Pages/UnderConstruction'

import file_404 from '../Container/Pages/UnderConstruction/File404'

import UnegisterUnderConstruction from '../Container/Pages/UnegisterUnderConstruction'



const PurchaseRequest = lazy(()=>{

    return import('../Container/Pages/Purchase');

});





const PasswordExpired = lazy(()=>{

    return import('../Container/Pages/Login/PasswordExpired');

});



const FreeFromRequest = lazy(()=>{

    return import('../Container/Pages/FreeFromRequest');

});





const UserDashbaord = lazy(()=>{

    return import('../Container/Pages/Dashboard');

});



const UserRegister = lazy(()=>{

    return import('../Container/Pages/Register');

})



const BuyerCatalogue = lazy(()=>{

    return import('../Container/Pages/BuyerCatalogue');

})



const GoodsReceivedNotes = lazy(()=>{

    return import('../Container/Pages/GoodsReceivedNotes');

})



const GrnGeneration = lazy(()=>{

    return import('../Container/Pages/GrnGeneration');

})



const PurchaseRquestAppoval = lazy(()=>{

    return import('../Container/Pages/PurchaseRequest')

});



const ApprovelItems = lazy(()=>{

    return import('../Container/Pages/ApprovalItems')

});



const ApproveprDetails = lazy(()=>{

    return import('../Container/Pages/ApprovalItems/ApprovalList/approvepr_details')

});



const ApproveprDetailsPsa = lazy(()=>{

    return import('../Container/Pages/ApprovalItems/ApprovalList/approvepr_details_psa')

});





const PurchaseOrder = lazy(()=>{

    return import('../Container/Pages/PurchaseOrder')

});



const PurchaseOrderDetails = lazy(()=>{

    return import('../Container/Pages/PurchaseOrderDetails')

});



const PurchaseOrderDetailsList = lazy(()=>{

    return import('../Container/Pages/PurchaseOrderDetails/list')

});





const view_po_approval = lazy(()=>{

    return import('../Container/Pages/PurchaseOrderDetails/view_po_approval')

});



const VerifyPo = lazy(()=>{

    return import('../Container/Pages/PurchaseOrderDetails/VerifyPo')

});



const po_tracking_details = lazy(()=>{

    return import('../Container/Pages/PurchaseOrderDetails/po_tracking_details')

});









const PurchaseOrderDetailsListPsa = lazy(()=>{

    return import('../Container/Pages/PurchaseOrderDetails/list_psa')

});



const view_po_details = lazy(()=>{

    return import('../Container/Pages/PurchaseOrderDetails/list_po')

});



const DeliveryOrder = lazy(()=>{

    return import('../Container/Pages/DeliveryOrder')

});



const DeliveryOrderView = lazy(()=>{

    return import('../Container/Pages/DeliveryOrderView')

});



const VendorInvoiceManagement = lazy(()=>{

    return import('../Container/Pages/InvoiceManagement')

});



const VendorInvoiceViewDetails = lazy(()=>{

    return import('../Container/Pages/InvoiceManagement/InvoiceViewDetails')

});



const RequesterInvoiceManagement = lazy(()=>{

    return import('../Container/Pages/RequesterInvoiceManagement')

});



const RequesterVerificationInvoice = lazy(()=>{

    return import('../Container/Pages/RequesterVerificationInvoice')

});



const view_p2p_invoice = lazy(()=>{

    return import('../Container/Pages/RequesterVerificationInvoice/view_p2p_invoice')

});





const verify_p2p_invoice = lazy(()=>{

    return import('../Container/Pages/RequesterVerificationInvoice/verify_p2p_invoice')

});









const PurchaseApprovalSelect = lazy(()=>{

    return import('../Container/Pages/PurchaseApprovalSelect')

});



const VendorDetailsPage = lazy(()=>{

    return import('../Container/Pages/Vendor/VendorDetailsPage')

});



const MultiVendorDetailsPage = lazy(()=>{

    return import('../Container/Pages/Vendor/MultiVendor')

});







const ConvertPr = lazy(()=>{

    return import('../Container/Pages/PurcahseRequest')

});



const ViewPRDetails = lazy(()=>{

    return import('../Container/Pages/PurcahseRequest/ViewPR')

});



const RfqPages = lazy(()=>{

    return import('../Container/Pages/RFQ')

});





const SearchPOAO = lazy(()=>{

    return import('../Container/Pages/SearchPOAO')

});



const ViewPr = lazy(()=>{

    return import('../Container/Pages/ViewPr')

});



const PrDetails = lazy(()=>{

    return import('../Container/Pages/ViewPr/PrDetails')

});







const RFQComSummary = lazy(()=>{

    return import('../Container/Pages/RFQ/RFQComSummary')

});



const RFQComSummary1 = lazy(()=>{

    return import('../Container/Pages/RFQ/RFQComSummary/index-final')

});



const VendorRFQList = lazy(()=>{

    return import('../Container/Pages/RFQ/VendorRFQList')

});



const CreateQuotationNew = lazy(()=>{

    return import('../Container/Pages/RFQ/VendorRFQList/CreateQuotationNew')

});



const RaisePO = lazy(()=>{

    return import('../Container/Pages/RaisePO')

});



const raise_rfq_po_vendor = lazy(()=>{

    return import('../Container/Pages/RaisePoRfq/RaisePoRfqVendor')

});



const raise_rfq_po = lazy(()=>{

    return import('../Container/Pages/RaisePoRfq/RaisePoRfq')

});







const view_rfq_number = lazy(()=>{

    return import('../Container/Pages/RFQ/VendorRFQList/QuotationListing/view_rfq_number')

});



const view_quotation = lazy(()=>{

    return import('../Container/Pages/RFQ/VendorRFQList/QuotationListing/view_quotation')

});



const POApprDetail = lazy(()=>{

    return import('../Container/Pages/SearchPOAO/POApprDetail')

});



const POApprSetup = lazy(()=>{

    return import('../Container/Pages/POApprDetail')

});



const POApprSetupRfq = lazy(()=>{

    return import('../Container/Pages/POApprSetupRfq')

});





const FFPOApprSetup = lazy(()=>{

    return import('../Container/Pages/FFPOApprSetup')

});



const E2PApproval = lazy(()=>{

    return import('../Container/Pages/e2p/Approval')

});



const ItemCodePage = lazy(()=>{

    return import('../Container/Pages/ItemCodePage')

});





const ItemDetails = lazy(()=>{

    return import('../Container/Pages/ItemCodePage/item_details_page')

});



const FreeForm = lazy(()=>{

    return import('../Container/Pages/FreeForm')

});





const e2p_document = lazy(()=>{

    return import('../Container/Pages/e2p/e2p_document');

});



const e2p_document_enquiry = lazy(()=>{

    return import('../Container/Pages/e2p/documentenquiry');

});



const e2p_document_verify = lazy(()=>{

    return import('../Container/Pages/e2p/documentverify');

});



const psd_received_date = lazy(()=>{

    return import('../Container/Pages/e2p/ReceivedDate');

});



const CreditDebit = lazy(()=>{

    return import('../Container/Pages/CreditDebit');

});



const DebitNote = lazy(()=>{

    return import('../Container/Pages/DebitNote');

});





const CreditNote = lazy(()=>{

    return import('../Container/Pages/CreditNote');

});



const PoCancellation = lazy(()=>{

    return import('../Container/Pages/PoCancellation');

});



const view_do = lazy(()=>{

    return import('../Container/Pages/DeliveryOrderView/ViewDo');

});



const ViewPoLine = lazy(()=>{

    return import('../Container/Pages/ViewPoLine');

});



const ViewGRN = lazy(()=>{

    return import('../Container/Pages/GrnGeneration/view_grn');

});



const ViewInvoice = lazy(()=>{

    return import('../Container/Pages/e2p/invoiceview');

});



const ViewInvoiceFYFA = lazy(()=>{

    return import('../Container/Pages/e2p/invoice_fyfa');

});







const SecurityPolicyMaintenance = lazy(()=>{

    return import('../Container/Pages/Eadmin/SecurityPolicyMaintenance');

});



const UserGroupMaintenance = lazy(()=>{

    return import('../Container/Pages/Eadmin/UserGroupMaintenance');

});



const DashbaordMaintanance = lazy(()=>{

    return import('../Container/Pages/Eadmin/DashbaordMaintanance');

});



const HolidayCalender = lazy(()=>{

    return import('../Container/Pages/Eadmin/HolidayCalender');

});



const DahsbaordDev = lazy(()=>{

    return import('../Container/Pages/Dahsbaord_Dev');

});



const EadminTaxCode = lazy(()=>{

    return import('../Container/Pages/Eadmin/TaxCode');

});



const AllCompanies = lazy(()=>{

    return import('../Container/Pages/Eadmin/AllCompanies');

});



const VendorMapping = lazy(()=>{

    return import('../Container/Pages/Eadmin/VendorMapping');

});



const UserAccountMaintenance = lazy(()=>{

    return import('../Container/Pages/Eadmin/UserAccountMaintenance');

});





const ReportMatrix = lazy(()=>{

    return import('../Container/Pages/Eadmin/ReportMatrix');

});



const CompanyDetails = lazy(()=>{

    return import('../Container/Pages/Eadmin/CompanyDetails');

});



const CompanyDetailsNew = lazy(()=>{

    return import('../Container/Pages/Eadmin/CompanyDetailsNew');

});



const Report = lazy(()=>{

    return import('../Container/Pages/Eadmin/Report');

});



const VendorItemMasterApproval = lazy(()=>{

    return import('../Container/Pages/Eadmin/VendorItemMasterApproval');

});



const PostingFileRecovery = lazy(()=>{

    return import('../Container/Pages/Eadmin/PostingFileRecovery');

});



const BudgetCheck = lazy(()=>{

    return import('../Container/Pages/BudgetCheck');

});



const po_tracking = lazy(()=>{

    return import('../Container/Pages/PoTracking');

});



const transaction_tracking = lazy(()=>{

    return import('../Container/Pages/TransTracking');

});



const PurchaseCatalogue = lazy(() => {
  return import("../Container/Pages/SysAdmin/PurchaseCatalogue");
});


const ContractCatalogue = lazy(() => {
  return import("../Container/Pages/SysAdmin/ContractCatalogue");
});

const GlCategoryCode = lazy(() =>{
  return import("../Container/Pages/SysAdmin/GlCategoryCode");
});

const Reports = lazy(() =>{
  return import("../Container/Pages/SysAdmin/Report");
});

const OutstandingInvoice = lazy(()=>{
  return import('../Container/Pages/SysAdmin/OutstandingInvoice');
});

const OutstandingPo = lazy(()=>{
  return import('../Container/Pages/SysAdmin/OutstandingPo');
});

const OverdueInvoice = lazy(()=>{
  return import('../Container/Pages/SysAdmin/OverdueInvoice');
});

const OverduePo = lazy(()=>{
  return import('../Container/Pages/SysAdmin/OverduePo');
});

const PendingDebitNoteDebitAdviceApproval = lazy(()=>{
  return import('../Container/Pages/SysAdmin/PendingDebitNoteDebitAdviceApproval');
});

const PoDetails = lazy(()=>{
  return import('../Container/Pages/SysAdmin/PoDetails');
});

const PoSummary = lazy(()=>{
  return import('../Container/Pages/SysAdmin/PoSummary');
});

const CompanyProfile = lazy(()=>{
  return import('../Container/Pages/SysAdmin/CompanyProfile');
});

const AssignItem = lazy(() => {
  return import("../Container/Pages/SysAdmin/AssignItem");
});

const ModifyItems = lazy(() => {
  return import("../Container/Pages/SysAdmin/ModifyItems");
});

const ItemMasterMaintenance = lazy(() => {
  return import('../Container/Pages/SysAdmin/ItemMasterMaintenance');
});

const ItemMaster = lazy(() => {
  return import('../Container/Pages/SysAdmin/ItemMasterMaintenance/ItemMaster');
});

// const UserManagement = lazy(() => {
//   return import('../Container/Pages/SysAdmin/UserManagement');
// })

const ApprovingOfficerRelief = lazy(() => {
  return import('../Container/Pages/SysAdmin/ApprovingOfficerRelief');
})

const VendorMasterMaintenance = lazy(() => {
  return import('../Container/Pages/SysAdmin/VendorMasterMaintenance')
})

const VendorListRfqMaintenance = lazy(() => {
  return import('../Container/Pages/SysAdmin/VendorListRfqMaintenance')
})

const ApprovalProcessMaintenance = lazy(() => {
  return import('../Container/Pages/SysAdmin/ApprovalProcessMaintenance')
})

const CustomFields = lazy(() => {
  return import('../Container/Pages/SysAdmin/CustomFields')
})

const PersonalSetting = lazy(() => {
  return import('../Container/Pages/SysAdmin/PersonalSetting')
})


const UserManagement = lazy(() => {
  return import('../Container/Pages/SysAdmin/UserManagement');
});


const VendorMasterDetails = lazy(() => {
  return import('../Container/Pages/SysAdmin/VendorMasterDetails');
});













const AppRoute = props => {

    useEffect(()=>{

        props.userAutoLogin()

    },[props]);



    let _routes = (



            <HashRouter>

                 <Switch>

                    <Route path="/" exact render={()=><Login userlogin={props.userlogin} loginmessage={props.authmessage} />}/>

                    <Route path="/login" render={()=> <Login userlogin={props.userlogin} loginmessage={props.authmessage} />}/>

                    <Route path="/password_expired" component={PasswordExpired} />

                    <Route component={UnegisterUnderConstruction} />

                </Switch>

            </HashRouter>



    );

    if(props.authstate){

         _routes = (

            <HashRouter>





                   <ErrorBoundary>

                        <PortLayout component={PortLayout}>

                        <Switch>

                            <Route exact  path="/" component={DahsbaordDev} />

                            <Route path="/dashboard" component={DahsbaordDev} />

                            <Route path="/contract" component={UserDashbaord} />

                            <Route path="/buyercatlogue" component={BuyerCatalogue} />

                            <Route path="/purchaseRequest" component={PurchaseRequest} />

                            <Route path="/purchaseRequestView" component={PurchaseRequest} />

                            <Route path="View" component={PurchaseRequest} />

                            <Route path="/issueGrn" component={GoodsReceivedNotes} />

                            <Route path="/grnGeneration" component={GrnGeneration} />

                            <Route path="/view_grn" component={ViewGRN} />

                            <Route path="/approvepr" component={PurchaseRquestAppoval} />

                            <Route path="/viewpr" component={ApprovelItems} />

                            <Route path="/approvepr_details" component={ApproveprDetails} />

                            <Route path="/approvepr_details_psa" component={ApproveprDetailsPsa} />

                            <Route path="/purchaseorder" component={PurchaseOrder} />

                            <Route path="/purchaseorderDetails" component={PurchaseOrderDetails} />

                            <Route path="/deliveryorder" component={DeliveryOrder} />

                            <Route path="/deliveryorderview" component={DeliveryOrderView} />

                            <Route path="/deliveryorderlistview" component={DeliveryOrderView} />

                            <Route path="/VendorInvoiceManagement" component={VendorInvoiceManagement} />

                            <Route path="/VendorInvoiceViewDetails" component={VendorInvoiceViewDetails} />

                            <Route path="/RequesterInvoiceManagement" component={RequesterInvoiceManagement} />

                            <Route path="/RequesterVerificationInvoice" component={RequesterVerificationInvoice} />

                            <Route path="/view_p2p_invoice" component={view_p2p_invoice} />

                            <Route path="/verify_p2p_invoice" component={verify_p2p_invoice} />

                            <Route path="/prapprovalSelect" component={PurchaseApprovalSelect} />

                            <Route path="/VendorPOListPop" component={PurchaseOrderDetailsList} />

                            <Route path="/verify_po" component={VerifyPo} />

                            <Route path="/po_tracking_details" component={po_tracking_details} />

                            <Route path="/vendor_details_psa" component={PurchaseOrderDetailsListPsa} />

                            <Route path="/vendorDetailsPage" component={VendorDetailsPage} />

                            <Route path="/multi_vendor_details_page" component={MultiVendorDetailsPage} />



                            <Route path="/ConvertPr" component={ConvertPr} />

                            <Route path="/ViewPRDetails" component={ViewPRDetails} />

                            <Route path="/rfq" component={RfqPages} />

                            <Route path="/SearchPO_AO" component={SearchPOAO} />

                            <Route path="/prViewPage" component={ViewPr} />

                            <Route path="/view_pr_details" component={PrDetails} />

                            <Route path="/RFQComSummary" component={RFQComSummary1} />

                            <Route path="/VendorRFQList" component={VendorRFQList} />

                            <Route path="/CreateQuotationNew" component={CreateQuotationNew} />

                            <Route path="/RaisePO" component={RaisePO} />

                            <Route path="/raise_po_rfq_vendor" component={raise_rfq_po_vendor} />

                            <Route path="/raise_po_rfq" component={raise_rfq_po} />

                            <Route path="/view_rfq" component={view_rfq_number} />

                            <Route path="/view_quotation" component={view_quotation} />

                            <Route path="/po_approval_detail" component={POApprDetail} />

                            <Route path="/po_approval_setup" component={POApprSetup} />

                            <Route path="/po_approval_setup_rfq" component={POApprSetupRfq} />



                            <Route path="/po_approval_setup_ffpo" component={FFPOApprSetup} />

                            <Route path="/itemCodePage" component={ItemCodePage} />

                            <Route path="/free_form" component={FreeForm} />

                            <Route path="/debit_note_credit_note" component={CreditDebit} />

                            <Route path="/debit_note" component={DebitNote} />

                            <Route path="/credit_note" component={CreditNote} />

                            <Route path="/raiseFFPO" component={FreeFromRequest} />

                            <Route path="/view_do" component={view_do} />

                            <Route path="/e2p_document" component={e2p_document} />

                            <Route path="/e2p_document_enquiry" component={e2p_document_enquiry} />

                            <Route path="/e2p_document_verify" component={e2p_document_verify} />

                            <Route path="/enter_psd_received_date" component={psd_received_date} />

                            <Route path="/po_cancellation" component={PoCancellation} />

                            <Route path="/item_details_page" component={ItemDetails} />

                            <Route path="/view_po_line_items" component={ViewPoLine} />

                            <Route path="/view_invoice" component={ViewInvoice} />



                            <Route path="/view_invoice_fyfa" component={ViewInvoiceFYFA} />

                            <Route path="/e2p_approval" component={E2PApproval} />

                            <Route path="/view_po_details" component={view_po_details} />

                            <Route path="/view_po_approval" component={view_po_approval} />

                            <Route path="/purchase_order_tracking" component={po_tracking} />

                            <Route path="/transaction_tracking" component={transaction_tracking} />



                            <Route path="/security_policy_maintenance" component={SecurityPolicyMaintenance} />

                            <Route path="/user_group_maintenance" component={UserGroupMaintenance} />

                            <Route path="/UserGroupMaintenance" component={UserGroupMaintenance} />

                            <Route path="/dashboard_maintenance" component={DashbaordMaintanance} />

                            <Route path="/holiday_calendar_setup" component={HolidayCalender} />

                            <Route path="/tax_code_maintenance" component={EadminTaxCode} />

                            <Route path="/all_companies" component={AllCompanies} />

                            <Route path="/vendor_mapping" component={VendorMapping} />

                            <Route path="/user_account_maintenance" component={UserAccountMaintenance} />

                            <Route path="/report_matrix" component={ReportMatrix} />

                            <Route path="/report" component={Report} />

                            <Route path="/company_details" component={CompanyDetails} />

                            <Route path="/company_details_new" component={CompanyDetailsNew} />

                            <Route path="/vendor_item_master_approval" component={VendorItemMasterApproval} />

                            <Route path="/ipp_-_daily_posting_file_recovery" component={PostingFileRecovery} />

                            <Route path="/budget_check" component={BudgetCheck} />

                            <Route path="/file_404" component={file_404} />

                            <Route path="/purchaser_catalogue_maint." component={PurchaseCatalogue}/>
                            <Route path="/contract_catalogue_maint." component={ContractCatalogue}/>
                            <Route path="/item_master." component={ItemMaster} />
                            <Route path="/item_master_maint." component={ItemMasterMaintenance}/>
                             <Route path="/Gl_Category_Code" component={GlCategoryCode} />

                            <Route path="/Reports" component={Reports}/>
                            <Route path="/User_Management" component={UserManagement}/>


                            <Route path="/outstanding_invoice" component={OutstandingInvoice} />
                            <Route path="/outstanding_po" component={OutstandingPo} />
                            <Route path="/overdue_invoice" component={OverdueInvoice} />
                            <Route path="/overdue_po" component={OverduePo} />
                            <Route path="/pending_debit_note_debit_advice_approval" component={PendingDebitNoteDebitAdviceApproval} />
                            <Route path="/po_details" component={PoDetails} />
                            <Route path="/po_summary" component={PoSummary} />
                            <Route path="/company_profile" component={CompanyProfile} />
                            <Route path="/assign_item" component={AssignItem} />
                            <Route path="/modify_items" component={ModifyItems} />


                            <Route path="/approving_officer_relief" component={ApprovingOfficerRelief} />
                            <Route path="/vendor_master_maint." component={VendorMasterMaintenance} />
                            <Route path="/vendor_list_rfq_maint." component={VendorListRfqMaintenance} />
                            <Route path="/approval_process_maint" component={ApprovalProcessMaintenance} />
                            <Route path="/custom_fields" component={CustomFields} />
                            <Route path="/personal_setting" component={PersonalSetting} />
                            <Route path="/vendor_master_vendor_details" component={VendorMasterDetails} />


                            <Route path="/user_management" component={UserManagement} />



                            <Route component={UnderConstruction} />

                            </Switch>

                        </PortLayout>



                    </ErrorBoundary>







            </HashRouter>

         );

    }

    return (

        <div>

            <Suspense fallback={<Loader/>}>

            {_routes}

            </Suspense>

        </div>

    );

}

const mapStateToProps = (state) =>({

    authstate : state.auth.authstatus,

    authtoken : state.auth.token,

    authmessage :  state.auth.authmessage

})



const mapDispatchToProps = (dispatch) =>({

    userlogin : (values) => dispatch(actioncreators.UserLogin(values)),

    userAutoLogin : () => dispatch(actioncreators.UserAutoLogin()),

    userRegister : (values)=> dispatch(actioncreators.UserRegister(values))

})



const MainRoute = connect(mapStateToProps, mapDispatchToProps)(AppRoute);

export default withRouter(MainRoute);
