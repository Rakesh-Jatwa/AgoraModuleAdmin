import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {GetDashboardList, GetFixedRoles} from '../../../../../Actions/Eadmin'
import {DashboardSave} from '../../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../../Common/GetDatas'
class DashboardMaster extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.state = {
            products:[],
            modal_body : '',
            modal : false,
            status : false,
            modal : false,
            rendered: false,
            title:'',
            message:'',
            show_roles:false,
            status:false,
            show:false,
            search_object : {
                "frm":"matrix",
                "role":""
            }
        }
    }

    static getDerivedStateFromProps(props,state){
        if(props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList){
            return {
                products:props.dashboard_listing.responseList,
                rendered:true ,
            }
        }
    }

    componentDidMount(){
        this.props.GetFixedRoles()
    }

    componentDidUpdate(){
        let _details = this.props.get_role()
        let {search_object} = this.state
        if(_details && _details.role_id && _details.render){
            this.props.block_render()
            this.handleSelect(_details.role_id);
            search_object.role = _details.role_id
            this.setState({
                search_object : search_object
            })
        }
    }

    closeModel (details){
        this.setState({
            show : false,
        })
    }

    ChangeValue = async(values, props) =>{
        let {products} = this.state;
        let _details = [];
        if(products && products.length){
            _details =  await products.map( (list_item, index)=>{
                if(list_item.dm_dashboard_id == props.dm_dashboard_id){
                    list_item.dm_panel_name = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            products : _details
        })
    }   

    Save = async() =>{
        let {products} = this.state;
        if(products && products.length){
            let _temp_details ={
                frm:"master",
                dashboardData : products
            }
            this.setState({loading:true})
            let _status = await ApiExtract(DashboardSave, _temp_details);
            if(_status){
                this.setState({
                    loading:false,
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
        else{
            this.setState({
                loading:false,
                show:true,
                title : '',
                status :false,
                message : 'No master item to save',
            })
        }
    }

    handleSelect = (e) =>{
        let _details = e;
        if(_details){
            let _temp_details = this.state.search_object
            _temp_details.role = _details
           
            this.setState({
                show_roles:true,
                rendered:false
            })
            this.props.GetDashboardList(_temp_details)
        }
       
    }

    render(){
    
        const _table_header = [
            {name : "Dashboard Panel Name", id:"dm_panel_name", key:true},
            {name : "Allow View", id:"dm_fixed_role_id", width:'136px', formatter: (cellContent, row) => {
                return(
                   <input type="checkbox" />
                )
            }},
        ]

       

        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
              <PageHeading 
                    heading=""
                    subheading="The document prefixes will appear in your transaction document as standard prefix with auto-numbering, e.g. RFQ000001 " 	
                />
                 <TabHeading color={'bg-info text-white'}>Document Prefix And Last Used Number</TabHeading>
                 <form>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>RFQ Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="PAMB/RFQ/" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>RFQ Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1800322"  />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>PR Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="PAMB/PR/"  />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label> PR Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1800723" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>PO Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="PAMB/PO/" />    
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label> PO Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1805717" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label> GRN Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="PAMB/GRN/" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>GRN Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1803228" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>SRN Prefix  : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="PAMB/SRN/" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>SRN Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder=""  />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label> Payment Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <input name="" type="text" className="form-control" placeholder="PAMB/PY/"  />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Payment Last Used No.: </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1800031" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Tender Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="PAMB/TND/"  />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Tender Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="Kuala Lumpur" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label> Cancellation Request Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="PAMB/CR/" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Cancellation Request Last Used No : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1800070" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Inventory Requisition Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="5PAMB/IR/0250" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Inventory Requisition Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1800004" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Inventory Transfer Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <input type="text" name="" className="form-control" placeholder="PAMB/IT/"  />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Inventory Transfer Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="1800000" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Return Inward Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Return Inward Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div> 
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Return Outward Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Return Outward Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div> 
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div> 
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Write Off Prefix : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Write Off Last Used No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>   
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>  
                        <TabHeading color={'bg-info text-white'}>IQC Document Prefix And Last Used Number</TabHeading>  
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-5">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> IQC Test Type Label :</label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-7">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-3"><label><strong>Prefix :</strong></label></div>
                                                <div className="col-12 col-md-5">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                                <div className="col-12 col-md-4">
                                                <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="checkbox" name="prefix" id="prefix1"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Check Attachment(DO)</label>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div> 
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-5">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> IQC Test Type Label :</label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-7">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-3"><label><strong>Prefix :</strong></label></div>
                                                <div className="col-12 col-md-5">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                                <div className="col-12 col-md-4">
                                                <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="checkbox" name="prefix" id="prefix1"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Check Attachment(DO)</label>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div> 
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-5">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> IQC Test Type Label :</label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-7">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-3"><label><strong>Prefix :</strong></label></div>
                                                <div className="col-12 col-md-5">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                                <div className="col-12 col-md-4">
                                                <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="checkbox" name="prefix" id="prefix1"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Check Attachment(DO)</label>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div> 
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2 mb-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                <button type="submit" className="btn btn-sm btn-outline-success">Add Line</button>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div> 
                        <TabHeading color={'bg-info text-white'}>Company Setting</TabHeading>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label><strong>RFQ Option :</strong></label></div>
                                                <div className="col-12 col-md-6">
                                                    <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="radio" name="radio"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Open</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="radio" name="radio"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Closed</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="radio" name="radio"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Defined By Buyer</label>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6">
                                                    <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Allow Free Form Billing Address</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Display Account Code Option (PDF)</label>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <TabHeading color={'bg-info text-white'}>Contract Item PR Setting</TabHeading>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="radio" name="radio2"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Buyer As Owner of Purchase Order (for order cancellation)</label>
                                                    </div>
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="radio" name="radio2"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Purchasing Officer As Owner of Purchase Order (for order cancellation) :</label>
                                                    </div>
                                                </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-8">
                                                <div className="row mt-2">
                                                    <div className="col-12 col-md-4"><label> Select Purchasing Officer :</label></div>
                                                 <div className="col-12 col-md-5">
                                                    <select className="form-control" aria-readonly>
                                                        <option value="">--Select--</option>
                                                        
                                                    </select>
                                                 </div>
                                                </div>
                                             </div>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <TabHeading color={'bg-info text-white'}>Non-Contract Item PRSetting</TabHeading>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="radio" name="radio3"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Buyer As Owner of Purchase Order (for order cancellation)</label>
                                                    </div>
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="radio" name="radio3"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Purchasing Officer As Owner of Purchase Order (for order cancellation) :</label>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <TabHeading color={'bg-info text-white'}>PR Submission Access with GRN Control</TabHeading>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label><strong>PR Submission Access with GRN Control :</strong></label></div>
                                                <div className="col-12 col-md-6">
                                                    <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="radio" name="radio4"  />
                                                        <label className="form-check-label ml-2" for="prefix1">On</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input classNmae="form-check-input" type="radio" name="radio4"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Off</label>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <TabHeading color={'bg-info text-white'}>Inventory Setting</TabHeading>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-3"><label>Stock Received Auto Acknowledge :</label></div>
                                                <div className="col-12 col-md-4">
                                                    <input name="" type="text" className="form-control" placeholder="" />
                                                    <div className="text-danger"></div>
                                                </div>
                                                <div className="col-12 col-md-4">
                                                <label className="form-check-label ml-2">Working Days (Requestor Item)</label>
                                                </div>
                                            </div>
                                    </div>
                                </div> 
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6">
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox2"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Urgent Inventory Request Email Notification </label>
                                                    </div>
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox1"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Reject MRS Email Notification</label>
                                                    </div>
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox1"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Allow Inventory Location Selection (Inventory Requisition) </label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox2"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Safety Level Email Notification  </label>
                                                    </div>
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox1"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Reorder Level Email Notification </label>
                                                    </div>
                                                    <div className="form-check pl-0">
                                                        <input classNmae="form-check-input" type="checkbox" name="checkbox1"  />
                                                        <label className="form-check-label ml-2" for="prefix1">Maximum Inventory Level Email Notification</label>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>   
                            </div>
                        </div> 
                        <TabHeading color={'bg-info text-white'}>Smart Pay Cap Limit </TabHeading>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-3"><label>Smart Pay Cap Limit :</label></div>
                                                <div className="col-12 col-md-4">
                                                    <input name="" type="text" className="form-control" placeholder="0.00" />
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                    </div>
                                </div> 
                            </div>
                        </div>       
                    </form>
                    <div className="col-12 col-md-6 mt-2 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <p>Note - <span className="text-danger">*</span> indicates required field </p>
                                </div>
                            </div>
                        </div> 
                    <div className="col-12 col-md-6 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm">Save</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2">Reset</button>
                                </div>
                            </div>
                        </div>
                </div>      
     </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing : state.dashboard_listing.responseList_1,
    loading : state.dashboard_listing.loading,
    fixed_roles : state.fixed_roles.responseList
})
  
const mapDispatchToProps = dispatch => ({
    GetDashboardList  : (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles  : (values) => dispatch(GetFixedRoles(values)),
})

const DashboardMasterHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardMaster);
export default DashboardMasterHolder