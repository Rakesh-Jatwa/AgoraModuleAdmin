import {combineReducers} from 'redux';

import {reducer as reduxFormReducer } from 'redux-form';

import UserlistReducer from './UserlistReducer';

import RemoveUser from './RemoveUser';

import AuthReducer from './AuthReducer';

import FileUpload from './FileUpload';

import CommodityTypeList from './CommodityTypeList'

import ContractRefNoAndDesc from './ContractRefNoAndDesc'

import VendorNameListService from './VendorNameListService'

import ItemBasedSearch from './ItemBasedSearch'

import UploadDocument from './UploadDocument'

import FundTypeProjectCode from './FundTypeProjectCode'

import Address from './Address'

import DeliveryAddress from './DeliveryAddress'

import CostCentreCode from './CostCentreCode'

import Segmentation from './Segmentation'

import RaisePr from './RaisePr'

import PurchaseRequestItems from './PurchaseRequestItems'

import PurchaseRequestItemsPopUp from './PurchaseRequestItemsPopUp'

import CatalogueDropdown from './CatalogueDropdown'

import BuyerCatelogueSearch from './BuyerCatelogueSearch'

import SearchProductList from './SearchProductList'

import SearchProductCancelList from './SearchProductCancelList'

import PurchaseRequestStatus from './PurchaseRequestStatus'

import IssueGrnSearch from './IssueGrnSearch'

import GrnListing from './GrnListing'

import SavePurchaseRequest from './SavePurchaseRequest'

import UserMenu from './UserMenu'

import GrndGeneration from './GrndGeneration'

import PurchaseReqestApproval from './PurchaseReqestApproval'

import PurchaseReqestReject from './PurchaseReqestReject'

import ViewSinglePr from './ViewSinglePr'

import ApproverPR from './ApproverPR'

import PurchaseOrder from './PurchaseOrder'

import PoListing from './PoListing'

import ViewPoClick from './ViewPoClick'

import AcceptReject from './AcceptReject'

import DeliveryorderSearch from './DeliveryorderSearch'

import DeliveryorderListing from './DeliveryorderListing'

import DeliveryorderView from './DeliveryorderView'

import SaveDo from './SaveDo'

import FileDownload from './FileDownload'

import FileDelete from './FileDelete'

import InvoiceListing from './InvoiceListing'

import InvoiceIssue from './InvoiceIssue'

import InvoiceDetailsViewVendor from './InvoiceDetailsViewVendor'

import SubmitInvoice from './SubmitInvoice'

import RequesterInvoiceSearch from './RequesterInvoiceSearch'

import InvoiceDetailsClick from './InvoiceDetailsClick'

import InvoiceSave from './InvoiceSave'

import InvoiceVerify from './InvoiceVerify'

import InvoiceHeader from './InvoiceHeader'

import GrnSubmit from './GrnSubmit'

import GetFillAddress from './GetFillAddress'

import GetAOList from './GetAOList'

import GetAppovalList from './GetAppovalList'

import GetFinalSubmitPR from './GetFinalSubmitPR'

import GetApprovalType from './GetApprovalType'

import GetSaveApprovePerson from './GetSaveApprovePerson'

import FileUploadExternal from './FileUploadExternal'

import GenerateDOPDF from './GenerateDOPDF'

import GeneratePRPDF from './GeneratePRPDF'

import GeneratePOPDF from './GeneratePOPDF'

import GenerateGRNPDF from './GenerateGRNPDF'

import GenerateIPDF from './GenerateIPDF'

import FileDeleteExternal from './FileDeleteExternal'

import VendorDetails from './VendorDetails'

import ConvertPRSearch from './ConvertPRSearch'

import ConvertPRListingSearch from './ConvertPRListingSearch'

import QuoteList from './QuoteList'

import QuotationPDF from './QuotationPDF'

import RFQListAllWithVendor from './RFQListAllWithVendor'

import RFQPDFGenerate from './RFQPDFGenerate'

import GetPoApprovallist from './GetPoApprovallist'

import OutstandingRfq from './OutstandingRfq'

import ViewResponseRFQComSummary from './ViewResponseRFQComSummary'

import RFQPageLoadDetails from './RFQPageLoadDetails'

import VendorRFQOutstanding from './VendorRFQOutstanding'

import VendorNewQuote from './VendorNewQuote'

import GlCode from './GlCode'

import RFQQuoteAccess from './RFQQuoteAccess'

import GenerateRFQPDF from './GenerateRFQPDF'

import ViewRFQ from './ViewRFQ'

import ViewQuotation from './ViewQuotation'

import VendorList from './VendorList'

import RFQOutstandingExp from './RFQOutstandingExp'

import PoApprovalDetails from './PoApprovalDetails'

import ProductDetails from './ProductDetails'

import PoApprovalSetup from './PoApprovalSetup'

import GetPoAllApprovallist from './GetPoAllApprovallist'

import POApprovalSubmit from './POApprovalSubmit'

import PurchaseRequestItemsNcPopUp from './PurchaseRequestItemsNcPopUp'

import PurchaseRequestItemsFFPopUp from './PurchaseRequestItemsFFPopUp'

import FreeForm from './FreeForm'

import PoList from './PoList'

import ApprovalList from './E2P/ApprovalList'

import ApprovalRejectedList from './E2P/ApprovalRejectedList'

import ApprovalDetails from './E2P/ApprovalDetailsE2P'

import E2pVendorList from './E2P/VendorList'

import ViewAudit from './E2P/ViewAudit'

import ViewPODetails from './ViewPODetails'

import PreviewDODetails from './PreviewDODetails'

import PoLineItem from './PoLineItem'

import PoLineDetails from './PoLineDetails'

import ViewGRN from './ViewGRN'

import PoDetails from './PoDetails'

import RequesterPaidInvoiceSearch from './RequesterPaidInvoiceSearch'

import Dashbaord from './Dashbaord'

import GetGenerateCRPDF from './GetGenerateCRPDF'

import CancelPrList from './CancelPrList'

import FillTaxCode from './FillTaxCode'





import RFQAddItemSearch from './RFQAddItemSearch'

import ApprovalListFinance from './E2P/ApprovalListFinance'

import RequesterContinue from './E2P/RequesterContinue'

import GetPoApprovallistall from './GetPoApprovallistall'



import PopPayFor from './E2P/PopPayFor'

import PopTaxCode from './E2P/PopTaxCode'

import WithHoldingTax from './E2P/WithHoldingTax'

import DocumentList from './E2P/DocumentList'

import E2PApprovalDetails from './E2P/E2PApprovalDetails'

import E2PPendingFYFA from './E2P/PendingFYFA'

import E2PMultiGLInvoiceTemplate from './E2P/MultiGLInvoiceTemplate'

import E2PDocumentEnquiry from './E2P/DocumentEnquiry'

import E2PCanApprove from './E2P/E2PCanApprove'



import CNListing from './CNDN/CNListing'

import DNListing from './CNDN/DNListing'

import CNDetails from './CNDN/CNDetails'

import DNDetails from './CNDN/DNDetails'

import CNTrackListing from './CNDN/CNTrackListing'

import CNTrackAck from './CNDN/CNTrackAck'

import CNTrackListingDetails from './CNDN/CNTrackListingDetails'



import DNTrackListing from './CNDN/DNTrackListing'

import DNTrackListingDetails from './CNDN/DNTrackListingDetails'

import GenerateCREDITPDF from './CNDN/GenerateCREDITPDF'

import GenerateDEBITPDF from './CNDN/GenerateDEBITPDF'

import CNDNInvoiceDetails from './CNDN/CNDNInvoiceDetails'



import PolicyList from './Eadmin/PolicyList'

import UserGroupList from './Eadmin/UserGroupList'

import ApplicatonPackage from './Eadmin/ApplicatonPackage'

import FixedRoles from './Eadmin/FixedRoles'

import UserGroupDetails from './Eadmin/UserGroupDetails'

import DashboardListing from './Eadmin/DashboardListing'

import Country from './Eadmin/Country'

import State from './Eadmin/State'

import HolidayList from './Eadmin/HolidayList'

import TaxCodeList from './Eadmin/TaxCodeList'

import TaxCodeRate from './Eadmin/TaxCodeRate'

import CompanyList from './Eadmin/CompanyList'

import VendorMapList from './Eadmin/VendorMapList'

import UserAccountList from './Eadmin/UserAccountList'

import ValidateAdminLimit from './Eadmin/ValidateAdminLimit'

import MatrixList from './Eadmin/MatrixList'

import Currency from './Eadmin/Currency'

import ReportList from './Eadmin/ReportList'

import PaymentMethod from './Eadmin/PaymentMethod'

import PaymentTerm from './Eadmin/PaymentTerm'

import MultiVendorDetails from './MultiVendorDetails'

import FillGst from './FillGst'

import FillTax from './FillTax'



import ChangePassword from './ChangePassword'

import CheckBudgetAmount from './CheckBudgetAmount'

import InvoiceFundType from './InvoiceFundType'

import VendorDetailsMethod from './VendorDetailsMethod'

import VerifiedInvoice from './VerifiedInvoice'

import PendingFYFA from './PendingFYFA'

import PoTracking from './PoTracking'

import TransTracking from './TransTracking'


import PurchaseCateSearchData from './PurchaseCateSearchData';
import PurchaseCatelogueMaint from './SysAdmin/PurchaseCatelogueMaint';
import PurchaserCatalogueData from './SysAdmin/PurchaserCatalogueData';
import GetPurchaseCatelogueData from './SysAdmin/GetPurchaseCatelogueData';
import PurchaserAssignment from './SysAdmin/PurchaserAssignment';
import CategoryCode from './SysAdmin/CategoryCode';
import UOM from './SysAdmin/UOM';
import SearchResult from './SysAdmin/SearchResult';
import GetAddItemCommodity from './SysAdmin/GetAddItemCommodity';
import AccountData from './SysAdmin/AccountData';
import DepartmentSearchList from './SysAdmin/DepartmentSearchList';
import DepartmentApprovelList from './SysAdmin/DepartmentApprovelList';
import ApprovalUserAssign from './SysAdmin/ApprovalUserAssign';
import RdApprovalMainGroupType from './SysAdmin/RdApprovalMainGroupType';
import RdApprovalMainApprType from './SysAdmin/RdApprovalMainApprType';
import RdApprovalItemAssign from './SysAdmin/RdApprovalItemAssign';
import StoreProfileData from './StoreProfileData';




import VendorDetailList from './Eadmin/VendorDetailList'



let RootReducer = combineReducers({

    auth:AuthReducer,

    userlist:UserlistReducer,

    form:reduxFormReducer,

    removeuser:RemoveUser,

    fileupload:FileUpload,

    commodity_type_list:CommodityTypeList,

    contract_ref_no_and_desc:ContractRefNoAndDesc,

    vendor_name_list_service:VendorNameListService,

    item_based_search:ItemBasedSearch,

    upload_document : UploadDocument,

    raise_pr:RaisePr,

    fund_type_project_code:FundTypeProjectCode,

    address:Address,

    delivery_address:DeliveryAddress,

    cost_centre_code:CostCentreCode,

    segmentation:Segmentation,

    purchase_request_items:PurchaseRequestItems,

    purchase_request_items_popup:PurchaseRequestItemsPopUp,

    catalogue_dropdown: CatalogueDropdown,

    buyer_catelogue_search:BuyerCatelogueSearch,

    search_product_list:SearchProductList,

    search_product_cancel_list:SearchProductCancelList,

    purchase_request_status:PurchaseRequestStatus,

    issue_grn_search:IssueGrnSearch,

    grn_listing:GrnListing,

    save_purchase_request:SavePurchaseRequest,

    user_menu : UserMenu,

    grnd_generation: GrndGeneration,

    purchase_reqest_approval:PurchaseReqestApproval,

    purchase_reqest_reject:PurchaseReqestReject,

    view_single_pr : ViewSinglePr,

    view_grn : ViewGRN,

    approver_pr : ApproverPR,

    purchase_order:PurchaseOrder,

    po_listing:PoListing,

    view_po_click: ViewPoClick,

    accept_reject : AcceptReject,

    delivery_order_search:DeliveryorderSearch,

    delivery_order_listing: DeliveryorderListing,

    deliveryorder_view : DeliveryorderView,

    file_download : FileDownload,

    file_delete : FileDelete,

    save_do:SaveDo,

    invoice_listing :InvoiceListing,

    invoice_issue :InvoiceIssue,

    invoice_details_view_vendor :InvoiceDetailsViewVendor,

    submit_invoice: SubmitInvoice,

    requester_invoice_search : RequesterInvoiceSearch,

    invoice_details_click: InvoiceDetailsClick,

    invoice_save:InvoiceSave,

    invoice_verify:InvoiceVerify,

    invoice_header: InvoiceHeader,

    grn_submit: GrnSubmit,

    get_fill_address:GetFillAddress,

    get_ao_list:  GetAOList,

    get_appoval_list: GetAppovalList,

    get_final_submit_pr:GetFinalSubmitPR,

    get_approval_type: GetApprovalType,

    get_save_approve_person:GetSaveApprovePerson,

    file_upload_external:FileUploadExternal,

    generate_dopdf:GenerateDOPDF,

    generate_prpdf:GeneratePRPDF,

    generate_popdf:GeneratePOPDF,

    generate_grnpdf:GenerateGRNPDF,

    generate_ipdf:GenerateIPDF,

    file_delete_external:FileDeleteExternal,

    vendor_details:VendorDetails,

    convert_pr_search:ConvertPRSearch,

    convert_pr_list_search:ConvertPRListingSearch,

    quote_list:QuoteList,

    quote_pdf:QuotationPDF,

    rfq_list_all_with_vendor:RFQListAllWithVendor,

    rfqpdf_generate:RFQPDFGenerate,

    view_po_details:ViewPODetails,

    po_line_item:PoLineItem,

    po_line_details:PoLineDetails,

    get_po_approval_list: GetPoApprovallist,

    outstanding_rfq : OutstandingRfq,

    view_response_rfq_Summary : ViewResponseRFQComSummary,

    refq_page_load_details : RFQPageLoadDetails,

    vendor_rfq_outstanding : VendorRFQOutstanding,

    vendor_new_quote : VendorNewQuote,

    gl_code : GlCode,

    rfq_quote_access : RFQQuoteAccess,

    generate_rfqpdf : GenerateRFQPDF,

    generate_rfqpdf : GenerateRFQPDF,

    view_rfq : ViewRFQ,

    view_quotation : ViewQuotation,

    vendor_list: VendorList,

    rfq_outstanding_exp : RFQOutstandingExp,

    po_approval_details : PoApprovalDetails,

    product_details: ProductDetails,

    po_approval_setup : PoApprovalSetup,

    get_po_all_approval_list : GetPoAllApprovallist,

    po_approval_submit : POApprovalSubmit,

    purchase_request_items_nc_popup : PurchaseRequestItemsNcPopUp,

    purchase_request_items_ff_popup : PurchaseRequestItemsFFPopUp,

    free_form:FreeForm,

    approval_list : ApprovalList,

    approval_rejected_list : ApprovalRejectedList,

    approval_details : ApprovalDetails,

    e2p_vendor_list : E2pVendorList,

    po_list : PoList,

    view_audit : ViewAudit,

    view_do_details : PreviewDODetails,

    po_details : PoDetails,

    rfq_add_item_search : RFQAddItemSearch,

    approval_list_finance : ApprovalListFinance,

    requester_continue : RequesterContinue,

    get_po_approval_list_all : GetPoApprovallistall,

    pop_pay_for : PopPayFor,

    pop_tax_code : PopTaxCode,

    with_holding_tax : WithHoldingTax,

    document_list : DocumentList,

    e2p_approval_details : E2PApprovalDetails,

    e2p_pending_fyfa : E2PPendingFYFA,

    e2p_multi_doc : E2PMultiGLInvoiceTemplate,

    document_enquiry : E2PDocumentEnquiry,

    requester_paid_invoice_search: RequesterPaidInvoiceSearch,

    can_approve : E2PCanApprove,

    dashboard:Dashbaord,

    cn_listing : CNListing,

    dn_listing : DNListing,

    cn_details : CNDetails,

    dn_details : DNDetails,

    cn_track_listing : CNTrackListing,

    cn_track_ack : CNTrackAck,

    cn_tracking_details : CNTrackListingDetails,

    dn_track_listing : DNTrackListing,

    dn_track_listing_details : DNTrackListingDetails,

    generate_debit_pdf : GenerateDEBITPDF,

    generate_credit_pdf : GenerateCREDITPDF,

    cndn_invoice_details: CNDNInvoiceDetails,

    generate_CRPDF : GetGenerateCRPDF,

    cancel_pr_list: CancelPrList,

    policy_list : PolicyList,

    ug_list  : UserGroupList,

    applicaton_package : ApplicatonPackage,

    fixed_roles : FixedRoles,

    ug_details : UserGroupDetails,

    dashboard_listing : DashboardListing,

    ed_country : Country,

    ed_state : State,

    holiday_list : HolidayList,

    tax_code_list : TaxCodeList,

    tax_code_rate : TaxCodeRate,

    company_list : CompanyList,

    vendor_map_list : VendorMapList,

    user_account_list : UserAccountList,

    validate_admin_limit : ValidateAdminLimit,

    matrix_list : MatrixList,

    currency : Currency,

    report_list : ReportList,

    payment_term : PaymentTerm,

    payment_method : PaymentMethod,

    multi_vendor_details : MultiVendorDetails,

    fill_gst : FillGst,

    change_password : ChangePassword,

    check_budget_amount : CheckBudgetAmount,

    fill_tax : FillTax,

    invoice_fund_type : InvoiceFundType,

    vendor_details_method : VendorDetailsMethod,

    fill_tax_code : FillTaxCode,

    verified_invoice : VerifiedInvoice,

    pending_fyfa : PendingFYFA,

    vendor_detail_list: VendorDetailList,

    po_tracking : PoTracking,

    trans_tracking : TransTracking
,
    purchase_cate_search_data: PurchaseCateSearchData,
    purchase_cate_data: PurchaseCatelogueMaint,
    purchaser_catalogue_data: PurchaserCatalogueData,
    get_purchase_cate_data: GetPurchaseCatelogueData,
    purchaser_assignment_data: PurchaserAssignment,
    account_data: AccountData,
    category_code: CategoryCode,
    uom: UOM,
    get_add_commodity: GetAddItemCommodity,
    search_result: SearchResult,
    department_search_list: DepartmentSearchList,
    department_approvel_list: DepartmentApprovelList,
    approval_process_user_assignment: ApprovalUserAssign,
    group_types_list: RdApprovalMainGroupType,
    approval_group_list: RdApprovalMainApprType,
    approval_procss_item_assignment: RdApprovalItemAssign,
    profile_data: StoreProfileData,

});



export default RootReducer;
