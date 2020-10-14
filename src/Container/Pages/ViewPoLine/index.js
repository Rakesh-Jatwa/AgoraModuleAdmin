import React, {Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {TodayDateSalash} from '../../../Component/Dates';
import Loader from '../../../Component/Loader'
import {NumberFormateEmpty} from '../../../Actions/Common/Functions'
import Alert from '../../../Component/Modal/alert'

class InvoiceViewDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            rendered:true,
            search_list : {}
        }
    }


   static getDerivedStateFromProps(props, state){
        if((props.search_list) && props.search_list.length >0 ){
            return {
                search_list:props.search_list[0],
                rendered:false
            }
        }
        return {props, state}
    }




    documentDownload(filePath){
        this.props.download_file(filePath)
    }


  
    render(){
        console.log('search_lis', this.state.search_list)
        return <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }

                    <PageHeading 
                        heading="" 
                        subheading="Fill in the search criteria and click Search button to list the relevant Invoice." 
                    />
                    <TabHeading color={'bg-info text-white'}>PO Line Listing</TabHeading> 
                    <div className=""><div>
                    <br />
                    <div className="row mt-2">
                            <div  className="col-12 col-md-2 col-lg-2"><label>PO Number : </label></div>
                            <div className="col-12 col-md-4 col-lg-4"><p> {(this.state.search_list) ? this.state.search_list.POD_PO_NO : '' }</p></div>
                            <div className="col"><label> Order Date : </label></div>
                            <div className="col-12 col-md-4 col-lg-4"><p> {(this.state.search_list) ? TodayDateSalash(this.state.search_list.POM_PO_DATE) : '' }</p></div>
                    </div>
                    <hr />
                    <div className="row mt-2">
                            <div  className="col-12 col-md-2 col-lg-2"><label>Line : </label></div>
                            <div  className="col-12 col-md-6 col-lg-6"><p>{(this.state.search_list) ? this.state.search_list.POD_PO_LINE : '' }</p></div>
                            <div className="col"></div>
                            <div className="col"></div>

                    </div>
                    <div className="row mt-2">
                            <div  className="col-12 col-md-2 col-lg-2"><label>Item Code: </label></div>
                            <div  className="col-12 col-md-6 col-lg-6"><p>{(this.state.search_list) ? this.state.search_list.POD_VENDOR_ITEM_CODE : '' }</p></div>
                            <div className="col"></div>
                            <div className="col"></div>
                    </div>
                    <div className="row mt-2">
                            <div className="col"><label>Description : </label></div>
                            <div  className="col-12 col-md-6 col-lg-6">{(this.state.search_list) ? this.state.search_list.POD_PRODUCT_DESC : '' }</div>
                            <div className="col"></div>
                            <div className="col"></div>
                    </div>
                    <div className="row mt-2">
                            <div className="col"><label> Remarks : </label></div>
                            <div  className="col-12 col-md-6 col-lg-6">{(this.state.search_list) ? this.state.search_list.POD_REMARK : '' }</div>
                            <div className="col"></div>
                            <div className="col"></div>
                    </div>
                    <hr />
                    <div className="row mt-2">
                            <div  className="col-12 col-md-2 col-lg-2"><label> Currency : </label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {(this.state.search_list) ? this.state.search_list.POM_CURRENCY_CODE : '' }</div>
                            <div className="col"><label> Received : </label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {((this.state.search_list && this.state.search_list.POD_RECEIVED_QTY) ? NumberFormateEmpty(this.state.search_list.POD_RECEIVED_QTY) : 0.00 )}</div>
                    </div>
                    <div className="row mt-2">
                            <div  className="col-12 col-md-2 col-lg-2"><label> Quantity   : </label></div>
                            <div className="col-12 col-md-4 col-lg-4">{((this.state.search_list && this.state.search_list.POD_ORDERED_QTY) ? NumberFormateEmpty(this.state.search_list.POD_ORDERED_QTY) : 0.00 )}</div>
                            <div className="col"><label> Rejected : </label></div>
                            <div  className="col-12 col-md-4 col-lg-4">{((this.state.search_list && this.state.search_list.POD_REJECTED_QTY) ? NumberFormateEmpty(this.state.search_list.POD_REJECTED_QTY) : 0.00 )} </div>
                    </div>
                    <div className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label> Unit Cost : </label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {((this.state.search_list && this.state.search_list.POD_UNIT_COST) ? NumberFormateEmpty(this.state.search_list.POD_UNIT_COST) : 0.00 ) }</div>
                            <div className="col"><label> Total Received Cost : </label></div>
                            <div className="col-12 col-md-4 col-lg-4"> {((this.state.search_list && this.state.search_list.POM_ACC_SHIP_AMT) ? NumberFormateEmpty(this.state.search_list.POM_ACC_SHIP_AMT) : 0.00 ) } </div>
                    </div>
                    <div className="row mt-2">
                            <div className="col"><label> Total Cost : </label></div>
                            <div  className="col-12 col-md-6 col-lg-6">{((this.state.search_list && this.state.search_list.POM_PO_COST) ? NumberFormateEmpty(this.state.search_list.POD_UNIT_COST * this.state.search_list.POD_ORDERED_QTY) : 0.00 )}</div>
                            <div className="col"></div>
                            <div className="col"> </div>
                    </div>
                    <div className="row mt-2">
                            <div className="col"><label> SST Rate : </label></div>
                            <div  className="col-12 col-md-6 col-lg-6"> {(this.state.search_list && this.state.search_list.POD_GST_RATE!=null) ? this.state.search_list.POD_GST_RATE : '' }</div>
                            <div className="col"><label> </label></div>
                            <div className="col"></div>
                    </div>
                    <div className="row mt-2">
                            <div className="col"><label> Total Cost w/SST : </label></div>
                            <div  className="col-12 col-md-6 col-lg-6">{((this.state.search_list && this.state.search_list.POD_GST_RATE) ? NumberFormateEmpty((this.state.search_list.POD_UNIT_COST * this.state.search_list.POD_ORDERED_QTY)  + parseFloat((this.state.search_list.POD_UNIT_COST * this.state.search_list.POD_ORDERED_QTY) * (this.state.search_list.POD_GST)/100)) : 0.00 ) }</div>
                            <div className="col"><label> </label></div>
                            <div className="col"></div>
                    </div>
                            <br />
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.close_view()} >Back</button>
                        </div>
                    </div>
             
        </Fragment>
    }
}

export default InvoiceViewDetails
