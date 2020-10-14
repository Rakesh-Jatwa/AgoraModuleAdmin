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
           
              <div className="show_list">  
                <PageHeading  heading="Report" subheading="" />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Report Listing</TabHeading> 
                    <div className="row">    
                        <div className='col-12'>   
                             <table className="table table-striped table-hover table-bordered">
                             <tbody>
                                <tr>
                                    <td className="align-middle"><a href="#">Approved/Not Approved Vendor Listing</a></td>
                                </tr>
                                <tr>  
                                    <td className="align-middle"><a href="#">Detail Of PO By Company</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#">Detail Of PR By Company</a></td>
                                </tr>
                                <tr>  
                                    <td className="align-middle"><a href="#">Monthly Consumption Report</a></td>
                                </tr>
                                <tr>  
                                    <td className="align-middle"><a href="#">Monthly Summary Consumption By Cost Center</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#">Summary Of PO, PR And RFQ By Company</a></td>
                                </tr> 
                                <tr> 
                                    <td className="align-middle"><a href="#">[B] Invoice Details</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#">[B] Invoice Summary</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#/outstanding_invoice">[B] Outstanding Invoice</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#/outstanding_po">[B] Outstanding PO</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#/overdue_invoice">[B] Overdue Invoice</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#/overdue_po">[B] Overdue PO</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#/po_details">[B] PO Details</a></td> 
                                </tr>
                                <tr> 
                                    <td className="align-middle"><a href="#/po_summary">[B] PO Summary</a></td>    
                                </tr>
                            </tbody>
                             </table>   
                           
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