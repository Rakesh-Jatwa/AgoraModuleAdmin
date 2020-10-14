import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
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

    componentWillReceiveProps(nextProps) {   
        if(nextProps.dashboard_listing && nextProps.dashboard_listing && nextProps.dashboard_listing.responseList){   
            let products= this.state.products;
            products.length= 0;
            nextProps.dashboard_listing.responseList.forEach((item) => {
                products.push(item);
            })
          //  nextProps.dashboard_listing.responseList
        //  products= JSON.parse(JSON.stringify(nextProps.dashboard_listing.responseList)) 
            this.setState({
                products 
            })
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
                    list_item.dm_panel_name = values;
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
                frm:"matrix",
                role: this.state.roleMatrix,
                matrixData : products
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
           
            console.log('_details ',_details);

            let products= this.state.products;
            products.length= 0;
            this.setState({
                show_roles:true,
                products: products,
                rendered:false,
                roleMatrix: _details
            })
            this.props.GetDashboardList(_temp_details)
        }
       
    }

    handleCheck = (row) =>{
        let {products} = this.state;         
       
        if(products && products.length){         

            let index= products.findIndex(todo => todo == row);
            if(index !== -1)
                products[index].checked= !products[index].checked;      
        }
        this.setState({
            products 
        })
    }   

    render(){

        console.log('this.state.product ',this.state.products);
    
        const _table_header = [
            {name : "Dashboard Panel Name", id:"dm_panel_name", key:true},
            {name : "Allow View", id:"dm_fixed_role_id", width:'136px', formatter: (cellContent, row) => {
                return(
                   <input type="checkbox" defaultChecked={row.checked} onChange={() => this.handleCheck(row)} />
                )
            }},
        ]
       
        const fixed_roles =  this.props.fixed_roles && this.props.fixed_roles.length  ?  this.props.fixed_roles.sort(function(a, b){
                                        //compare two values
                                        if(a.FR_ROLE_ID < b.FR_ROLE_ID) return -1;
                                        if(a.FR_ROLE_ID > b.FR_ROLE_ID) return 1;
                                        return 0;
                                    
                                    }) :[];  
        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              <div className="show_list">  
                 <PageHeading  heading="Dashboard Matrix" subheading="Choose a User role to change the dashboard matrix."  />
                 <TabHeading>Dashboard Maintenance</TabHeading> 
                
                    <div className="col-12 col-md-6">
                        <div className="row mt-2">
                            {/* <div className="col-12 col-md-3 "><label>User Role : {this.state.search_object.role} </label></div> */}
                            <div className="col-12 col-md-3 "><label style={{"padding-top":"6px"}}>User Role : </label></div>
                            <div className="col-12 col-md-9">
                                
                                <select className="form-control" onChange={(e)=>this.handleSelect(e.target.value)} disable_input={(this.state.modeType=="rights") ? true : false} value={this.state.search_object.role}>
                                    <option value="">--Select--</option>
                                    {( fixed_roles && fixed_roles.length) ? fixed_roles.map((list)=>{
                                        return <option value={list.FR_ROLE_ID}>{list.FR_ROLE_ID}</option>  
                                    }) :''}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-2">    
                        <div className='col-12'>   
                        {this.state.show_roles ?
                             <Fragment>
                                <BootstrapCustomTable 
                                    table_header={_table_header} 
                                    table_body={this.state.products} 
                                    products={this.getProducts} 
                                    select={false} 
                                    click={false}
                                    responsive={true} 
                                    selectall={this.getProductsall}
                                    change={true}
                                    getInputs={this.handleTableInputs}
                                />
                                <Alert 
                                    message={this.state.message}
                                    status={this.state.status} 
                                    show={this.state.show} 
                                    confirm={this.closeModel}
                                />
                                <div className="row mt-2">
                                    <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.Save()}>Save</button> </div>
                                </div>
                            </Fragment>
                        :''}
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