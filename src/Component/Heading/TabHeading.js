import React,{Fragment} from 'react';
const PageHeading = (props) => {
  return <Fragment>
       <div className={`d-flex bg-lightblue p-1 mt-2 mb-3 ${props.color}`} onClick={props.onClick}>
           {props.children}
       </div>
  </Fragment>;
}
export default PageHeading;
