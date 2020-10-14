import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable_Update_Pagination'
import {GetPolicyList} from '../../../../Actions/Eadmin'
import Loader from '../../../../Component/Loader'
import {Field, reduxForm, reset } from 'redux-form';
import {PolicyListSave} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
class SecurityPolicyMaintenance extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.get_details = this.get_details.bind(this); 
        this.state = {
            products:[],
            render:false,
            start_data:'',
            end_data:'',
            title:'',
            message:'',
            status:false,
            show:false,
            checked_initial : [0,1,2],
            checked_details:[],
            list: [],
            resetArray:[],
        }
    }

    componentDidMount(){
        this.getDerivedStateFromProps1();
        this.props.GetPolicyList();
              
    }

    // static getDerivedStateFromProps(props,state){   
        
    
    //     if(props.policy_list && props.policy_list.length && !state.render){
    //     return {
    //             list :  props.policy_list,
    //             render : true
    //         }
    //     }
    // }    
 
    getDerivedStateFromProps1 = () =>{     

        if(this.props.policy_list && this.props.policy_list.length && !this.state.render){
            this.setState({
                list :  this.props.policy_list,
                render : true
            })
        }
    }

    componentWillReceiveProps(nextProps) {        
        this.setState({list: nextProps.policy_list});
    }


    closemodel = () => {
        this.setState({
            show : false
        })
    }


   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
                end_data:date
            })
            this.props.change('PoListing.UIEndDate',date)
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
            })
       }
    }

 

    get_details(details){
        this.props.history.push({
            pathname : '/purchaseorderDetails',
            datas : details,
            
        })
    }

    viewPageDetails(details, cell, row){
        this.props.get_pr_details(cell)
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: cell,
            type:'polisting'
        })
    }

     view_po = (details) =>{
        let _details = {
            "POM_B_COY_ID":details.POM_B_COY_ID,
            "POM_S_COY_ID":details.POM_S_COY_ID,
            "POM_PO_NO":details.POM_PO_NO,
          
        }

        this.props.history.push({
            pathname : 'po_cancellation',
            datas : _details,
            redirect_to_tab : 'profile',
            redirect_to_page : 'raiseFFPO',
        })
    }

    ChangeValue = async(values, props) =>{
        let {list} = this.state;
        let _details = [];
        if(list && list.length){
            _details =  await list.map( (list_item, index)=>{
                if(list_item.LP_AUTO_NO == props.LP_AUTO_NO){
                    list_item.LP_VALUE = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        console.log('============>',_details)
          this.setState({
              resetArray :_details
          })
        this.setState({
            list : _details
        })
    }

    ChangeSelect = async (values, props) =>{
        let {list} = this.state;
        let _details = [];
        if(list && list.length){
            _details =  await list.map( (list_item, index)=>{
                if(list_item.LP_AUTO_NO == props.LP_AUTO_NO){
                    list_item.LP_PARAM_IND = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            list : _details
        })
    }

    Reset = async() => {
        // this.props.GetPolicyList();
        // this.setState({
        //     list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
        //     render : false
        // })
         this.props.reset('SecurityPolicyMaintenanceHolder')

      //   ChangeSelect = async (values, props) =>{
            let policy_list = JSON.parse(JSON.stringify(this.props.policy_list));
            let _details = [];
            if(policy_list && policy_list.length && !this.props.loading){
                _details =  await policy_list.map( (list_item, index)=>{
                  
                        return list_item
                    
                })
            }
         //   window.location.reload();
            this.setState({
                list : JSON.parse(JSON.stringify(_details))
            })
      //  }
    
        for (let index = 0; index < this.state.resetArray.length; index++) {
            if(this.state.resetArray[index].LP_PARAM_IND="Yes"){
                this.state.resetArray[index].LP_PARAM_IND="No"
                this.state.resetArray[index].LP_VALUE=''
            }
            else{
                this.state.resetArray[index].LP_PARAM_IND="Yes"
                this.state.resetArray[index].LP_VALUE=''
            }
        
       }
    this.setState({
        resetArray:''
    })
 
    this.props.GetPolicyList();
    
    }

    
    Save = async() => {
       let {list} = this.state
       if(list && list.length){
            let _status = await ApiExtract(PolicyListSave, list);
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
       }
    }


    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "No", id:"date_created", width:'20px', key:true, type:'index',dataFormat:'security_index'},
            {name : "Policy", id:"LP_PARAM", width:'100px',dataFormat:'security_tag'},
            {name : "Description", id:"LP_PARAM_DESC", width:'160px', dataFormat:'security_tag'},
            {name : "Ind.", id:"LP_PARAM_IND", width:'40px',dataFormat:'security_tag' ,formatter: (cellContent, row) => {               
                return(
                   <select className="form-control" disabled={[2,4,5,6,9].indexOf(row.LP_AUTO_NO) !== -1  ? true : false}  onChange={(e)=>this.ChangeSelect(e.target.value, row)} defaultValue={row.LP_PARAM_IND} >
                       <option value="Yes" >Yes</option>
                       <option value="No">No</option>
                   </select>
                )
            }},
            {name : "Value", id:"LP_VALUE", width:'50px', dataFormat:'security_tag', formatter: (cellContent, row) => {
                return(
                   <input type="input" data-name={'1'} className="form-control"  disabled={row.LP_AUTO_NO == 1 ? true : false} name={`name[${row.LP_AUTO_NO}]`} onChange={(e)=>this.ChangeValue(e.target.value, row)} value={row.LP_VALUE} />
                )
            }},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              
          
             <PageHeading 
                heading="Security Policy Maintenance"
                subheading="" 
            />
             <hr></hr>
                   
                <div className="row mt-2">    
                    <div className='col-12'>   
                    {!this.props.loading ?
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.state.list) ? this.state.list : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={false}
                            table_name="issue_grn"
                        />:''}
                    </div> 
                    <div className="col-md-6 col-lg-6 text-left">
                        
                        <button type="button" className="btn btn-sm btn-outline-success" onClick={()=>this.Save()}>Save</button>
                        <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.Reset()}>Reset</button>
                    </div>
                </div>
                <Alert 
                    confirm={this.closemodel} 
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
                />
        </Fragment>
    }
}

const mapStateToProps = state => ({
    policy_list : state.policy_list.responseList,
    loading : state.policy_list.loading,
})

const mapDispatchToProps = dispatch => ({
    GetPolicyList  : () => dispatch(GetPolicyList()),
})


const SecurityPolicyMaintenanceHolder = connect(mapStateToProps, mapDispatchToProps)(SecurityPolicyMaintenance);
export default reduxForm({
    form:'SecurityPolicyMaintenanceHolder',
})(SecurityPolicyMaintenanceHolder);