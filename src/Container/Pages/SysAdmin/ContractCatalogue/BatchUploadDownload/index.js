import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import Alert from '../../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {ContractCatGetContractRefNo} from "../../../../../Apis/SysAdmin";

class DashboardListing extends Component{
    constructor(props){
        super(props);
        this.state = {
            radioButtonSelected: "upload",
            contractRefList:[],
            contractRef: ''
        }
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

    onContractRefChange = (e) =>{
        if(e.target.value){
            let getData = this.state.contractRefList.filter( ele =>(
                ele.CDM_GROUP_INDEX === parseInt(e.target.value,10)
            ));
            this.setState({
                contractRef: getData[0].CDM_GROUP_INDEX
            });
        } else {
            this.setState({
                contractRef: ''
            });
        }
    }

    render(){
        return <Fragment>
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.dashboard_listing && this.props.dashboard_listing.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

              <div className="show_list">
              <PageHeading
                    heading=""
                    subheading="For batch upload, click on the Browse button to select the file, follow by the Upload button."
                />
                <PageHeading
                    heading=""
                    subheading="For batch download, select the Contract Catalogue and click on the Download button."
                />
                <TabHeading color={'bg-info text-white'}>Batch Upload/Download </TabHeading>
                <div className="row mt-2">
                    <div className="col-12 col-md-4"><label><strong>Option :</strong> </label></div>
                        <div className="col-12 col-md-6">
                        <div className="form-check form-check-inline">
                            <input classNmae="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                              name="upload"
                              value="upload"
                              checked={this.state.radioButtonSelected === "upload"}
                              defaultChecked={this.state.radioButtonSelected === "upload"}
                              onChange={(e)=>{this.setState({radioButtonSelected: e.target.value})}}
                            />
                            <label className="form-check-label ml-2" for="inlineRadio2">Upload</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input classNmae="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                              name='download'
                              value="download"
                              checked={this.state.radioButtonSelected === "download"}
                              onChange={(e)=>{this.setState({radioButtonSelected: e.target.value})}}
                            />
                            <label className="form-check-label ml-2" for="inlineRadio2">Download</label>
                        </div>
                        </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-md-4"><label><strong>File Location :</strong><br />
                            <span>Recommended file size is 10240 KB</span> </label></div>
                        <div className="col-12 col-md-3 pl-0">
                            <div className="col-12 custom-file">
                                <input type="file" class="custom-file-input" id="customFile" />
                            </div>
                        </div>
                </div>
                <div className="row mb-4 mt-4">
                        <div className="col-12 col-md-12">
                            <div className="row">
                                <div className="col-12 col-md-4"><label><strong>Contract Ref. No.</strong> </label></div>
                                <div className="col-12 col-md-5">
                                    <select className="form-control"
                                      disabled={this.state.radioButtonSelected !== "download"}
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
                    </div>
                    <div className="row mb-4 mt-4">
                        <div className="col-12 col-md-6">
                            <div className="row">
                            <p className="pl-3">Download Batch Upload/Download template -<a href="#"> ContractCatalogueTemplate.xls [86KB]</a> </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 mt-3 pl-1">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="button" className="btn btn-outline-success btn-sm"
                                      disabled={this.state.radioButtonSelected !== "upload"}
                                    >Upload</button>
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2"
                                      disabled={!(this.state.radioButtonSelected === "download" && this.state.contractRef !== '')}
                                    >Download</button>
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
