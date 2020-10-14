import React,{Component, Fragment} from 'react';
import {ApiExtract} from '../../../../Common/GetDatas'
import Loader from '../../../../Component/Loader'
import {VendorList} from '../../../../Apis/RequesterServices'
import Select from 'react-select';

class VendorSelect extends Component{
      state = {
        selectedOption: null,
        loading:false,
        options : []
      };
      async componentDidMount(){
            let _status =  await ApiExtract(VendorList, {companyType: 'V'})
            if(_status && _status.status){
                let _updated_details = [];
            if(_status.response && _status.response.data){
                _updated_details = _status.response.data.map((lis_details, index)=>{
                    let _temp_data ={}
                    _temp_data.value = lis_details.IC_INDEX
                    _temp_data.label = lis_details.IC_COY_NAME
                    return _temp_data;
                })
                this.setState({
                    loading:false,
                    options : _updated_details,
                })
            }
        }
    }
      handleChange = selectedOption => {
        this.props.getOptions(selectedOption)
        this.setState({ selectedOption });
      };
      render() {
          
        return <Fragment> 
         {(this.state.loading) ? <Loader /> : '' }
          <Select
            placeholder={<div> -- Select -- </div>}
            isClearable={true}
            isSearchable={true}
            value={(this.state.selectedOption) ? this.state.selectedOption : ''}
            onChange={this.handleChange}
            options={(this.state.options) ? this.state.options : []}
          />
       </Fragment> 
      }
}

export default VendorSelect