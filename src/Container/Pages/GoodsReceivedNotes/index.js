import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import IssueGRN from './IssueGRN'
import GrnListing from './GRNListing'
import {connect} from 'react-redux';
import {GetIssueGRN, GetGRNListing, GetGenerateDOPDF} from '../../../Actions/Requester'
import {GetViewGRNPDF} from '../../../Actions/Vendor'
import {reset} from 'redux-form';
class GoodsReceivedNotes extends Component {
    state = {
        active_key : 'IssueGRN',
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
                  <Tabs defaultActiveKey="IssueGRN" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => { this.setState({active_key:k}) }}>
                    <Tab eventKey="IssueGRN" title="Issue GRN">
                        <div className="tab-content py-3 px-3 px-sm-0">
                            
                            <IssueGRN
                                get_issue_grn = {this.props.issue_grn} 
                                post_issue_grn = {this.props.GetIssueGRN} 
                                loading = {this.props.isgrn_loading}
                                reset_form = {this.ResetForm}
                                location = {this.props.location}
                                history ={this.props.history}
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="GRNListing" title="GRN Listing">
                        <div className="tab-content py-3 px-3 px-sm-0">
                            <GrnListing
                                get_issue_grn = {this.props.list_grn} 
                                post_issue_grn = {this.props.GetGRNListing} 
                                loading = {this.props.grn_loading}
                                gr_loading = {this.props.gr_loading}
                                po_loading = {this.props.po_loading}
                                do_loading = {this.props.do_loading}
                                GetGenerateDOPDF = {this.props.GetGenerateDOPDF}
                                GetViewGRNPDF = {this.props.GetViewGRNPDF}
                                reset_form = {this.ResetForm}
                                history={this.props.history}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>
    }
}

const mapStateToProps = state => ({
  issue_grn : state.issue_grn_search.responseList,
  isgrn_loading : state.issue_grn_search.loading,
  list_grn : state.grn_listing.responseList,
  grn_loading : state.grn_listing.loading,
  gr_loading : state.generate_grnpdf.loading,
  po_loading : state.generate_popdf.loading,
  do_loading : state.generate_dopdf.loading,
})

const mapDispatchToProps = dispatch => ({
    GetIssueGRN  : (values) => dispatch(GetIssueGRN(values)),
    GetGRNListing  : (values) => dispatch(GetGRNListing(values)),
    GetViewGRNPDF  : (values) => dispatch(GetViewGRNPDF(values)),
    GetGenerateDOPDF : (values) => dispatch(GetGenerateDOPDF(values)),
    ResetForm  : (values) => dispatch(reset(values))
    
})

const GoodsReceivedNotesDetails = connect(mapStateToProps, mapDispatchToProps)(GoodsReceivedNotes);
export default GoodsReceivedNotesDetails;