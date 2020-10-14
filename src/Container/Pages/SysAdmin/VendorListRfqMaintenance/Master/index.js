import React, { Component, Fragment } from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import { connect } from 'react-redux'
import { Button, Modal } from "react-bootstrap";
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import { GetDashboardList, GetFixedRoles } from '../../../../../Actions/Eadmin'
import { DashboardList } from '../../../../../Apis/Eadmin'
import { ApiExtract } from '../../../../../Common/GetDatas'
import {
    VendorListRfqMaintSearch,
    AddVendorListRfqMaint,
    AddModifyVendorListRfqMaint,  
    DeleteVendorListRfqMaint
} from '../../../../../Apis/SysAdmin';

var ListData = {
    "status": "SUCCESS",
    "errMessage": "",
    "responseList": [ 
        {
            "listName": "List027",
            "vendors": [
                {
                    "companyId": "339201A002",
                    "listIndex": 7,
                    "listName": "List027",
                    "RCDLD_V_COY_ID": "339201A002",
                    "companyName": "9 Lives"
                },
                {
                    "companyId": "339201A449",
                    "listIndex": 7,
                    "listName": "List027",
                    "RCDLD_V_COY_ID": "339201A449",
                    "companyName": "Accelte"
                },
                {
                    "companyId": "339201A495",
                    "listIndex": 7,
                    "listName": "List027",
                    "RCDLD_V_COY_ID": "339201A495",
                    "companyName": "ABSOLUT"
                }
            ]
        },
        {
            "listName": "List028",
            "vendors": [
                {
                    "companyId": "339201A398",
                    "listIndex": 8,
                    "listName": "List028",
                    "RCDLD_V_COY_ID": "339201A398",
                    "companyName": "Accion "
                },
                {
                    "companyId": "339201C427",
                    "listIndex": 8,
                    "listName": "List028",
                    "RCDLD_V_COY_ID": "339201C427",
                    "companyName": "CREATIV"
                }
            ]
        },
        {
            "listName": "List032",
            "vendors": [
                {
                    "companyId": null,
                    "listIndex": 13,
                    "listName": "List032",
                    "RCDLD_V_COY_ID": null,
                    "companyName": null
                }
            ]
        },
        {
            "listName": "List033",
            "vendors": [
                {
                    "companyId": null,
                    "listIndex": 14,
                    "listName": "List033",
                    "RCDLD_V_COY_ID": "339201C146",
                    "companyName": null
                },
                {
                    "companyId": "339201C179",
                    "listIndex": 14,
                    "listName": "List033",
                    "RCDLD_V_COY_ID": "339201C179",
                    "companyName": "COEUS S"
                }
            ]
        }
    ]
}


class DashboardListing extends Component {
    constructor(props) {
        super(props);
        this.closeModel = this.closeModel.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.searchList = this.searchList.bind(this)
        this.getInputValue = this.getInputValue.bind(this)
        this.deleteList = this.deleteList.bind(this)
        this.Reset = this.Reset.bind(this)
        this.addLine = this.addLine.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.deleteModelItem = this.deleteModelItem.bind(this)
        this.selectListItem = this.selectListItem.bind(this)
        this.modifyListdata = this.modifyListdata.bind(this)

        this.state = {
            products: [],
            listData:[],
            selectedList:[],
            addNewList:[],
            addTOlistID:[],
            modalSelectedItems:[],
            allChecked:false,
            modifyListName:"",
            action:"",
            companyId :JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
            userId : JSON.parse(localStorage.getItem("profile"))["UM_USER_ID"],
            list_search_query:"",
            modal_body: '',
            modal: false,
            status: false,
            modal: false,
            rendered: false,
            title: '',
            message: '',
            show_roles: false,
            status: false,
            show: false,
            search_object: {
                "frm": "listing",
                "role": "",
                "panelName": ""
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.dashboard_listing && props.dashboard_listing && props.dashboard_listing.responseList) {
            return {
                products: props.dashboard_listing.responseList,
                rendered: true,
            }
        }
    }

    componentDidMount() {
        this.props.GetDashboardList(this.state.search_object)
        this.props.GetFixedRoles()
    }

    searchList = async () =>{
        let data = {
            "companyId": this.state.companyId,
            "userId": this.state.userId,
            "listName": this.state.list_search_query
        }

        let response = await ApiExtract(VendorListRfqMaintSearch, data);
        if(this.state.list_search_query !== ""){
            let search = this.state.list_search_query
            response = ListData.responseList.filter(function(ele){ return ele.listName === search })
        }else{
            response = ListData.responseList
        }
        // function vendorsData(data){
        //     var names=[];

        //     for (var i = 0; i < data.length; i++) {
        //         names.push(data[i].companyName)
        //     }

        //     return  names.join("\n")
            
        // }

        // let list = []
        // for( let i=0; i<ListData.responseList.length; i++) {
        //     list[i] = {
        //           "listName": ListData.responseList[i].listName,
        //           "vendors": vendorsData(ListData.responseList[i].vendors),
                 
        //         }
        //     }

        this.setState({
            listData : response
        })
    }
    getInputValue(e){
        this.setState({
            list_search_query:e.target.value
        })
    }

    selectListItem (e) { 
        let list = this.state.selectedList
        if(e.target.checked){
            list.push({"id" : e.target.value})
        }
        else{
            list = list.filter(function(ele){ return ele.id !== e.target.value; })
        }
        this.setState({
            selectedList : list
        })


    }

    
    deleteList = async () =>{
        let data = this.state.selectedList
        let list_data = this.state.listData
        var items = []
        
        if (!data.length ){
            alert("Select atleat one row to Delete.")
        }else if (data.length && data){

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < list_data.length; j++) {
                    if (list_data[j].listName === data[i].id) {
                        items.push(list_data[j].vendors[0].listIndex)
                    }

                }
            }

            data = {
                "listIndexes": items
            }

            let response = await ApiExtract(DeleteVendorListRfqMaint, data);
            console.log("Delete List",response)
        }

    }


    Reset(){
        this.setState({
            list_search_query:"",
            products: [],
            listData:[],
            selectedList:[],
            addNewList:[],
            addTOlistID:[],
            modalSelectedItems:[],
            allChecked:false,
            modifyListName:"",
            action:"",
        });
    }

    makeId(length) {
       var result           = '';
       var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
   }


    closeModel() {
        this.setState({
            showAddModal: false,
            modalSelectedItems:[],
            addTOlistID:[],
            modifyListName:"",
            action:"",
            addTOlistID:[],
            allChecked:false,
        })
    }

    Search = async () => {
        let { search_object } = this.state;
        if (search_object) {
            this.props.GetDashboardList(this.state.search_object)
        }

    }

    handleSelect = (e) => {
        let _details = e.target.value;
        if (_details) {
            let _temp_details = this.state.search_object
            _temp_details.role = _details
        }
    }

    handleInput = (e) => {
        let _details = e.target.value;
        if (_details) {
            let _temp_details = this.state.search_object
            _temp_details.panelName = _details
        }
    }

    get_details = (row) => {
        this.props.change_tab('Matrix', row.DM_FIXED_ROLE_ID)
    }

    add_vendor_list = (e) => {
        if (e === "add"){
            this.setState({
                showAddModal: true,
                action:"add",
                addTOlistID:[{"id":this.makeId(8),"value":""},{"id":this.makeId(8),"value":""},{"id":this.makeId(8),"value":""}]
            });
        } else if (e === "modify") {
            let list = this.state.selectedList
            if (list.length > 1 || !list.length ){
                alert("Select only one row to modify.")
            }else if (list.length && list){
                var data = this.state.listData.filter(function(ele){ return ele.listName === list[0].id; })                
                let lst = []
                for (var i = 0; i < data[0].vendors.length; i++) {
                    lst.push({"id":data[0].vendors[i].companyId,"value":data[0].vendors[i].companyName,listIndex:data[0].vendors[i].listIndex})
                }
                this.setState({
                    showAddModal : true,
                    addTOlistID : lst,
                    modifyListName : data[0].listName,
                    action:"modify"
                });
            }
        }
    };
    
    modelInputsValue = (e) =>{
        let list = this.state.addTOlistID
        // var data = list.filter(function(ele){ return ele.id === e.target.id; })                
        for (var i = 0; i < list.length; i++) {
            if(list[i].id === e.target.id){
                list[i].value = e.target.value
            }
        }
        this.setState({
            addTOlistID : list 
        });

    }


    addLine () {
        let list = this.state.addTOlistID
        list.push({"id":this.makeId(8)})
        this.setState({
            addTOlistID:list 
        });
    }

    selectItem = (e) =>{
        let list = this.state.modalSelectedItems
        if(e.target.checked){
            list.push({"id":e.target.value})
        }
        else{
            list = list.filter(function(ele){ return ele.id !== e.target.value; })
        }
        this.setState({
            modalSelectedItems:list 
        });

    }

    modifyListdata = async (e) =>{
        e.preventDefault();
        let data;
        let vendorIds = []

        for (var i = 0; i < this.state.addTOlistID.length; i++) {
            if(this.state.addTOlistID[i].value !== ""){
                vendorIds.push(this.state.addTOlistID[i].id)
            }
        }
        if (this.state.action === "modify") {
            let listName = this.state.selectedList[0].id
            let selectedList = this.state.listData.filter(function(ele){ return ele.listName === listName ; })
            data = {
                "action": "update",
                "listIndex": selectedList[0].vendors[0].listIndex,
                "companyId": this.state.companyId,
                "vendorCompanyId": "",
                "userId": this.state.userId,
                "listName": this.state.modifyListName,
                "vendorIds": vendorIds
            }
            await ApiExtract(AddModifyVendorListRfqMaint, data);
        }else if(this.state.action === "add"){
            data = {
                "action": "add",
                "companyId": this.state.companyId,
                "vendorCompanyId": "",
                "userId": this.state.userId,
                "listName": this.state.modifyListName,
                "vendorIds": vendorIds
            }
            let response = await ApiExtract(AddVendorListRfqMaint, data);
        }
    }

    deleteModelItem(){
        let list = this.state.modalSelectedItems
        if (list.length && list) {
            let item = this.state.addTOlistID
            item = item.filter(function(ele){
                var i=0
                let dti = ele.id !== list[i].id
                i = i+1
                return dti  
            })

            this.setState({
                addTOlistID:item,
                modalSelectedItems:[]
            });

        }
    }


    render() {
        const {modalSelectedItems, modifyListName} = this.state

        const _table_header = [
            {
                name: "Catalogue", id: "DM_FIXED_ROLE_ID", formatter: (cellContent, row) => {
                    return (
                        <button type="button" className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row)} >{row.DM_FIXED_ROLE_ID}</button>
                    )
                },
            },
            { name: "Purchaser", id: "DM_PANEL_NAME", key: true }]


        const _header =  [
            {name : "List Name", id:"listName", key:true, width:'45%'},
            {name : "Vendor", id:"vendors", key:false, width:'45%'},
        ];

        return <Fragment>
            {(this.props.loading) ? <Loader /> : ''}
            {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : ''}
            {(this.state.loading) ? <Loader /> : ''}

            <div className="show_list">
                <PageHeading
                    heading=""
                    subheading="Fill in the search criteria and click Search button to list the relevant vendor list. Click the Add button to add new vendor list."
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading>
                <div>
                    <div classNmae="row">
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <div className="col-12 col-md-6">
                                    <div className="row mt-2">
                                        <div className="col-12 col-md-4"><label>List Name : </label></div>
                                        <div className="col-12 col-md-6">
                                            <input name="" type="text" className="form-control" placeholder="" value={this.state.list_search_query} onChange={this.getInputValue} />
                                            <div className="text-danger"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-12 mt-3 pl-1">
                                    <div className="row mb-3">
                                        <div className="col-12 text-right">
                                            <button type="button" className="btn btn-outline-success btn-sm" onClick={this.searchList}>Search</button>
                                            <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={this.Reset}>Clear</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    {
                        // this.state.listData.length  && this.state.listData?
                        //                 <BootstrapCustomTable
                        //                             table_header={_header}
                        //                             table_body={this.state.listData}
                        //                             select={true}
                        //                             selectname={'pr_no'}
                        //                             responsive={true}
                        //                             click={false}
                        //                             table_name="issue_grn"
                        //                             pagination={true}
                        //                             products={this.onRowSelectHandler}
                        //                         />
                        //                         :
                        //                         null
                    }

                    {

                        this.state.listData.length  && this.state.listData ?
                        <div className="table-responsive check_table">
                            <table className="table table-striped table-hover table-bordered">
                                <thead className="thead-primary">
                                    <th ><input type="checkbox" checked={this.state.allChecked} onChange={(e)=> 
                                        this.setState({
                                            allChecked:e.target.checked
                                        })
                                    } /></th>
                                    <th>List Name</th>
                                    <th>Vendor</th>
                                </thead>
                                <tbody>
                                {
                                this.state.listData.map((value, index) => (
                                    <tr key={index}>
                                        <td className="align-middle"><input type="checkbox" onClick={this.selectListItem} id={value.listName} value={value.listName}  /></td>
                                        <td className="align-middle">  {value.listName}   </td>
                                        <td className="align-middle">
                                            {    
                                                value.vendors.map((i, j) => (
                                                    <span>
                                                        {i.companyName}<br />
                                                    </span> 
                                                ))
                                            }
                                       
                                        </td>

                                    </tr>
                                    ))
                                }
                                    <tr>
                                        <td className="align-middle pl-2" colSpan="3"><p className="pl-2">{this.state.listData.length} record(s) found. <span>1 page(s) found.</span></p></td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    :
                    null
                }
                    </div>

                    <div className="col-12 col-md-6 mt-3 pl-1">
                        <div className="row mb-3">
                            <div className="col-12">
                                <button type="button" className="btn btn-outline-success btn-sm" onClick={() => this.add_vendor_list("add")}>Add</button>
                                <button type="button" className="btn btn-outline-success btn-sm ml-2" onClick={() => this.add_vendor_list("modify")}>Modify</button>
                                <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={this.deleteList}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-vendor-list">
                    <Modal
                        className="ctmMdl ctmMdl_cotract"
                        show={this.state.showAddModal}
                        onHide={() => this.closeModel()}
                        centered
                    >
                        <Modal.Header>
                            <h5>Add Vendor List</h5>

                            <button type="button" className="close" data-dismiss="modal" onClick={this.closeModel} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </Modal.Header>
                        <Modal.Header>
                            <div>
                                <p>To add or modify vendor list, type the company name to chase an option and click Save button. Click add Line button for new line.</p>
                            </div>
                        </Modal.Header>
                        <form onSubmit={this.modifyListdata}>

                        <Modal.Body>
                            <TabHeading color={'bg-info text-white'}>Add Vendor List</TabHeading>
                                <div classNmae="row">
                                    <div className="col-12 col-sm-12">
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-12">
                                                <div className="row">
                                                    <div className="col-12 col-md-4 pl-0"><label>Last Name <span className="text-danger">*</span>: </label></div>
                                                    <div className="col-12 col-md-6">
                                                        <input type="text" name="" className="form-control" name="modelListTitle" id="modelListTitle" ref="modelListTitle" onChange={(e)=>this.setState({
                                                            modifyListName:e.target.value 
                                                        })} value={modifyListName} placeholder="" />
                                                        <div className="text-danger"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="table-responsive check_table">
                                        <table className="table table-striped table-hover table-bordered">
                                            <thead className="thead-primary">
                                                <th ><input type="checkbox" /></th>
                                                <th>Vendor</th>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.addTOlistID.map((value, index) => (
                                                <tr key={index}>
                                                    <td className="align-middle"><input type="checkbox" value={value.id} onClick={this.selectItem}  id={value.id}  /></td>
                                                    <td className="align-middle">
                                                        <div className="col-12 col-md-6">
                                                            <input type="text" name="" id={value.id} name={value.id} value={value.value} onChange={this.modelInputsValue} className="form-control" placeholder="" />
                                                            <div className="text-danger"></div>
                                                        </div>
                                                    </td>

                                                </tr>
                                                ))
                                            }

                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                           
                            <div className="col-12 col-md-6 mt-3 pl-1">
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-outline-success btn-sm" >Save</button>
                                        <button type="button" className="btn btn-outline-success btn-sm ml-2" onClick={this.addLine}>Add Line</button>
                                        <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={this.deleteModelItem}>Delete</button>
                                        <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={this.closeModel}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                            </form>

                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>


        </Fragment>
    }
}


const mapStateToProps = state => ({
    dashboard_listing: state.dashboard_listing.responseList_2,
    loading: state.dashboard_listing.loading,
    fixed_roles: state.fixed_roles.responseList
})

const mapDispatchToProps = dispatch => ({
    GetDashboardList: (values) => dispatch(GetDashboardList(values)),
    GetFixedRoles: (values) => dispatch(GetFixedRoles(values)),
})

const DashboardListingHolder = connect(mapStateToProps, mapDispatchToProps)(DashboardListing);
export default DashboardListingHolder