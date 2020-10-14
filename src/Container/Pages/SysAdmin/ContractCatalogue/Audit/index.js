import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import {ApiExtract} from '../../../../../Common/GetDatas';
import {ContractCatGetContractRefNo} from "../../../../../Apis/SysAdmin";

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.state = {
            startDateTime: Date().toLocaleString(),
            endDateTime: Date().toLocaleString(),
            contractRefList:[],
            reportType: 'Excel',
            contractRef: '--Select--',
        }
        this.onContractRefChange = this.onContractRefChange.bind(this);
    }

    componentDidMount(){
        this.getContractRefNo();
    }

    getContractRefNo = async () => {
        let response = await ApiExtract(ContractCatGetContractRefNo, {});
        this.setState({
          contractRefList: response.response,
        });
    }

    startDateChange = (e) => {
        this.setState({
            startDateTime: e.target.value
        })
    }

    endDateChange = (e) => {
        this.setState({
            endDateTime: e.target.value
        })
    }

    onContractRefChange = (e) =>{
        if(e.target.value){
            let getData = this.state.contractRefList.filter( ele =>(
                ele.CDM_GROUP_INDEX === parseInt(e.target.value,10)
            ));
            debugger;
            this.setState({
                contractRef: getData[0].CDM_GROUP_INDEX
            });
        } else {
            this.setState({
                contractRef: '--Select--'
            });
        }
    }

    onClearHandle = () => {
        this.setState({
            startDateTime: Date().toLocaleString(),
            endDateTime: Date().toLocaleString(),
            contractRef: '--Select--',
            reportType: 'Excel'
        });
    }

    render(){
        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

              <div className="show_list">
              <PageHeading
                    heading=""
                    subheading="*Microsoft Excel is required in order to open the report in Excel format. "
                />
                <TabHeading color={'bg-info text-white'}>Report Criteria</TabHeading>
                <form>
                        <div classNmae="row">
                            <div className="col-12 col-sm-12 pl-0 pr-0">
                                <div className="row mt-2">
                                        <div className="col-12 col-md-4">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>Start Date :</label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name=""
                                                        type="date"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={this.state.startDateTime}
                                                        onChange={(e)=>{ this.startDateChange(e)}}/>
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-6"><label>End Date : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <input name=""
                                                        type="date"
                                                        className="form-control"
                                                        placeholder=""
                                                        value={this.state.endDateTime}
                                                        onChange={(e)=>{ this.endDateChange(e)}}/>
                                                    <div className="text-danger"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-6"><label>Contract Ref. No.:<span className="text-danger">*</span>. </label></div>
                                            <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.contractRef}
                                                onChange={(e)=>{ this.onContractRefChange(e) }}
                                            >
                                                <option value="">--Select--</option>
                                                {
                                                    this.state.contractRefList &&
                                                    this.state.contractRefList.map((data) => (
                                                        <option value={data.CDM_GROUP_INDEX}>
                                                            {data.CDM_GROUP_CODE}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-6"><label>Report Type:<span className="text-danger">*</span> </label></div>
                                            <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.reportType}
                                                onChange={(e)=>{
                                                    this.setState({
                                                        reportType: e.target.value
                                                    })
                                                }}
                                            >
                                                <option value="Excel">Excel</option>
                                                <option value="PDF">PDF</option>
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4 mt-4">
                                    <div className="col-12 col-md-6">
                                        <div className="row">
                                        <p className="pl-3"><span className="text-danger">*</span>indicates required field  </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="col-12 col-md-12 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm">Submit</button>
                                    <button type="button"
                                        className="btn btn-outline-danger btn-sm ml-2"
                                        onClick={()=>this.onClearHandle()}
                                    >Clear</button>
                                </div>
                            </div>
                        </div>
                </div>


     </Fragment>
    }
}


const mapStateToProps = state => ({
    loading : state.dashboard_listing.loading,
})

const mapDispatchToProps = dispatch => ({
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder
