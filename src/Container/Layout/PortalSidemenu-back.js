import React, {Component} from 'react';  
import Logo from './agora_logo-white.png'
import {Link} from 'react-router-dom'
import PortalMenu from '../../Common/PortalMenu'



class PortalSideMenu extends Component{
    constructor(props){
        super(props)
        this.state = {
            inlinemenu : PortalMenu
        }
    }

    componentDidMount(){
        this.props.get_user_menu();
    }

    

    ListMenu(menus){

    }

    _handle_menu = async(e) =>{
        let _get_mainmenu = e.target.getAttribute('data-main-menu');
        let _get_submenu = e.target.getAttribute('data-sub-menu');
        let {inlinemenu} = this.state;
        let _new_menu =inlinemenu;
        if(_get_mainmenu!='' && _get_submenu!=''){
            _new_menu = await inlinemenu.map((list,index)=>{
                if(list.hasOwnProperty('children')){
                    if((index)==_get_mainmenu){
                       list.active = true;
                       return  list;
                    }
                    else{
                        list.active = false;
                        return  list;
                    }
                }
                else{
                     list.active = true;
                       return  list; 
                }
            })
        }

         this.setState({inlinemenu:_new_menu})
    }

    _handle_main_menu = (list) =>{
    }
    render(){
        const {inlinemenu} = this.state;

        return <div className="page-wrapper chiller-theme toggled">
        <Link id="show-sidebar" className="btn btn-sm btn-bars" to="dashboard">
            <i className="fa fa-angle-double-right"></i>
        </Link>
        <div id="sidebar" className="sidebar-wrapper">
            <section className="frame-sidebar">
                <div className="head">
                    <div className="agora-logo">
                        <img src={Logo} className="logo" alt="" />
                        <span className="build_number">1.2</span>
                    </div>
                    <div className="switch" id="close-sidebar">
                        <i className="fa fa-angle-double-left"></i>
                    </div>
                
                </div>
                <div className="init-head">
                    <p>Company</p>
                    <input type="text" value="Strateq HQ" />
                </div>
                {this.ListMenu(this.props.list_user_menu)}
                <div className="init-sidebar-content">
                    <div className="sidebar-opt">
                        <div className="btn-sidebar-opt active" htmlFor="main" >
                            <i className="fa fa-home" htmlFor="icon"></i>
                            <p className="sidebar-label">Contract Catalogue</p>
                           
                        </div>
                        <ul className="list-unstyled components ">
                            {
                               inlinemenu.map((list,index)=>{
                                    if(list.hasOwnProperty('children')){
                                        return <li className={(list.active) ? "btn-sidebar-opt-menu active" : "btn-sidebar-opt-menu "} data-main-menu={index}  htmlFor="sub-1" key={index}  onClick={(list.active) ? (index)=>this._handle_main_menu(index) :(index)=> this._handle_menu(index)}> 
                                            <i className="fa fa-chevron-right" htmlFor="front"></i>
                                            <p className="sidebar-label" data-menu={index}>{list.name}</p>
                                            <i className={(list.active) ? "fa fa-caret-down" : "fa fa-caret-right "} htmlFor="back"></i>
                                            <ul> 
                                                {list.children.map((sublist,subindex)=>{
                                                    return <li className="btn-sidebar-opt-menu" htmlFor="sub-2" data-main-menu={index}  data-sub-menu={subindex}  key={subindex} onClick={(index)=>this._handle_menu(index)}>
                                                            <i className="fa fa-chevron-right" htmlFor="front"></i> 
                                                            <p className="sidebar-label" data-main-menu={index} data-sub-menu={subindex}><Link to={sublist.url}>{sublist.name}</Link></p>
                                                        </li>
                                                    
                                                })}
                                            </ul>
                                        </li>
                                    }
                                    else{
                                        return <li className="btn-sidebar-opt-menu" htmlFor="sub-1" key={index} onClick={(inlinemenu,index)=>this._handle_menu(inlinemenu,index)}> 
                                        <i className="fa fa-chevron-right" htmlFor="front"></i>
                                        <p className="sidebar-label">{list.name}</p>
                                        <i className="fa fa-caret-right" htmlFor="back"></i>
                                    </li>
                                    }
                                   
                               })
                            }
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </div> 
    }
}

export default PortalSideMenu;
