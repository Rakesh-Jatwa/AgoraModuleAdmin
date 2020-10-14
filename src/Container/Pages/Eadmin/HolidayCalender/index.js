import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {GetUserGroupList, GetState, GetCountry, GetHolidayList} from '../../../../Actions/Eadmin'
import Loader from '../../../../Component/Loader'
import {PolicyListSave, HolidayDelete} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
import {FormDatePicker,FromSelectParallel, FromInputsParallel} from '../../../../Component/From/FromInputs'
import {FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import AddHoliday from './AddHoliday'
import {FormDatePickerReact} from '../../../../Component/From/FromInputs'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'

class HolidayCalender extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.getProductsall = this.getProductsall.bind(this);
        this.hide_add = this.hide_add.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.state = {
            products:[],
            render:false,
            title:'',
            message:'',
            status:false,
            show:false,
            list: [],
            submit_type:'',
            show_details : '',
            confimation_pop:false ,
            country : [],
            show_table :false,
            edit_details : {},
            country_name : '',
            state_name : '',
            hm_country:'MY',
            search_object : {
                hm_country: "",
                hm_state: "All",
                hm_year:new Date().getFullYear()
            },
            modify_details : {}

        }
    }

    componentDidMount(){
        this.props.GetCountry()
        this.props.change('hm_country','MY')
        this.setState({
            country_name : 'Malaysia',
            state_name: 'All States',
            hm_country: 'MY'
        })
        this.props.GetState({countryCode : 'MY'})
    }

    closemodel = () => {
        this.setState({
            show : false
        })
        if(this.state.status && this.state.submit_type=="delete"){
            this.handlefromsubmit()
        }
    }

    async  getProducts (values, details){
        let _all_products = this.state.products
        if(details){
            _all_products.push(values)
            await this.setState({
                products : _all_products
            })
        }
        else{
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.hm_index != values.hm_index);
             await this.setState({
                products : _products
            })
        }
    }

    Reset = () => {
        this.setState({
            list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
            render : false
        })
    }


    Save = async() => {
       let {list} = this.state
       if(list && list.length){
            let _status = await ApiExtract(PolicyListSave, list);
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

    handlefromsubmit= async(values={}) =>{
       let {search_object} = this.state
       let _values  = Object.assign({},search_object, values)

       if(_values && _values.hm_country && _values.hm_year){
            this.props.GetHolidayList(_values)
            this.setState({
                show_table : true,
                search_object : _values
            })

       }
       else{
            this.setState({
                status:false,
                loading:false,
                show:true,
                title : '',
                message : 'Country and Year is Required',
            })
       }

    }

    Add = () =>{
        this.setState({
            show_details : 'add',
        })
    }

    Modify = () =>{
        let {products, search_object} = JSON.parse(JSON.stringify(this.state));
        if(products.length){
            if(products.length == 2 ){
                if(products[0].hm_index == products[1].hm_index){
                    products.splice(0,1);
                }
            }
            if(products.length == 1){
                products = products[0]
                let _temp_details  = {...products, ...search_object};
                _temp_details.hm_date = FromateDate_YY_MM_DD(_temp_details.hm_date)
                this.setState({
                    modify_details : _temp_details,
                    show_details : "modify"
                })
            }
            else{
                this.setState({
                    show:true,
                    status :false,
                    message : 'Please choose only one selection!',
                })
            }
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make at least 1 selection!',
            })
        }
    }

    confirm_function = (type, text) => {
        let {products, search_object} = this.state;
        if(products.length === 0){
            this.setState({
                show:true,
                status :false,
                message : 'Please make at least 1 selection!',
            })
            return false;
        }

        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            modal_body: `Are you sure that you want to ${text} ?`,
        })

    }

    Delete = async() =>{
        let {products, search_object} = this.state;
        if(products.length){
            let _status = await ApiExtract(HolidayDelete, {delData:products});
            if(_status){
                this.handlefromsubmit()
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"delete",
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="delete"){
            this.Delete()
        }
    }

    hide_add = () =>{
        this.handlefromsubmit()
        this.setState({
            show_details : '',
        })
        this.props.reset('HolidayCalenderHolder')
    }

    ClearAll = () =>{
        this.props.reset('HolidayCalenderHolder');
        this.setData();
    }

    setData(){
        this.props.GetCountry()
        this.props.change('hm_country','MY')
        this.setState({
            country_name : 'Malaysia',
            state_name: 'All States',
            hm_country: 'MY'
        })
        this.props.GetState({countryCode : 'MY'})
    }


    handleChange = (e) =>{
        this.props.GetState({countryCode : e.value})
        this.setState({
          hm_country: e.value,
          country_name: e.selectedOptions[0].label
         });
    }

    handleStateChange = (e) =>{
        this.setState({
          state_name: e.selectedOptions[0].label
         });
    }

    ClodeAdd = () =>{

        console.log('ClodeAdd ');
        this.handlefromsubmit();
        this.setProducts();
        this.setState({
            show_details: ''
        })
        this.props.reset('HolidayCalenderHolder')
    }

    async setProducts (){
        let _all_products = this.state.products
        _all_products.length= 0;
        await this.setState({
            products : _all_products
        })
    }

    async  getProductsall (_products, details){
        let _all_products = this.state.products
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    _all_products.push(_products[i])
                    if (i != _products.length) {
                        await this.setState({products : _all_products})
                    }
                }
            }
            else{
                let temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                        temp_query = temp_query.filter((fieldValue, index) => fieldValue.hm_index != _products[i].hm_index);
                        if (i != _products.length) {
                             this.setState({products : temp_query})
                        }

                }

            }
        }

    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "No", id:"hm_index",type:"index", width:'30px',key:true,key:true},
            {name : "Holiday Date", id:"hm_date", width:'100px', dataFormat:'date'},
            {name : "Day", id:"hm_day", width:'100px'},
            {name : "Description", id:"hm_desc", width:'350px'},
        ];
        let {country, pro_state, holiday_list} = this.props
        let {country_name, state_name} = this.state

        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.st_loading) ? <Loader /> : '' }

              {(this.state.show_details === "") ?

              <Fragment>
                <PageHeading  heading="Holiday Calendar" subheading=""  />
                <TabHeading color={'bg-info text-white'}> Search Criteria</TabHeading>
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className='row'>
                        <div className="col-12 col-sm-6">
                            <div className="row width-full">
                                <div className="col-12 col-md-3 mt-2">
                                    <label>
                                         Country :
                                    </label>
                                 </div>
                                <div className="col-12 col-md-9">
                                    <select type="text" name="hm_country" value={this.state.hm_country} onChange={(e)=>this.handleChange(e.target)} className="form-control" placeholder="Country " label="Country " rem={true}>
                                        <option value=""> -- Select --</option>
                                        {country.map((list)=>{
                                            return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-2 width-full">
                                <Field type="text" name="hm_state" component={FromSelectParallel} className="form-control" placeholder="State " label="State " rem={true}
                                   onChange={(e)=>this.handleStateChange(e.target)}
                                >
                                    <option selected="selected" value="All">All States</option>
                                    {pro_state.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                    })}
                                </Field>
                            </div>
                            <div class="row mt-2 width-full">
                              <div class="col-12 col-md-6 parallel-label">
                                <div class="row mt-2">
                                  <div class="col-12 col-md-3 mt-2" style={{paddingRight: '0px'}}>
                                    <label>Year <span class="text-danger">*</span> :</label>
                                  </div>
                                  <div class="col-12 col-md-9">
                                    <input name="hm_year" class="form-control" placeholder="2020" id="hm_year" value=""/>
                                    <div class="text-danger"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-12 col-lg-12 text-right mt-3">
                                    <button type="submit" className="btn btn-sm btn-outline-success" >Search</button>
                                    <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Clear</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
                {(this.state.show_table) ?
                <div className="row mt-2">
                    <div className='col-12'>
                        <BootstrapCustomTable
                            table_header={_table_header}
                            table_body={holiday_list}
                            products={this.getProducts}
                            select={true}
                            selectname={'pr_no'}
                            responsive={true}
                            click={false}
                            table_name="issue_grn"
                            selectall={this.getProductsall}
                        />
                    </div>
                    <div className="col-md-6 col-lg-6 text-left mt-2">
                        <button type="button" className="btn btn-sm btn-outline-success" onClick={()=>this.Add()}>Add</button>
                        <button type="button" className="btn btn-sm btn-outline-primary ml-2" onClick={()=>this.Modify()}>Modify</button>
                        <button type="reset" className="btn btn-sm btn-outline-danger ml-2"    onClick={()=>this.confirm_function('delete', 'permanently delete this item(s)')}>Delete</button>
                    </div>
                </div> : ''}


                </Fragment>
                : ''}

                {(this.state.show_details === "add") ?
                    <AddHoliday
                        datas = {this.state.search_object}
                        close = {this.ClodeAdd}
                        country_name = {country_name}
                        state_name = {state_name}
                        type={this.state.show_details}

                    />
                : ''}

                {(this.state.show_details === "modify") ?

                    <AddHoliday
                        datas = {this.state.modify_details}
                        close = {this.ClodeAdd}
                        country_name = {country_name}
                        state_name = {state_name}
                        type={this.state.show_details}

                    />
                : ''
              }

                <Alert
                    confirm={this.closemodel}
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
                />

                <ConfirmationModel
                     title=""
                     confimation = {true}
                     message={this.state.modal_body}
                     status={this.state.status}
                     show={this.state.confimation_pop}
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />
        </Fragment>
    }
}

const mapStateToProps = state => ({
    ug_list : state.ug_list.responseList,
    loading : state.ug_list.loading,
    pro_state : state.ed_state.responseList,
    st_loading : state.ed_state.loading,
    country : state.ed_country.responseList,
    holiday_list : state.holiday_list.responseList,
})

const mapDispatchToProps = dispatch => ({
    GetUserGroupList  : () => dispatch(GetUserGroupList()),
    GetCountry : () => dispatch(GetCountry()),
    GetState : (values) => dispatch(GetState(values)),
    GetHolidayList : (values) => dispatch(GetHolidayList(values))
})


const HolidayCalenderHolder = connect(mapStateToProps, mapDispatchToProps)(HolidayCalender);
export default reduxForm({
    form:'HolidayCalenderHolder',
})(HolidayCalenderHolder);
