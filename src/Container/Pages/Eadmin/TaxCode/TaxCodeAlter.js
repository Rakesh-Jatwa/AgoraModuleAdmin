import React, {Component, Fragment} from 'react';
import {reduxForm } from 'redux-form';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import {GetUserGroupList, GetCountry, GetTaxCodeRate} from '../../../../Actions/Eadmin'
import Loader from '../../../../Component/Loader'
import {TaxCodeSave} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'

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
            save_object : {
                "TM_TAX_INDEX":"",
                "TM_TAX_CODE": "",
                "TM_TAX_DESC": "",
                "COUNTRY": "",
                "TM_COUNTRY_CODE": "MY",
                "TM_TAX_TYPE": "P",
                "TAXRATE": "",
                "TM_TAX_RATE": "ZR"
            },
            type : '',
            table_body :[],
            taxCodeRequired: '',
            taxDescriptionRequired: ''

        }
    }

    componentDidMount(){
        this.props.GetTaxCodeRate()
        this.props.GetCountry()
        let {save_object} = this.state
        if(this.props.type=="add"){
            this.setState({
                type :this.props.type
            })
        }
        else if(this.props.type=="modify"){
            let  {datas} = this.props
            let _temp_data = Object.assign({},save_object, datas)
            console.log('_temp_data',_temp_data)
            this.setState({
                save_object : _temp_data,
                type :this.props.type
            })
        }

    }

    componentWillReceiveProps(nextProps) {
        let {save_object} = this.state
        if(nextProps.type=="modify"){
            let  {datas} = nextProps
            let _temp_data = Object.assign({},save_object, datas)
            console.log('_temp_data',_temp_data)
            this.setState({
                save_object : _temp_data,
                type :nextProps.type
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

    ChangeValue = async(values, target_id) =>{
       let {save_object} = this.state;
       if(target_id=="TM_TAX_CODE"){
            save_object.TM_TAX_CODE  = values;
       }
       else if(target_id=="TM_TAX_DESC"){
            save_object.TM_TAX_DESC  = values;
       }
       else if (target_id=="TM_COUNTRY_CODE"){
            save_object.TM_COUNTRY_CODE = values.options[values.selectedIndex].value;
            save_object.COUNTRY = values.options[values.selectedIndex].text;
       }
       else if (target_id=="TM_TAX_TYPE"){
           console.log('TM_TAX_TYPE',values.target )
            save_object.TM_TAX_TYPE = values.options[values.selectedIndex].value;
       }
       else if (target_id=="TM_TAX_RATE"){
            save_object.TM_TAX_RATE = values.options[values.selectedIndex].value;
            save_object.TAXRATE = values.options[values.selectedIndex].text;
       }
       this.setState({
            save_object : save_object
       })
    }


    Reset = () => {
        this.setState({
            list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
            render : false
        })
    }

    ClearAll = () =>{
      let {save_object} = this.state
      if(this.props.type=="modify"){
        let  {datas} = this.props;
        let _temp_data = Object.assign({},save_object, datas);
        this.setState({
            save_object : _temp_data,
            type :this.props.type
        });
      } else {
        this.setState({
            save_object : {
                "TM_TAX_INDEX":"",
                "TM_TAX_CODE": "",
                "TM_TAX_DESC": "",
                "COUNTRY": "",
                "TM_COUNTRY_CODE": "MY",
                "TM_TAX_TYPE": "P",
                "TAXRATE": "",
                "TM_TAX_RATE": "ZR"
            }
        });
      }
    }

    handleFormSubmit= async(values={}) =>{
       let {save_object, type} = this.state

       if(save_object.TM_TAX_CODE === '' || save_object.TM_TAX_DESC === '') {
         this.setState({
           taxCodeRequired: save_object.TM_TAX_CODE === '' ? 'Tax Code is required.' : '',
           taxDescriptionRequired: save_object.TM_TAX_DESC === '' ? 'Description is required.': ''
         });
         return;
       }

       if(save_object){
            let _details_main = save_object
            _details_main.strMode = type;
            this.setState({loading:true})
            let _status = await ApiExtract(TaxCodeSave, _details_main);
            if(_status){
                this.setState({
                    loading:false,
                    submit_type :"add",
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }

       }
       else{
           this.setState({
               status:false,
               loading:false,
               submit_type :"save",
               show:true,
               title : '',
               message : 'Fill all required fields',
           })
       }
    }


    render(){
        const { handleSubmit } = this.props
        let {type, save_object} = this.state
        let {country, tax_code_rate} = this.props
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.tx_loading) ? <Loader /> : '' }
              {(this.props.ct_loading) ? <Loader /> : '' }

                <TabHeading color={'bg-info text-white'}> Please add the following value.</TabHeading>

                <form>
                    <div className="row mt-2">
                        <div className="col-12">
                            <div className="row tax_code_maintenance">
                                <div className="col-xs-12 col-sm-6 col-md-4">
                                    <label>Tax Code <sapn className="text-danger">*</sapn> :</label>
                                    <input disabled={(type=="add") ? false  : true} type="text" name="TM_TAX_CODE" className="form-control" value={save_object.TM_TAX_CODE} onChange={(e)=>this.ChangeValue(e.target.value, "TM_TAX_CODE")}/>
                                    <div className="text-danger">{this.state.taxCodeRequired}</div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-4">
                                    <label>Description <sapn className="text-danger">*</sapn> :</label>
                                    <input type="text" name="TM_TAX_DESC" className="form-control" value={save_object.TM_TAX_DESC} onChange={(e)=>this.ChangeValue(e.target.value, "TM_TAX_DESC")}/>
                                    <div className="text-danger">{this.state.taxDescriptionRequired}</div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-4">
                                    <label>Country <sapn className="text-danger">*</sapn> :</label>
                                    <select type="text" name="TM_COUNTRY_CODE" className="form-control" value={(save_object.TM_COUNTRY_CODE) ? save_object.TM_COUNTRY_CODE : 'MY'} onChange={(e)=>this.ChangeValue(e.target, "TM_COUNTRY_CODE")}>
                                        <option value="">--Select--</option>
                                        {country.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.CODE_DESC}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-4 mt-2">
                                    <label>Type <sapn className="text-danger">*</sapn> :</label>
                                    <select type="text" name="TM_TAX_TYPE" className="form-control" value={(save_object.TM_TAX_TYPE) ? save_object.TM_TAX_TYPE :'P'} onChange={(e)=>this.ChangeValue(e.target, "TM_TAX_TYPE")}>
                                        <option value="P">Purcahse</option>
                                        <option value="S">Supply</option>
                                    </select>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-4 mt-2">
                                    <label>Rate <sapn className="text-danger">*</sapn> :</label>
                                    <select type="text" name="TM_TAX_RATE" className="form-control" value={(save_object.TM_TAX_RATE) ? save_object.TM_TAX_RATE : 'ZR'} onChange={(e)=>this.ChangeValue(e.target, "TM_TAX_RATE")}>

                                        {tax_code_rate.map((list)=>{
                                           return <option value={list.CODE_ABBR}>{list.GST}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-4 mt-2" style={{"padding-top":"20px"}}>
                                    <button type="button" className="btn btn-sm btn-outline-success"
                                      onClick={()=>this.handleFormSubmit()}
                                    >Save</button>
                                    <button type="button" className="btn btn-sm btn-outline-primary ml-2" onClick={()=>this.ClearAll()}>{this.props.type === "modify" ? 'Reset' : 'Clear'}</button>
                                    <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={()=>this.props.close()}>Cancel</button>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 mt-4'>

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
    country : state.ed_country.responseList,
    ct_loading : state.ed_country.loading,
    tax_code_rate : state.tax_code_rate.responseList,
    tx_loading : state.tax_code_rate.loading,
})

const mapDispatchToProps = dispatch => ({
    GetUserGroupList  : () => dispatch(GetUserGroupList()),
    GetCountry : () => dispatch(GetCountry()),
    GetTaxCodeRate  : () => dispatch(GetTaxCodeRate()),
})


const HolidayCalenderHolder = connect(mapStateToProps, mapDispatchToProps)(HolidayCalender);
export default reduxForm({
    form:'HolidayCalenderHolder',
})(HolidayCalenderHolder);
