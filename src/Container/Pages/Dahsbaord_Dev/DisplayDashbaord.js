import React, {Component, Fragment } from 'react';
import TabHeading from '../../../Component/Heading/TabHeading';
import {DashbaordDetails} from '../../../validation/DashboardDetails'
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableDashbaord'
class DisplayDashbaord extends Component{
    state = {
        rendered: true,
        tables:[]
    }

    componentDidMount(){
        var _get_details = localStorage.getItem('key');
        console.log('DisplayDashbaord',Object.entries(localStorage))
    }
    
    componentDidUpdate(prevProps, prevState){
        if(Object.keys(this.props.dashboard).length !== 0 && this.state.rendered){
            let _const_object = [];
            for (var list_name in this.props.dashboard) {
                
                let count  = 0
                if (this.props.dashboard.hasOwnProperty(list_name)) {
                    let _temp_details = {};
                    _temp_details = {...this.props.dashboard[list_name]}
                    _temp_details.columns =  (_temp_details && _temp_details.hasOwnProperty('columns')) ? _temp_details.columns : [];
                    let _cons_column_name = [];
                   
                    for(let columns in _temp_details.columns){
                        let _data_formate = 'text'
                        let _temp_details_button  = DashbaordDetails(columns, this.props, _temp_details.header)
                        let _temp_details_1 = {};
                        console.log('_temp_details_button', _temp_details_button, _temp_details.header)
                        if(columns){
                            if(_temp_details_button.type=="formatter"){
                                _temp_details_1 = {
                                    name :  _temp_details.columns[columns],
                                    id : columns,
                                    key : (count==0) ? true : false,
                                    dataFormat :_temp_details_button.formatter,
                                }
                            }
                            else if(_temp_details_button.type=="link"){
                        
                                _temp_details_1 = {
                                    name :  _temp_details.columns[columns],
                                    id : columns,
                                    key : (count==0) ? true : false,
                                    formatter :_temp_details_button.formatter,
                                }
                                
                            }
                            else{
                                _temp_details_1 = {
                                    name :  _temp_details.columns[columns],
                                    id : columns,
                                    key : (count==0) ? true : false,
                                    dataFormat :_data_formate,
                                }
                            }
                        
                            if(_data_formate=="button_dashbaord"){
                                _temp_details_1.width = "171px"
                            }
                            _cons_column_name.push(_temp_details_1)
                            count += 1
                       }
                        
                    }
                    _temp_details.columns = _cons_column_name;
                    _const_object.push(_temp_details)
                }
            }
            console.log('_const_object', _const_object)
            this.setState({
                rendered : false,
                tables : _const_object
            })
        }
    }
    ConstrucyTable = (tables) => {
        console.log('ConstrucyTable', tables)
        if(tables.length){
            return <Fragment>
                {tables.map((list_Details,index)=>{
                   if(list_Details.columns && list_Details.columns.length){
                    return  <div className="dashboard_holder">
                            <TabHeading color={'bg-info text-white'}>{list_Details.header}</TabHeading> 
                            <BootstrapCustomTable 
                                table_header={list_Details.columns} 
                                table_body={(list_Details.data) ? list_Details.data : [] } 
                                products={this.getProducts} 
                                select={false} 
                                selectname={'pr_no'} 
                                responsive={true} 
                                click={true}
                                total={3}
                                table_name="issue_grn"
                                get_details = {this.get_details}
                            />
                        </div>
                   }
                   else{
                       return null
                   }
                })}
            </Fragment>
        }
        else{
            return <div></div>
        }
       
    }
    render(){
        return <div>
          {(this.state.tables) ? this.ConstrucyTable(this.state.tables) : <div>Updating Dashboard ....</div>}
        </div>
    }
}
export default DisplayDashbaord;

