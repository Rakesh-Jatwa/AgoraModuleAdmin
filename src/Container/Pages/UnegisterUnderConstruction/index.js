import React,{Fragment} from 'react'
import {Link} from 'react-router-dom'
import logo from './agora_logo-white.png'
import './login.css';
function UnderConstruction(){
    return <Fragment>
         <section className="row login-container">
            <div className="form-container">
                <div className="form-box">
                    <div className="error-template" style={{color:'white'}}>
                        <h1>
                            Oops!</h1>
                        <h2>
                            404 Not Found</h2>
                        <div className="error-details">
                            Sorry, an error has occured, Requested page not found!
                        </div>
                        <div className="error-actions">
                            <Link to="/" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>Take Me Home </Link>
                        </div>
                    </div>
                   
                </div>
            </div>
        </section>
    </Fragment>    
}
export default UnderConstruction;