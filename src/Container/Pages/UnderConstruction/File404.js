import React,{Fragment} from 'react'
import {Link} from 'react-router-dom'
function UnderConstruction(){
    return <Fragment>
         <div className="col-md-12">
            <div className="error-template">
                <h1>Oops!</h1>
                <div className="error-details">
                  File does not exist
                </div>
                <div className="error-actions">
                    <Link to="/dashboard" className="btn btn-primary"><span className="glyphicon glyphicon-home"></span>Take Me Home </Link>
                    <button type="button" className="btn btn-danger" onClick={()=>window.close()}>Close</button>
                </div>
            </div>
        </div>
    </Fragment>    
}
export default UnderConstruction;