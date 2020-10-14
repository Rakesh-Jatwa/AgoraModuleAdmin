import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import {GetReportList} from '../../../../Actions/Eadmin'
class Report extends Component{
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this)


        this.state = {
            products:[],
            modal_body : '',
            modal : false,
            status : false,
            modal : false,
            rendered: false,
            title:'',
            message:'',
            status:false,
            show:false,
            render:false,
            selected_row : [],
            search_object : {
                "frm":"master",
                "role":""
            }
        }
    }

    componentDidMount(){
        this.props.GetReportList(this.state.search_object)
    }

    static getDerivedStateFromProps(props, state){
        if((!state.rendered) && (props.report_list) && (props.report_list.length > 0)){
            return {
                rendered:true,
                products : [...props.report_list]
            }
        }
        return false
    }

    componentDidUpdate(){
        if(!this.state.render && this.props.matrix_list && this.props.matrix_list.length>0){
            let {matrix_list} = this.props
            let _selected_row = matrix_list.map((list_details, index)=>{
                return (list_details.CHK==1) ? list_details.RM_REPORT_NAME : null
            })
            _selected_row = _selected_row.filter(list=>list!=null)
            this.setState({
                selected_row : _selected_row,
                render : true
            })
        }
    }

    closeModel (details){
        this.setState({
            show : false,
            rendered : false
        })
    }



    render(){

        const _table_header = [{name : "Report Name", id:"RM_REPORT_NAME", key:true}]
        let {products} = this.state
        console.log('working')
        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

              <div className="show_list vendor-master-detail">
                <PageHeading  heading="" subheading="" />
                <div>
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Vendor Detail</TabHeading>
                <div classNmae="row">
                            <div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Company Name :</label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>AFAMOSA</span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Company Logo : </label></div>
                                                <div className="col-12 col-md-6">
                                                    <div>
                                                    <img src="https://picsum.photos/id/237/200/300" width="40" height="40" />
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Company Logo Name : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span></span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Business Registration No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>336822-K</span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div classNmae="row">
                            <div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Address :</label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span> PJ </span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> City : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <label><span>ALOR GAJAH</span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> State : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <label><span>Melaka</span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>  Post Code : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>78000</span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>  Country : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span> Malaysia </span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Website : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span><a href="strateqgroup.com" target="_blank">strateqgroup.com </a></span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Email : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span><a href="mailto:safiyahs@strateqgroup.com"> safiyahs@strateqgroup.com </a></span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Phone : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>2344234</span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Fax : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>2344234</span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Company Registration</TabHeading>
                        <div classNmae="row">
                            <div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Year of Registration :</label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>  </span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>  Paid-up Capital : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <label><span></span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">

                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Company Ownership : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <label><span></span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>   Others, Please specify : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span></span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">

                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>  Business Nature : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>  </span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Commodity Type  : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span></span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">

                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>SST Registration No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>2344234</span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Organization Code : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span></span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">

                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>  Bank Name : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>CIMB BANK BHD</span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Bank Account No. : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span> 0000 </span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="row mt-2">

                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>  Bank Branch Code : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>ALOR GAJAH</span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Bank Code : </label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>  CIMB BANK BHD  </span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TabHeading color={'bg-info text-white margin-bottom-none'}>Previous Year Sales Area</TabHeading>
                        <div classNmae="row">
                            <div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>Local DomesticSales (%) :</label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span>  </span></label>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label> Export Sales (%) : </label></div>
                                                <div className="col-12 col-md-6">
                                                     <label><span></span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <TabHeading color={'bg-info text-white margin-bottom-none'}>Sales TurnOver</TabHeading>
                        <div classNmae="row">
                            <div>
                                <div className="row">
                                    <div className="col-12 col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover table-bordered">
                                            <thead className="thead-primary">
                                                <th>Year</th>
                                                <th>Currency</th>
                                                <th>Amount</th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle">  </td>
                                                    <td className="align-middle"></td>
                                                    <td className="align-middle"></td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle" colSpan="3">  0 record(s) found. 1 page(s) found.</td>

                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <TabHeading color={'bg-info text-white margin-bottom-none'}>Software Application </TabHeading>
                        <div classNmae="row">
                            <div>
                                <div className="row">
                                    <div className="col-12 col-md-12">

                                    </div>
                                </div>
                                </div>
                            </div>
                            <TabHeading color={'bg-info text-white margin-bottom-none'}>Quality Standard Attachments </TabHeading>
                        <div classNmae="row">
                            <div>
                            <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-4"><label>File(s) Attached :</label></div>
                                                <div className="col-12 col-md-6">
                                                <label><span> No Files Attached </span></label>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div classNmae="row">
                            <div>
                            <div className="row">
                                    <div className="col-12 col-md-12">
                                        <div className="row mt-2">
                                                <div className="col-12 col-md-12">
                                                <button type="button" className="btn btn-outline-danger btn-sm"
                                                  onClick={()=>{this.props.history.push('./vendor_master_maint.');}}
                                                >Back</button>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                    </div>
                </div>
     </Fragment>
    }
}


const mapStateToProps = state => ({
    report_list : state.report_list.responseList,
    loading : state.report_list.loading,
})

const mapDispatchToProps = dispatch => ({
    GetReportList  : (values) => dispatch(GetReportList(values)),
})

const ReportHolder = connect(mapStateToProps, mapDispatchToProps)(Report);
export default ReportHolder
