import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Alert from '../../../../Component/Modal/alert'
import {GetMatrixList} from '../../../../Actions/Eadmin'
import {SaveMatrix} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
class ReportMatrix extends Component{
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
        this.props.GetMatrixList(this.state.search_object)
    }

    static getDerivedStateFromProps(props, state){
        if((!state.rendered) && (props.matrix_list) && (props.matrix_list.length > 0)){
            return {
                rendered:true,
                products : [...props.matrix_list]
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

   
    
  
   
    Save = async() =>{
        let {products} = this.state;
        if(products && products.length){
            products = products.filter((list)=>list.CHK==1)
            let _temp_details = products.map((list_details)=>{
                return {RM_REPORT_INDEX :list_details.RM_REPORT_INDEX }
            })
            this.setState({loading:true})
            let _status = await ApiExtract(SaveMatrix, {matrixData : _temp_details});
            if(_status){
                this.setState({
                    loading:false,
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
        else{
            this.setState({
                loading:false,
                show:true,
                title : '',
                status :false,
                message : 'No master item to save',
            })
        }
    }

    Reset = () =>{      
        this.setState({
            products : this.props.matrix_list,
           rendered : false
        })
    }
 


    HandleSelect = (target, values) => {
        let {products} =  JSON.parse(JSON.stringify(this.state));
        if(products.length){
           let _temp_details =  products.map((list,index)=>{
                let _temp = list;
                if(values.RM_REPORT_INDEX == list.RM_REPORT_INDEX){
                    _temp.CHK = (target.checked) ? 1 : '';
                }
                return _temp;
           })
           this.setState({
                products:_temp_details
           })
        }      
    }


    SelectAll = (target) => {
        let {products} = this.state
        if(products.length){
           let _temp_details =  products.map((list,index)=>{
                let _temp = list;
                _temp.CHK = (target.checked) ? 1 : '';
                return _temp;
           })
           this.setState({
                products: _temp_details
           })
        }
    }

    
    render(){
    
        const _table_header = [{name : "Report Name", id:"RM_REPORT_NAME", key:true}]
       
        let {matrix_list} = this.props
        let {products} = this.state
        console.log('working')
        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
           
              <div className="show_list">  
                <PageHeading  heading="Report Matrix" subheading="" />
                <TabHeading color={'bg-info text-white margin-bottom-none'}>Report Matrix</TabHeading> 
                    <div className="row">    
                        <div className='col-12'>   
                             <table className="table table-striped table-hover table-bordered">
                                 <thead className="thead-primary">
                                     <th style={{width:'40px', textAlign:'center'}}><input type="checkbox"  onClick={(e)=>this.SelectAll(e.target)}/></th>
                                     <th>Report Name</th>
                                 </thead>
                                 <tbody>
                                    {products.map((list)=>{
                                        return <tr className={(list.CHK==1) ? 'highlight-row-report' : ''}>
                                            <td style={{width:'40px', textAlign:'center'}}><input type="checkbox" value={list.RM_REPORT_INDEX} checked={(list.CHK==1) ? true : false } onClick={(e)=>this.HandleSelect(e.target, list )}/></td>
                                            <td>{list.RM_REPORT_NAME}</td>
                                        </tr>
                                    })}
                                 </tbody>
                             </table>   
                             <Alert 
                                message={this.state.message}
                                status={this.state.status} 
                                show={this.state.show} 
                                confirm={this.closeModel}
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-lg-auto col-md">
                            <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.Save()}>Save</button>
                            <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={()=>this.Reset()}>Clear</button> 
                        </div>
                    </div>
                </div>
     </Fragment>
    }
}


const mapStateToProps = state => ({
    matrix_list : state.matrix_list.responseList,
    loading : state.matrix_list.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetMatrixList  : (values) => dispatch(GetMatrixList(values)),
})

const ReportMatrixHolder = connect(mapStateToProps, mapDispatchToProps)(ReportMatrix);
export default ReportMatrixHolder