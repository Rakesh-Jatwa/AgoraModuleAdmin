import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux';
import actions from '../../Actions/ActionCreators'
import Upload from '../Upload/ImageUpload'

class Dashboard extends Component{
 

    componentDidCatch(error, info){
    }
   
    render(){
        return <Fragment>
            <Upload UploadFile={this.props.UploadFile} token={this.props.token}/>
        </Fragment>
    }
}

const mapStateToProps = state => ({
    user_list : state.userlist.userlist,
    statustext : state.fileupload.statusText
})

const mapDispatchToProps = dispatch => ({
    UploadFile  : (token, fromdata) => dispatch(actions.UploadImage(token,fromdata))
})

const MainDashbaord = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default MainDashbaord;