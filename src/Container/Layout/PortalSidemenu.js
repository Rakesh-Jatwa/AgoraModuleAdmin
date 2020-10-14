import React, {Component, Fragment} from 'react';
import Logo from './agora_logo-white.png'
import { withRouter } from 'react-router';
import {Link} from 'react-router-dom'
import PortalMenu from '../../Common/PortalMenu'
import {UserDetails} from '../../Common/LocalStorage'
import SelectField from '../../Component/SelectField'
import {ApiExtract} from '../../Common/GetDatas'
import {SetGlobalCompany} from '../../Apis/Eadmin'

class PortalSideMenu extends Component{
    constructor(props){
        super(props)
        this.ListMenu = this.ListMenu.bind(this);
        this.state = {
            inlinemenu : PortalMenu,
            vendor_details : '',
            render: false,
            company_list : []
        }
    }

   componentDidMount(){
       let _user_Details = UserDetails();
       if(_user_Details.UM_COY_ID=='hub'){
            this.props.eadmin_menus()
       }
       else{
            this.props.get_user_menu()
       }
   }



    componentDidUpdate(){
        if((!this.state.render) && this.props.list_user_menu.hasOwnProperty('menuData')){
            let company_list = [];
            if(this.props.list_user_menu.hasOwnProperty('companyList')){
                company_list = this.props.list_user_menu.companyList.map((list)=>{
                    return {
                      value:  list.CM_COY_ID,
                      label:  list.CM_COY_NAME,
                    }
                })
            }
            this.setState({
                vendor_details : {label : this.props.list_user_menu.coyName, value : this.props.list_user_menu.coyID},
                company_list : company_list,
                render:true
            })
        }
    }

    ListMenu(list){
        console.log('ListMenu', list)
        let groups = Object.create(null);
        let itemMenueName = '';
        list.forEach(item => {
            if (!groups[item.MM_MENU_PARENT]) {
                groups[item.MM_MENU_PARENT] = [];
            }
            if(item.MM_MENU_ID === "111"){
              itemMenueName = (item.MM_MENU_NAME.toLowerCase()).split(" ").join("_").replace('(', '_').replace(')', '');
            } else {
              itemMenueName = (item.MM_MENU_NAME.toLowerCase()).split(" ").join("_");
            }
            groups[item.MM_MENU_PARENT].push({
                MM_MENU_NAME: item.MM_MENU_NAME,
                MM_MENU_LEVEL: item.MM_MENU_LEVEL,
                MM_MENU_PARENT: item.MM_MENU_PARENT,
                sumView: item.sumView,
                MM_CUSTOM_NAME: (item.MM_CUSTOM_NAME) ?
                item.MM_CUSTOM_NAME : itemMenueName
            });
        });

        let result = Object.entries(groups).map(([k, v]) => ({ [k]: v }));
        let ss = [];
        for (let i = 0; i < result.length; i++) {
            let j = Object.keys(result[i]);
            ss.push(result[i][j]);
        }
       return ss;
    }

    HandleChange = async(value) => {
        this.setState({loading:true})
        if(value){
            let _status = await ApiExtract(SetGlobalCompany, {coyName : value.label});
            if(_status){
                this.setState({
                    loading:false,
                    vendor_details : value
                })
               // console.log('this.props ',this.props);
               console.log("value.label",value.label)
                this.props.history.push({
                    pathname : "/company_details?"+value.label+"%20",
                    new_company : 'check_new_comp',
                })
            }
        }
    }


    render(){
        let _side_menu =[];
        if(this.props.list_user_menu && this.props.list_user_menu.hasOwnProperty('menuData')){
             _side_menu = this.ListMenu((this.props.list_user_menu && this.props.list_user_menu.menuData) ? this.props.list_user_menu.menuData : []);
        }
        else{
             _side_menu = this.ListMenu(this.props.list_user_menu);
        }

        return <div className="page-wrapper chiller-theme toggled">
        <Link id="show-sidebar" className="btn btn-sm btn-bars" to="dashboard">
            <i className="fa fa-angle-double-right"></i>
        </Link>
        <div id="sidebar" className="sidebar-wrapper">
                    <section className="frame-sidebar">
                        <div className="head">
                            <div className="agora-logo">
                                <img src={Logo} className="logo" alt="" />
                                <span className="build_number">2.4</span>
                            </div>
                            <div className="switch" id="close-sidebar">
                                <i className="fa fa-angle-double-left"></i>
                            </div>
                        </div>
                        <div className="init-head">
                            <p>Company</p>
                            {(this.props.list_user_menu && this.props.list_user_menu.hasOwnProperty('companyList') ? <Fragment>
                              <SelectField options={this.state.company_list} handleChange={this.HandleChange} selectedOption={this.state.vendor_details} isPlaceholder={false}/><Link
                            to={{pathname: `/company_details_new`, state:'new_company'}}
                            className="btn btn-sm btn-primary mt-2" >New Company</Link></Fragment>  : <input type="text" value={(this.props.list_user_menu && this.props.list_user_menu.hasOwnProperty('coyName')) ? this.props.list_user_menu.coyName : ""} />)}
                        </div>
                        <div className="init-sidebar-content">
                            <div className="sidebar-opt">
                                <div className="btn-sidebar-opt active" htmlFor="main" isopen="true">
                                    <i className="fa fa-home" htmlFor="icon" />
                                    <p className="sidebar-label">P2P</p>
                                </div>
                                {
                                    _side_menu.map((val, index) =>
                                        _side_menu[index].map((innerVal, innerIndex) =>
                                            <div className="btn-sidebar-opt" key={index + '' + innerIndex} htmlFor={_side_menu[index][innerIndex].MM_MENU_LEVEL == _side_menu[index][innerIndex].MM_MENU_PARENT ? "sub-1" : "sub-2"} isopen={_side_menu[index][innerIndex].MM_MENU_LEVEL == _side_menu[index][innerIndex].MM_MENU_PARENT ? "true" : "false"} sect={index + 1}>
                                                <i className="fa fa-chevron-right" htmlFor="front" />
                                                <Link to={{pathname:_side_menu[index][innerIndex].MM_CUSTOM_NAME, datas: 'main_menu'}} to={(_side_menu[index][innerIndex].MM_CUSTOM_NAME) ? (_side_menu[index][innerIndex].MM_CUSTOM_NAME).replace("/", "_") : '/'}><p className="sidebar-label">{_side_menu[index][innerIndex].MM_MENU_NAME}</p></Link>
                                                <i className="fa fa-caret-down" htmlFor="back" />
                                            </div>
                                        )
                                    )
                                }

                            </div>
                        </div>
                    </section>
                </div>
        </div>
    }
}

export default withRouter(PortalSideMenu);
