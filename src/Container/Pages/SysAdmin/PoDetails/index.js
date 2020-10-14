import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux';
import { GetPODetails } from '../../../../Actions/SysAdmin';

class Report extends Component {

    constructor(props) {
        super(props);
        this.months = ["--Select--", "January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"];

        this.years = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011",
         "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
        this.state = {
            monthFromValue: "--Select--",
            yearFromValue: "--Select--",
            monthToValue: "--Select--",
            yearToValue: "--Select--",
            fileType: "Excel",
            showFromMonthValidation: false,
            showFromYearValidation: false,
            showToMonthValidation: false,
            showToYearValidation: false,
            toReports: false
        }
    }

    getPODetails = () => {
        if(this.state.monthFromValue === '--Select--' || this.state.yearFromValue === '--Select--' ||
        this.state.monthToValue === '--Select--' || this.state.yearToValue === '--Select--') {
            this.setState({
                showFromMonthValidation: this.state.monthFromValue === '--Select--',
                showFromYearValidation: this.state.yearFromValue === '--Select--',
                showToMonthValidation: this.state.monthToValue === '--Select--',
                showToYearValidation: this.state.yearToValue === '--Select--'
            });
            return;
        }
        debugger
        let startDate = this.state.yearFromValue + '-' +
         this.months.findIndex(month => month === this.state.monthFromValue) + '-01 00:00:00';
        let toMonthValue = this.months.findIndex(month => month === this.state.monthToValue);
        let endDate = this.state.yearToValue + '-' + toMonthValue + '-' + new Date(parseInt(this.state.yearToValue), toMonthValue, 0).getDate() + ' 00:00:00';
        let data ={
            "companyId": JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            "name": "Buyer",
            "startDate": startDate,
            "endDate": endDate,
            "exportAs": "excel"
        };

        this.setState({
            showFromMonthValidation: false,
            showFromYearValidation: false,
            showToMonthValidation: false,
            showToYearValidation: false
        });
        this.props.GetPODetails(data);
    }

    reset = () => {
        this.setState({
            monthFromValue: "--Select--",
            yearFromValue: "--Select--",
            monthToValue: "--Select--",
            yearToValue: "--Select--",
            fileType: 'Excel',
            showFromMonthValidation: false,
            showFromYearValidation: false,
            showToMonthValidation: false,
            showToYearValidation: false
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
                <PageHeading heading="[B] PO Details"
                    subheading="Microsoft Excel is required in order to open the report in Excel format. "

                />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Report Criteria</TabHeading>
                <form>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Month From<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.monthFromValue}
                                                onChange={(e)=>{this.setState({monthFromValue: e.target.value})}}
                                            >
                                                {
                                                    this.months.map((data)=>(
                                                        <option value={data}>{data}</option>
                                                    ))
                                                }
                                            </select>
                                            <div className="text-danger"></div>
                                            {
                                                this.state.showFromMonthValidation ?
                                                <div className="text-danger">Month From is required.</div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Year From<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.yearFromValue}
                                                onChange={(e)=>{this.setState({yearFromValue: e.target.value})}}
                                            >
                                                <option value="--Select--">--Select--</option>
                                                {
                                                    this.years.map((data)=>(
                                                        <option value={data}>{data}</option>
                                                    ))
                                                }
                                            </select>
                                            {
                                                this.state.showFromYearValidation ?
                                                <div className="text-danger">Year From is required.</div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Month To<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.monthToValue}
                                                onChange={(e)=>{this.setState({monthToValue: e.target.value})}}
                                            >
                                                {
                                                    this.months.map((data)=>(
                                                        <option value={data}>{data}</option>
                                                    ))
                                                }
                                            </select>
                                            {
                                                this.state.showToMonthValidation ?
                                                <div className="text-danger">Month To is required.</div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Year To<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control"
                                                value={this.state.yearToValue}
                                                onChange={(e)=>{this.setState({yearToValue: e.target.value})}}
                                            >
                                                <option value="--Select--">--Select--</option>
                                                {
                                                    this.years.map((data)=>(
                                                        <option value={data}>{data}</option>
                                                    ))
                                                }
                                            </select>
                                            {
                                                this.state.showToYearValidation ?
                                                <div className="text-danger">Year To is required.</div>
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
                                        onClick={()=>{this.getPODetails()}}
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
    GetPODetails: (values) => dispatch(GetPODetails(values)),
})

const ReportHolder = connect(mapStateToProps, mapDispatchToProps)(Report);
export default ReportHolder
