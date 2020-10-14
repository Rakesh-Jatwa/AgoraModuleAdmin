import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import IssueGRN from './IssueGRN'
import GrnListing from './GRNListing'
import {connect} from 'react-redux';
import { GetDoSearch,GetViewDOClick, GetDoListing, GetGeneratePOPDF} from '../../../Actions/Vendor'
import {reset} from 'redux-form';
import {GetGenerateDOPDF, ClearUploadDocuments} from '../../../Actions/Requester'


class GoodsReceivedNotes extends Component {
    state = {
        active_key : 'IssueDo',
      }
    
    componentDidMount(){
        if(this.props.location && this.props.location.redirect_to_tab){
        this.setState({
            active_key : this.props.location.redirect_to_tab
        })
        }
    }

    render(){
        return <div id="tabs">
                 <Tabs defaultActiveKey="IssueDo" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {this.setState({active_key:k}) }}>
                    <Tab eventKey="IssueDo" title="Issue DO">
                        <div className="tab-content py-3 px-3 px-sm-0">
                            <IssueGRN
                               get_issue_grn = {this.props.delivery_order_search} 
                               post_issue_grn = {this.props.GetDoSearch} 
                               loading = {this.props.dos_loading}
                               reset_form = {this.ResetForm}
                               location = {this.props.location}
                               history ={this.props.history}
                               pol_loading={this.props.pol_loading}
                               clear_download = {this.props.GetClearDownloadFile}
                            />
                        </div>
                    </Tab>
                    
                    <Tab eventKey="DOListing" title="DO Listing">
                        <div className="tab-content py-3 px-3 px-sm-0">
                            <GrnListing
                               get_issue_grn = {this.props.delivery_order_listing} 
                               post_issue_grn = {this.props.GetDoListing} 
                               loading = {this.props.grn_loading}
                               reset_form = {this.ResetForm}
                               do_loading = {this.props.do_loading}
                               gdopdf_loading = {this.props.gdopdf_loading}
                               gprpdf_loading = {this.props.gpopdf_loading}
                               GetGenerateDOPDF = {this.props.GetGenerateDOPDF}
                               history ={this.props.history}
                               location ={this.props.location}
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
    dos_loading : state.delivery_order_search.loading,
    pol_loading : state.po_listing.loading,
    
    delivery_order_listing : state.delivery_order_listing.responseList,
    do_loading : state.delivery_order_listing.loading,
    deliveryorder_view : state.deliveryorder_view.responseList,
    gdopdf_loading : state.generate_dopdf.loading,
    gpopdf_loading : state.generate_popdf.loading,
})

const mapDispatchToProps = dispatch => ({
    GetDoListing  : (values) => dispatch(GetDoListing(values)),
    GetViewDOClick  : (values) => dispatch(GetViewDOClick(values)),
    GetDoSearch  : (values) => dispatch(GetDoSearch(values)),
    ResetForm  : (values) => dispatch(reset(values)),
    GetGenerateDOPDF  : (values) => dispatch(GetGenerateDOPDF(values)),
    GetGeneratePRPDF  : (values) => dispatch(GetGeneratePOPDF(values)),
    GetClearDownloadFile : (values) => dispatch(ClearUploadDocuments(values)),
})

const GoodsReceivedNotesDetails = connect(mapStateToProps, mapDispatchToProps)(GoodsReceivedNotes);
export default GoodsReceivedNotesDetails;