import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import IssueGRN from './IssueGRN'
import GrnListing from '../DeliveryOrder/GRNListing'
import {connect} from 'react-redux';
import {UploadDocuments, ClearUploadDocuments} from '../../../Actions/Requester'
import { GetDoSearch,GetViewDOClick, GetDoListing,GetDownloadFile, GetDeleteFile, GetGeneratePOPDF} from '../../../Actions/Vendor'
import {GetGenerateDOPDF} from '../../../Actions/Requester'
import {reset} from 'redux-form';


class GoodsReceivedNotes extends Component {
    render(){

        return <div id="tabs">
                 <Tabs defaultActiveKey="IssueDo" transition={false} id="tabs">
                    <Tab eventKey="IssueDo" title="Issue Do">
                        <div className="tab-content py-3 px-3 px-sm-0">
                            <IssueGRN
                                get_issue_grn = {this.props.deliveryorder_view} 
                                post_issue_grn = {this.props.GetViewDOClick} 
                                loading = {this.props.isgrn_loading}
                                reset_form = {this.ResetForm}
                                location = {this.props.location}
                                history ={this.props.history}
                                delivery_form ={this.props.delivery_form}
                                save_do={this.props.save_do}
                                save_do_error={this.props.save_do_error}
                                UploadDocuments = {this.props.UploadDocuments}
                                download_file = {this.props.GetDownloadFile}
                                delete_file = {this.props.GetDeleteFile}
                                upload_document = {this.props.upload_document}
                                file_delete ={this.props.file_delete}
                                file_upload_ld ={this.props.file_upload_ld}
                                file_delete_ld ={this.props.file_delete_ld}
                                deliver_view_ld ={this.props.deliver_view_ld}
                                get_generate_dopdf = {this.props.GetGenerateDOPDF}
                                gdopdf_loading = {this.props.gdopdf_loading}
                                fd_loading = {this.props.fd_loading}
                                fdo_loading = {this.props.fdo_loading}
                                clear_download = {this.props.GetClearDownloadFile}
                                
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="DOListing" title="DO Listing">
                        <div className="tab-content py-3 px-3 px-sm-0">
                            <GrnListing
                                get_issue_grn = {this.props.delivery_order_listing} 
                                post_issue_grn = {this.props.GetDoListing} 
                                history ={this.props.history}
                                location ={this.props.location}
                                loading = {this.props.grn_loading}
                                reset_form = {this.ResetForm}
                                do_loading = {this.props.do_loading}
                                gdopdf_loading = {this.props.gdopdf_loading}
                                gprpdf_loading = {this.props.gpopdf_loading}
                                GetGenerateDOPDF = {this.props.GetGenerateDOPDF}
                                GetGeneratePRPDF = {this.props.GetGeneratePRPDF}
                                clear_download = {this.props.GetClearDownloadFile}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>
    }
}

const mapStateToProps = state => ({
    delivery_order_search : state.delivery_order_search.responseList,
    delivery_order_listing : state.delivery_order_listing.responseList,
    deliveryorder_view : state.deliveryorder_view.responseList,
    save_do_error : state.save_do,
    save_do : state.save_do.responseList,
    delivery_form : state.form.DeliveryOrderView,
    upload_document : state.file_upload_external.responseList,
    file_delete : state.file_delete_external.responseList,
    fd_loading : state.file_delete_external.loading,
    fdo_loading : state.file_download.loading,
    file_upload_ld : state.file_upload_external.loading,
    file_delete_ld : state.file_delete.loading,
    deliver_view_ld : state.deliveryorder_view.loading,
    gdopdf_loading : state.generate_dopdf.loading,
    gpopdf_loading : state.generate_popdf.loading,
    do_loading : state.delivery_order_listing.loading,
    do_loading : state.delivery_order_listing.loading,
    
    
    
})


const mapDispatchToProps = dispatch => ({
    GetDoListing  : (values) => dispatch(GetDoListing(values)),
    GetViewDOClick  : (values) => dispatch(GetViewDOClick(values)),
    GetDoSearch  : (values) => dispatch(GetDoSearch(values)),
    ResetForm  : (values) => dispatch(reset(values)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
    GetGenerateDOPDF  : (values) => dispatch(GetGenerateDOPDF(values)),
    GetGeneratePRPDF  : (values) => dispatch(GetGeneratePOPDF(values)),
    UploadDocuments  : (file, values) => dispatch(UploadDocuments(file, values)),
    GetClearDownloadFile  : () => dispatch(ClearUploadDocuments()),
    
})

const GoodsReceivedNotesDetails = connect(mapStateToProps, mapDispatchToProps)(GoodsReceivedNotes);
export default GoodsReceivedNotesDetails;