import React,{Fragment} from 'react';
const PageHeading = (props) => {
  return <Fragment>
        <h6><strong>{props.heading}</strong></h6>
        <p>{props.subheading}</p>
  </Fragment>;
}
export default PageHeading;