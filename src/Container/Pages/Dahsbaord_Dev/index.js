import React, {Component } from 'react';
import {connect} from 'react-redux';
import {GetDashbaord} from '../../../Actions/Requester'
import Loader from '../../../Component/Loader'
import DisplayDashbaord from './DisplayDashbaord'



class Dashbaord extends Component{
    componentDidMount(){
        this.props.GetDashbaord();
    }
    render(){
        return <div>
        {(this.props.loading) ? <Loader /> : '' }
        <h3>Dashboard</h3>
            <DisplayDashbaord {...this.props} />
        </div>
    }
}


const mapStateToProps = state => ({
    dashboard : state.dashboard.responseList,
    loading : state.dashboard.loading,
})

const mapDispatchToProps = dispatch => ({
    GetDashbaord  : () => dispatch(GetDashbaord()),
})
const DashbaordHolder = connect(mapStateToProps, mapDispatchToProps)(Dashbaord);
export default DashbaordHolder;

