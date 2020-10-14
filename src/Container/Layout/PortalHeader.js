import React, {useState, useRef, useEffect} from 'react';   
import SideBarLogo from './agora_logo-white.png'
import TopBarLogo from './strateq-logo-default.png'
import {UserDetails} from '../../Common/LocalStorage'
import {DateMinusTimeLogin} from '../../Component/Dates'
import {Logout} from '../../Actions/Auth'

let Profile_details = UserDetails();
console.log('Profile_details', Profile_details)

function PortalHeader(props){
    const wrapperRef = useRef(null);
    const [menuDisplay, setMenuDisplay] = useState('true'); 
    return (
     <section className="frame-header">
            <div className="head-row" num="0">
                <div className="agora-logo">
                    <img src={TopBarLogo} className="logo" alt="" />
                    <span className="build_number">1.2</span>
                </div>
            </div>

            <div className="head-row" num="1">
                <div className="company-logo">
                    <img src={TopBarLogo} className="logo" alt="" />
                </div>
            </div>
            <div className="head-row" num="2">
                <div className="details-logs">
                <span >  Welcome {Profile_details.UM_USER_NAME} from {Profile_details.COMP_NAME}<br /> Last Log On : {DateMinusTimeLogin(Profile_details.LAST_LOGIN)}</span>
                </div>
                <div className="avatar btnProfile" >
                      
                </div>
                <p className="username btnProfile" ref={wrapperRef} onClick={() => setMenuDisplay((menuDisplay=='false' ? 'true' : 'false'))}>{(Profile_details && Profile_details.UM_USER_NAME) ? Profile_details.UM_USER_NAME : ''} <i className="fa fa-chevron-down top-icon"></i></p>
                    <div className="profile-dropdown" hide={menuDisplay}>
                        <div className="dropdown-opt">
                            <div className="profile-dropdown-item btnProfileItem" htmlFor="profile">
                                <i className="fa fa-user"></i>
                                <p>Profile</p>
                            </div>
                            <div className="profile-dropdown-item btnProfileItem" htmlFor="signout" onClick={(e)=>props.logout()}>
                                <i className="fa fa-sign-out"></i>
                                <p>Sign Out</p>
                            </div>
                        </div>
                    </div>
            </div>
    </section>
    )
}
export default PortalHeader;
