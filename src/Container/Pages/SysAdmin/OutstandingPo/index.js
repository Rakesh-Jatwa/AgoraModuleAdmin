import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux';
import { GetOutstandingPO } from '../../../../Actions/SysAdmin';

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileType: 'Excel',
            toReports: false
        }
    }

    getOutstandingPO = () => {
        let data = {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "name": "Buyer",
            "exportAs": "excel"
        };
        this.props.GetOutstandingPO(data);
    }

    render() {
        if (this.state.toReports) {
            return <Redirect to='/Reports' />
        }
        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}

            <div className="show_list">
                <PageHeading heading=" [B] Outstanding PO"
                    subheading="Microsoft Excel is required in order to open the report in Excel format. "

                />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Report Criteria</TabHeading>
                <form>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Report Type<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.fileType}
                                                onChange={(e)=>{this.setState({fileType: e.target.value})}}
                                            >
                                                <option value="Excel">Excel</option>
                                                <option value="PDF">PDF</option>
                                            </select>
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div>
                                            <p>Note - <span className="text-danger">*</span> indicates required field </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-12 mt-2 text-right"><button type="submit" className="btn btn-sm btn-outline-success"
                                        onClick={()=>{this.getOutstandingPO()}}
                                    >Submit</button>
                                    <button type="reset" className="btn btn-sm btn-outline-danger ml-2">Clear</button></div>
                            </div>
                            <div className="row mt-2">
                                <div>
                                    <button type="reset" className="btn btn-sm btn-outline-danger"
                                    onClick={()=>{this.setState({toReports: true})}}>Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </Fragment>
    }
}


const mapStateToProps = state => ({
    report_list: state.report_list.responseList,
    loading: state.report_list.loading,
})

const mapDispatchToProps = dispatch => ({
    GetOutstandingPO: (values) => dispatch(GetOutstandingPO(values)),
})

const ReportHolder = connect(mapStateToProps, mapDispatchToProps)(Report);
export default ReportHolder
