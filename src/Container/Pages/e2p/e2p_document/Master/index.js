import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import Alert from '../../../../../Component/Modal/alert'
import {connect} from 'react-redux';
import {GetFreeFormDetails, RaisePR} from '../../../../../Actions/Requester'
import { FromInputsPlain} from '../../../../../Component/From/FromInputs'

class BuyerCatalogue extends Component {
    constructor(props){
        super(props);
        this.rise_pr  = this.rise_pr.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.handleCheckChieldElement = this.handleCheckChieldElement.bind(this)
        this.closeModel = this.closeModel.bind(this);
        this.state = {
            products:[],
            open:false,
            loading:false,
            checkbox:[],

            model:false ,
            status:false ,
            modal_body : '',

        }
    }

  


   async rise_pr(){
        let {products} = this.state
        let _temp_submit_details = await this.saveItem()
        if(_temp_submit_details){
            this.props.GetSubDoc(products)
        }
    }


    saveItem = async () =>{
        let {products} = this.state;
        let _result = true;
        if(products.length){
            await products.forEach((list_details)=>{   
                if(!list_details.hasOwnProperty('docNo') || !list_details.docNo){
                    this.setState({
                        model:true,
                        status:false,
                        modal_body : 'Enter Document Number'
                    })

                    _result = false
                }
                else if(!list_details.hasOwnProperty('docDate') || !list_details.docDate){
                    this.setState({
                        model:true,
                        status:false,
                        modal_body : 'Enter Date'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('docAmount') || !list_details.docAmount){
                    this.setState({
                        model:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'Enter Amount'
                    })
                    _result = false
                }

                else if(!list_details.hasOwnProperty('docGstAmount') || !list_details.docGstAmount){
                    this.setState({
                        model:true,
                        status:false,
                        modal_title : 'Validation',
                        modal_body : 'Enter SST Amount'
                    })
                    _result = false
                }

              
                else{
                     _result = true
                }
            })
            return _result
        }
        else{
            return false
        }
        

        
    }

    getProducts (values){
        let _all_products = this.state.products;
        if(_all_products){
            _all_products.push(values)
            this.setState({
                products : _all_products
            })
        }
    }

    handleCheckChieldElement(event){
        let {checkbox} = this.state
        let _value = `'${event.target.value}'`
        if(checkbox.indexOf(_value)<0){
            checkbox.push(_value);
            this.setState({checkbox:checkbox})
        }
    }

    handle_change = (item_value, index, type ) =>{
        let _pre_build = this.state.products;

        let _details = {
            docNo: "",
            docDate:  "",
            docAmount: "",
            docGstAmount:"0"
        }
    
      
        if(index in _pre_build){
            let _details =  _pre_build[index];
            _details.docNo = (type=="docNo") ? (item_value).trim() : _details.docNo;
            _details.docDate = (type=="docDate") ? item_value : _details.docDate;
            _details.docAmount = (type=="docAmount") ? item_value :  _details.docAmount;
            _details.docGstAmount = (type=="docGstAmount") ? item_value : _details.docGstAmount;
            _pre_build[index] = _details
        }
        else{

            _details.docNo = (type=="docNo") ? (item_value).trim() : _details.docNo;
            _details.docDate = (type=="docDate") ? item_value : _details.docDate;
            _details.docAmount = (type=="docAmount") ? item_value :  _details.docAmount;
            _details.docGstAmount = (type=="docGstAmount") ? item_value : _details.docGstAmount;
            _pre_build[index] = _details
        }
        
        this.setState({ products : _pre_build})
    }

    
    build_details = () =>{
        let {products} = this.state
        
        let _details = [];
        for(var i=0; i<10; i++){
            let _main_details = i
            _details[i] = <tr>
                <td>{i+1}</td>
                <td><input className="form-control" defaultValue={''} name={`docNo[${i}]`} id={_main_details} onChange={(e)=>this.handle_change(e.target.value, _main_details,'docNo')}/></td>
                <td><FromInputsPlain className="form-control" date={(products.hasOwnProperty(i) && products[i]) ? products[i].docDate : '' } onChange={(e)=>this.handle_change(e, _main_details,'docDate')} /></td>
                <td><input className="form-control" defaultValue={''} name={`docAmount[${i}]`} id={_main_details} onChange={(e)=>this.handle_change(e.target.value, _main_details,'docAmount')}/></td>
                <td><input className="form-control" disabled defaultValue={'N/A'} name={`docGstAmount[${i}]`} id={_main_details} onChange={(e)=>this.handle_change(e.target.value, _main_details,'docGstAmount')}/></td>
            </tr>
        }
        return _details;
    }
    

    

    closeModel = () =>{
        this.setState({
            model:false,
            status:false,
        })
    }
    render(){
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.fl_loading) ? <Loader /> : '' }
            
            
                
                <Alert 
                    title={'Validation Message'}
                    message='Please Select Atleast One Item'
                    status={this.state.status} 
                    show={this.state.open} 
                    confirm={this.closeModel}
                />

                {JSON.stringify(this.state.products)}
                <div className="row mt-2">    
                    <div className='col-12'> 
                        {this.build_details}
                        <table className="table table-striped head-info">
                            <thead>
                                <th style={{'width':'40px'}}>S/No</th>
                                <th>Document No <span className="text-danger">*</span></th>
                                <th>Document Date </th>
                                <th>Amount </th>
                                <th>SST Amount</th>
                                
                            </thead>
                            <tbody>
                                {this.build_details()}
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-md-6 col-lg-6 text-left">
                               
                                <button type="submit" className="btn btn-sm btn-outline-danger" id="showBtn" onClick={()=>this.props.closemodel()}>Close</button>
                                <button type="submit" className="btn btn-sm btn-outline-info ml-2" id="showBtn" onClick={this.rise_pr}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Alert 
                    title=''
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closeModel}
                />
        </Fragment>
    }
}


const mapStateToProps = state => ({
   
    pr_loading: state.raise_pr.loading,
    pr_response: state.raise_pr.responseList
})

const mapDispatchToProps = dispatch => ({
    RaisePR  : (values) => dispatch(RaisePR(values)),
})

const BuyerCatalogueHolder = connect(mapStateToProps, mapDispatchToProps)(BuyerCatalogue);

export default BuyerCatalogueHolder;
