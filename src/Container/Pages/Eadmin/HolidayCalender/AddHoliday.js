import React, {Component, Fragment} from 'react';
import {Field, reduxForm } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import {GetUserGroupList} from '../../../../Actions/Eadmin'
import Loader from '../../../../Component/Loader'
import {PolicyListSave, HolidaySave} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
import {FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import {HolidayAddPopup} from '../../../../Actions/Common/Functions'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {FormDatePickerReact} from '../../../../Component/From/FromInputs'
class HolidayCalender extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
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
            submit_type:'',
            show_details : '',
            show_table :false,
            edit_details : {},
            search_object : {
                hm_country: "",
                hm_state: "",
                hm_year: ""
            },
            type : '',
            table_body :[],
            isActive:false,
            
          
        }
    }

    componentDidMount(){
        let {table_body} = this.state
        if(this.props.type=="add"){
            let _temp_detaiuls = HolidayAddPopup()
            this.setState({
                table_body : _temp_detaiuls, 
                type :this.props.type
            })
        }
        else if(this.props.type=="modify"){
            let  {datas} = this.props
            datas.hm_date = new Date(datas.hm_date);
            table_body.push(datas)
            this.setState({
                table_body : table_body, 
                type :this.props.type
            })
        }
      
    }


    closemodel = () => {
        this.setState({
            show : false
        })
        if(this.state.status){
            this.props.close()
        }
    }


   
  
 


    ChangeValue = async(values, props) =>{
        let {table_body} = this.state;
        let _details = [];
        if(table_body && table_body.length){
            _details =  await table_body.map( (list_item, index)=>{
                if(list_item.hm_index == props.hm_index){
                    list_item.hm_desc = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            table_body : _details
        })
    }

    ChangeDate = async (values, list_index) =>{
        let {table_body} = this.state;
        let _details = [];
        if(table_body && table_body.length){
            _details =  await table_body.map( (list_item, index)=>{
                if(list_item.hm_index == list_index){
                    list_item.hm_date = values
                    return list_item;
                }
                else{
                    return list_item
                }
            })
        }
        this.setState({
            table_body : _details
        })
    }

    Reset = () => {
        this.setState({
            list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
            render : false
        })
    }

    
  
    ClearAll = async(e) =>{
    //    e.preventDefault();      
        this.props.reset('HolidayCalenderHolder')
        let {table_body} = this.state;
        let _details = [];
        if(table_body && table_body.length){
            _details =  await table_body.map( (list_item, index)=>{
                list_item['hm_date']= null;
                list_item['hm_desc']= '';
             //   list_item['hm_index']= '';
    
                return list_item;
            })           
        }
        this.setState({
            table_body : JSON.parse(JSON.stringify(_details)),
            isActive:false
            
        })
    
    }

    handlefromsubmit= async(values={}) =>{
       let {table_body, type} = this.state
       let {datas} = this.props

      
       table_body = table_body.filter((list)=> (list.hm_desc && list.hm_date))
       if(table_body && table_body.length){
            let _temp_details = table_body.map((list_details)=>{
                
                let _temp_details  = {};
                if(type=="add"){
                     _temp_details =    {...list_details, ...datas}
                }
                else{
                    _temp_details =    {...list_details}
                }
                
                _temp_details.hm_date = FromateDate_YY_MM_DD(_temp_details.hm_date)
                return _temp_details;
            })

            if(type=="add"){
                let _final_details = {
                    strMode : "add",
                    item : _temp_details,
                    ...datas
                }
    
                let _status = await ApiExtract(HolidaySave, _final_details);
                if(_status){
                    this.setState({
                        status:_status.status,
                        loading:false,
                        submit_type :"save",
                        show:true,
                        title : '',
                        status :_status.status,
                        message : (_status.message) ? _status.message :'Security policy saved',
                    })
                }
            }
            else if(type=="modify"){
                _temp_details = _temp_details[0]
                _temp_details.strMode = "modify";
               let _status = await ApiExtract(HolidaySave, _temp_details);
               if(_status){
                   this.setState({
                       status:_status.status,
                       loading:false,
                       submit_type :"save",
                       show:true,
                       title : '',
                       status :_status.status,
                       message : (_status.message) ? _status.message :'Security policy saved',
                   })
               }
            }

            
       }
       else{
           this.setState({
               status:false,
               loading:false,
               submit_type :"save",
               show:true,
               title : '',
               message : 'Please enter holiday start from and Description',
               isActive:true
               
           })
       }
       
    } 


    render(){
        const { handleSubmit } = this.props
        let {table_body, type} = this.state   
        const _table_header = [
            {name : "No", id:"date_created", width:'10px', key:true, type:'index'},
            {name : 'Date', id:"hm_date", dataFormat:"mandate_date", width:'20px', formatter: (cellContent, row) => {             
                return(
                    <FormDatePickerReact minDate={new Date()} selected={row.hm_date} handleChange={(e)=>this.ChangeDate(e, row.hm_index)} />
                )
            }},
            {name : "Description", id:"hm_desc", dataFormat:"mandate_input", width:'100px', formatter: (cellContent, row) => {
                return(
                    <input type="input" data-name={'1'} className="form-control" name={`name[${row.hm_index}]`} onChange={(e)=>this.ChangeValue(e.target.value, row)} value={row.hm_desc} placeholder="Enter Description   "/>
                )
            }},

        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }

                <TabHeading color={'bg-info text-white'}>{this.props.type=="modify" ? "Holiday Calendar Maintaiance" : "Holiday Calendar Maintaiance"}</TabHeading> 
                <PageHeading  heading={`${this.props.type=="modify" ? "Modify" : "Add"} Holiday Calendar`} subheading={`Country: ${this.props.country_name} State: ${this.props.state_name}`}/>
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-4">
                        <div className='col-12'>   
                            <BootstrapCustomTable 
                                table_header={_table_header} 
                                table_body={table_body } 
                                products={this.getProducts} 
                                select={false} 
                                selectname={'pr_no'} 
                                responsive={true} 
                                click={false}
                                table_name="issue_grn"
                            />
                        </div>
                        <div className='col-12'>   
                            {this.state.isActive?this.state.isActive==false:<button type="submit" className="btn btn-sm btn-outline-success">Save</button>}
                            {this.state.isActive?<button type="button" className="btn btn-sm btn-outline-primary ml-2" onClick={(e)=>this.ClearAll(e)}>Clear</button>:this.state.isActive==true}
                            {/* {type=="add" ?  */}
                                <Fragment>                                   
                                    <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={()=>this.props.close()}>Back</button>
                                </Fragment>
                            {/* :''} */}
                           
                        </div>
                    </div>
                </form>
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
    ug_list : state.ug_list.responseList,
    loading : state.ug_list.loading,
})

const mapDispatchToProps = dispatch => ({
    GetUserGroupList  : () => dispatch(GetUserGroupList()),
})


const HolidayCalenderHolder = connect(mapStateToProps, mapDispatchToProps)(HolidayCalender);
export default reduxForm({
    form:'HolidayCalenderHolder',
})(HolidayCalenderHolder);