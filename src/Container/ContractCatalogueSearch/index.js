import React,{Component} from 'react';
import {Field, reduxForm } from 'redux-form';
import {FromInputs, FromSelect, CheckBoxInline} from '../../Component/From/FromInputs'
class ContractCatalogueSearch extends Component{
  
    state = {
        seletced:[]
    }
    static getDerivedStateFromProps(props,state){
        if(props.seletced && props.seletced.length){
            return {
                seletced: props.selected.length
            }
        }
    }

    render(){
      
        const { handleSubmit } = this.props
        return <form onSubmit={handleSubmit(this.props.handlefiltersubmit.bind(this))}>
     
                <div className="row mt-2">  
                    <div className='col-12 col-sm-12 col-lg-6'>  
                        <div className="row mt-2"> 
                            <Field type="text" name="contractcatlog.ItemCode" component={FromInputs} className="form-control" placeholder="Item Code" label="Item Code" />
                        </div>    
                        <div className="row mt-2"> 
                            <Field name="contractcatlog.ContractRefNo" className="form-control mb-3" component={FromSelect} label={"Contract Ref. No. :"}>
                                    <option selected value="">--Select--</option>
                                    {this.props.contract_ref_no_and_desc && this.props.contract_ref_no_and_desc.contractRefNo && this.props.contract_ref_no_and_desc.contractRefNo.map((list)=>{
                                        return   <option key={list.CDM_GROUP_INDEX} value={list.CDM_GROUP_INDEX}>{list.CDM_GROUP_CODE}</option>
                                    })}  
                            </Field>
                        </div>    
                        <div className="row mt-2"> 
                            <Field name="contractcatlog.ContractDescription" className="form-control mb-3" component={FromSelect} label={"Contract Description :"}>
                                <option selected value="">--Select--</option>
                                {this.props.contract_ref_no_and_desc && this.props.contract_ref_no_and_desc.contractDescription && this.props.contract_ref_no_and_desc.contractDescription.map((list,index)=>{
                                    return   <option key={index} value={list.CDM_GROUP_DESC}>{list.CDM_GROUP_DESC}</option>
                                })} 
                            </Field>
                        </div>
                        <div className="row mt-2"> 
                         <div className="col-md-4 col-sm-4 col-lg-4"><label>Item Type :</label></div>
                            <div className="col-md-6 col-sm-6 col-lg-6">                            
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" id="Spot" value="SP" name="contractcatlog.itemTypeList" onChange={this.props.handleCheckChieldElement}   checked={this.state.seletced.includes("'SP'")}/>Spot
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" id="Stock" value="ST" name="contractcatlog.itemTypeList"  onChange={this.props.handleCheckChieldElement}   checked={this.state.seletced.includes("'ST'")}/>Stock
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" id="MRO" value="MI" name="contractcatlog.itemTypeList"  onChange={this.props.handleCheckChieldElement}   checked={this.state.seletced.includes("'MI'")}/>MRO
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    <div className='col-12 col-sm-12 col-lg-6'>  
                    <div className="row mt-2"> 
                            <Field type="text" name="contractcatlog.ItemName" component={FromInputs} className="form-control" placeholder="Item Name" label="Item Name" />       
                    </div>   
                    <div className="row mt-2"> 
                       <Field name="contractcatlog.Vendor" className="form-control mb-3" component={FromSelect} label={"Vendor :"}>
                               <option selected value="">--Select--</option>
                               {this.props.vendor_name_list_service && this.props.vendor_name_list_service.VendorList && this.props.vendor_name_list_service.VendorList.map((list,index)=>{
                                   return   <option key={list.value} value={list.value}>{list.label}</option>
                               })}  
                       </Field>
                    </div>    
                    <div className="row mt-2">
                            <Field name="contractcatlog.CommodityType" className="form-control mb-3" component={FromSelect} label={"Commodity Type :"}>
                                <option selected value="">--Select--</option>
                                {this.props.commodity_list && this.props.commodity_list.CommodityList && this.props.commodity_list.CommodityList.map((list)=>{
                                    return     <option key={list.value} value={list.value} >{list.label}</option>
                                })} 
                            </Field>
                    </div> 
                    <div className="row mt-2"> 
                        <div className="col-md-12 text-center">
                            <button type="submit" className="btn btn-sm btn-outline-info" id="showBtn" onClick={(e)=>this.props.show_table()}>Search</button>
                            <button type="button" className="btn btn-outline-secondary btn-sm ml-2" onClick={this.pops.SelectAll}>Select All</button>
                            <button type="button" className="btn btn-sm btn-outline-danger ml-2" ml-2="" onClick={this.props.ClearAll}>Clear</button>
                        </div>
                    </div>      
                </div> 
            </div>      
        </form>
    }
}


export default reduxForm({
    form:'filterform'
})(ContractCatalogueSearch);