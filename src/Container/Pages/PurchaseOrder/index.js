import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import PurchaseOrder from './PoListing' 
import PoListing from './PurchaseOrder' 
import {GetPoPendingOrder, GetPoListing} from '../../../Actions/Vendor'




class Purchase extends Component {
  state = {
    active_key : 'PurchaseOrder',
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
        <Tabs defaultActiveKey="PurchaseOrder" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {this.setState({active_key:k}) }}>
         <Tab eventKey="PurchaseOrder" title="Purchase Order">
          <div className="tab-content py-3 px-3 px-sm-0">
             <PurchaseOrder
                reset_form = {this.props.ResetApprovalFrom}
                get_search_list = {this.props.GetPoPendingOrder}
                search_result = {this.props.purchase_order}
                loading = {this.props.pr_loading}
                history = {this.props.history}
                location = {this.props.location}
              
             />
          </div>
        </Tab>
      <Tab eventKey="POListing" title="PO Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <PoListing 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetPoListing}
                search_result = {this.props.po_listing}
                loading = {this.props.po_loading}
                history={this.props.history}
            />
        </div>
      </Tab>
     
    </Tabs></div>
    }
}



const mapStateToProps = state => ({
  purchase_order : state.purchase_order.responseList,
  pr_loading : state.purchase_order.loading,
  po_listing : state.po_listing.responseList,
  po_loading : state.po_listing.loading,
})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetPoPendingOrder : (values) => dispatch(GetPoPendingOrder(values)),
  GetPoListing : (values) => dispatch(GetPoListing(values)),
  
})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;