import React, { Fragment } from 'react';  
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import {GetMenus, GetEAdminMenus} from '../../Actions/Common'
import {Logout} from '../../Actions/Auth'
import Header from './PortalHeader'
import Sidemenu from './PortalSidemenu'
import './layout.css'
  
const LoginLayout = ({ children, ...rest }) => (                       
        <Fragment> 
            <Header logout = {rest.logout}/>
                
              <Sidemenu 
                  get_user_menu={rest.get_user_menu}
                  list_user_menu={rest.list_user_menu}
              />    
        </Fragment> 
  );  
  
  function LoginLayoutRoute ({component: Component,children,  ...rest}) { 
    return (  
      <Route {...rest} render={matchProps => (  
        // <LoginLayout get_user_menu ={rest.GetMenus} list_user_menu={rest.user_menu} logout={rest.Logout}>  
          <div>
            <Header logout = {rest.Logout}/>
            <section className="frame-content" sidebar-open="true">
                    <div className="container-fluid mt-5">
                      {children}                                       
                    </div> 
            </section>
            <Sidemenu 
                  get_user_menu={rest.GetMenus}
                  list_user_menu={rest.user_menu}
                  eadmin_menus = {rest.GetEAdminMenus}
              />    
            </div> 
        // </LoginLayout>  
      )} />  
    )  
  };  
  


const mapStateToProps = state => ({
  user_menu : state.user_menu.responseList,
})

const mapDispatchToProps = dispatch => ({
  GetMenus  : (values) => dispatch(GetMenus(values)),
  GetEAdminMenus  : (values) => dispatch(GetEAdminMenus(values)),
  Logout : () => dispatch(Logout()),
})

const MenuHolder = connect(mapStateToProps, mapDispatchToProps)(LoginLayoutRoute);
export default MenuHolder;
