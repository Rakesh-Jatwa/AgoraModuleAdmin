import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux';
import { GetPOSummary } from '../../../../Actions/SysAdmin';

class Report extends Component {

    constructor(props) {
        super(props);
        this.months = ["--Select--", "January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"];

        this.years = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011",
         "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
        this.state = {
            monthValue: '--Select--',
            yearValue: '--Select--',
            fileType: 'Excel',
            showMonthValidation: false,
            showYearValidation: false,
            toReports: false
        }
    }

    getPOSummary = () => {
        if(this.state.monthValue === '--Select--' || this.state.yearValue === '--Select--') {
            this.setState({
            showMonthValidation: this.state.monthValue === '--Select--',
            showYearValidation: this.state.yearValue === '--Select--'
            });
            return;
        }
        let startDate = this.state.yearValue + '-' +
         this.months.findIndex(month => month === this.state.monthValue) + '-01 00:00:00';
        let toMonthValue = this.months.findIndex(month => month === this.state.monthValue);
        let endDate = this.state.yearValue + '-' +
         toMonthValue + '-' + new Date(parseInt(this.state.yearValue), toMonthValue, 0).getDate() + ' 00:00:00';

        let data = {
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "startDate": startDate,
            "endDate": endDate,
            "exportAs": "excel"
        };
        this.setState({
            showMonthValidation: false,
            showYearValidation: false
            });
        this.props.GetPOSummary(data);
    }

    reset = () => {
        this.setState({
            monthValue: '--Select--',
            yearValue: '--Select--',
            fileType: 'Excel',
            showMonthValidation: false,
            showYearValidation: false
        });
    }

    render() {
        if (this.state.toReports) {
            return <Redirect to='/Reports' />
        }
        return <Fragment>

            {(this.props.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}

            <div className="show_list">
                <PageHeading heading="[B] PO Summary"
                    subheading="Microsoft Excel is required in order to open the report in Excel format. "

                />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Report Criteria</TabHeading>
                <form>
                    <div classNmae="row mt-3">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Month<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.monthValue}
                                                onChange={(e)=>{this.setState({monthValue: e.target.value})}}
                                            >
                                                {
                                                    this.months.map((data)=>(
                                                        <option value={data}>{data}</option>
                                                    ))
                                                }
                                            </select>
                                            {
                                                this.state.showMonthValidation ?
                                                <div className="text-danger">Month is required.</div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Year<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.yearValue}
                                                onChange={(e)=>{this.setState({yearValue: e.target.value})}}
                                            >
                                                <option value="--Select--">--Select--</option>
                                                {
                                                    this.years.map((data)=>(
                                                        <option value={data}>{data}</option>
                                                    ))
                                                }
                                            </select>
                                            {
                                                this.state.showYearValidation ?
                                                <div className="text-danger">Year is required.</div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                </div>
                            </div>
                            <div className="row mt-3">
                                        <div className="col-md-12'">
                                            <p>Note - <span className="text-danger">*</span> indicates required field </p>
                                        </div>
                                    </div>

                            <div className="row mt-2">
                                <div className="col-12 col-md-12 mt-2 text-right">
                                    <button type="submit" className="btn btn-sm btn-outline-success"
                                        onClick={()=>{this.getPOSummary()}}
                                    >Submit</button>
                                    <button type="reset" className="btn btn-sm btn-outline-danger ml-2"
                                        onClick={()=>{this.reset()}}
                                    >Clear</button>
                                </div>
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
    GetPOSummary: (values) => dispatch(GetPOSummary(values)),
})

const ReportHolder = connect(mapStateToProps, mapDispatchToProps)(Report);
export default ReportHolder
