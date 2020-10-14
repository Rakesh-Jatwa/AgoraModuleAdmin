import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import { GetReportList } from '../../../../Actions/Eadmin'
class Report extends Component {
    constructor(props) {
        super(props);
        this.closeModel = this.closeModel.bind(this)


        this.state = {
            products: [],
            modal_body: '',
            modal: false,
            status: false,
            modal: false,
            rendered: false,
            title: '',
            message: '',
            status: false,
            show: false,
            render: false,
            selected_row: [],
            search_object: {
                "frm": "master",
                "role": ""
            },
            toReports: false
        }
    }

    componentDidMount() {
        this.props.GetReportList(this.state.search_object)
    }

    static getDerivedStateFromProps(props, state) {
        if ((!state.rendered) && (props.report_list) && (props.report_list.length > 0)) {
            return {
                rendered: true,
                products: [...props.report_list]
            }
        }
        return false
    }

    componentDidUpdate() {
        if (!this.state.render && this.props.matrix_list && this.props.matrix_list.length > 0) {
            let { matrix_list } = this.props
            let _selected_row = matrix_list.map((list_details, index) => {
                return (list_details.CHK == 1) ? list_details.RM_REPORT_NAME : null
            })
            _selected_row = _selected_row.filter(list => list != null)
            this.setState({
                selected_row: _selected_row,
                render: true
            })
        }
    }

    closeModel(details) {
        this.setState({
            show: false,
            rendered: false
        })
    }



    render() {
        if (this.state.toReports) {
            return <Redirect to='/Reports' />
        }
        const _table_header = [{ name: "Report Name", id: "RM_REPORT_NAME", key: true }]
        let { products } = this.state
        console.log('working')
        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}

            <div className="show_list">
                <PageHeading heading="[B] Pending Debit Note/Debit Advice Approval"
                    subheading="Microsoft Excel is required in order to open the report in Excel format. "

                />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Report Criteria</TabHeading>
                <form>
                    <div classNmae="row mt-3">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-3">
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-12 col-md-3 pl-0"><label>Report Type<span className="text-danger">*</span>: </label></div>
                                        <div className="col-12 col-md-6">
                                            <select className="form-control">
                                                <option>--Select--</option>
                                                <option>Excel</option>
                                                <option>PDF</option>
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
                                <div className="col-12 col-md-12 mt-2 text-right"><button type="submit" className="btn btn-sm btn-outline-success">Submit</button>
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
    GetReportList: (values) => dispatch(GetReportList(values)),
})

const ReportHolder = connect(mapStateToProps, mapDispatchToProps)(Report);
export default ReportHolder