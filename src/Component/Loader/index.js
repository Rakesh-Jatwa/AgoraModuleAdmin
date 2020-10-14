import React from 'react'; 
import './loader.css';
import loader from './loader.gif'
const Loader = (props) => {
    return <div className="loader-holder" >
    <div className="loader">
        <img src={loader} alt="loader" />
    </div>
</div>
}

export default Loader