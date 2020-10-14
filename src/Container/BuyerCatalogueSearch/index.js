import React,{Component} from 'react';
import {Field, reduxForm } from 'redux-form';
import {FromInputs, FromSelect} from '../../Component/From/FromInputs'
class ContractCatalogueSearch extends Component{
    render(){
        const { handleSubmit } = this.props
        return <form onSubmit={handleSubmit(this.props.handlefiltersubmit.bind(this))}>
     
                <div className="row mt-2">  
                    <div className='col-12 col-sm-12 col-lg-6'>  
                        <div className="row mt-2"> 
                            <Field type="text" name="buyerDto.ItemCode" component={FromInputs} className="form-control" placeholder="Item Code" label="item Code" />
                        </div>    
                        <div className="row mt-2"> 
                            <Field name="buyerDto.BuyerCatalogue" className="form-control mb-3" component={FromSelect} label={"Contract Ref. No. :"}>
                                    <option selected value="">--Select--</option>
                                    {this.props.catalogue_dropdown && this.props.catalogue_dropdown.catalogueDropdown && this.props.catalogue_dropdown.catalogueDropdown.map((list)=>{
                                        return   <option key={list.BCM_CAT_INDEX} value={list.BCM_CAT_INDEX}>{list.BCM_GRP_DESC}</option>
                                    })}  
                            </Field>
                        </div>    
                        
                        <div className="row mt-2"> 
                         <div className="col-md-4 col-sm-4 col-lg-4"><label>Item Type :</label></div>
                            <div className="col-md-6 col-sm-6 col-lg-6">                            
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" id="Spot" value="SP" name="contractcatlog.itemTypeList" onChange={this.props.handleCheckChieldElement}   checked={this.props.isChecked}/>Spot
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" id="Stock" value="ST" name="contractcatlog.itemTypeList"  onChange={this.props.handleCheckChieldElement}   checked={this.props.isChecked}/>Stock
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" id="MRO" value="MI" name="contractcatlog.itemTypeList"  onChange={this.props.handleCheckChieldElement}   checked={this.props.isChecked}/>MRO
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    <div className='col-12 col-sm-12 col-lg-6'>  
                    <div className="row mt-2"> 
                            <Field type="text" name="buyerDto.BuyerCatalogue" component={FromInputs} className="form-control" placeholder="Item Name" label="item Name" />       
                    </div>   
                    <div className="row mt-2"> 
                            <Field type="text" name="buyerDto.CommodityType" component={FromInputs} className="form-control" placeholder="Commodity Type " label="Commodity Type :" />       
                    </div>  
                   
                    <div className="row mt-2"> 
                        <div className="col-md-12 text-left">
                            <button type="submit" className="btn btn-sm btn-outline-info" id="showBtn">Search</button>
                            <button className="btn btn-outline-secondary btn-sm ml-2">Select All</button>
                            <button className="btn btn-sm btn-outline-danger ml-2" ml-2="">Clear</button>
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