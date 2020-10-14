import React, {Component, Fragment} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import TableButton from './TableButton'
import {TodayDate} from '../../Component/Dates'

const cellEditProp = {
  mode: 'click',
  blurToSave: true
};



class BootstrapCustomTablePr extends Component {

  renderShowsTotal(start, to, total) {
    let _details = to-start
    let _total = total/10
    
    return (
      <p style={ { color: 'blue' } }>
        {(to > 0) ? (_details+1) : 0} record(s) found. { Math.ceil(_total) } page(s) found
      </p>
    );
  }

    
    number(cell, row, enumObject, rowIndex, details) {
      if(row && row>0){
         let total = 0.00
         row = parseFloat(row).toFixed(2)
         let nStr =  row
         nStr += '';
         var x = nStr.split('.');
         var x1 = x[0];
         var x2 = x.length > 1 ? '.' + x[1] : '';
         var rgx = /(\d+)(\d{3})/;
         while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
         }
         total = x1 + x2;
         return <div className="text-right"> {total}</div>

      }
      return <div className="text-right"> 0.00</div>
    }

    

    onRowSelect = (row, isSelected, e) => {
      this.props.products(row, isSelected, e)
    }

    onSelectAll = (isSelected, currentDisplayAndSelectedData) => {
      for(let i=0;i<currentDisplayAndSelectedData.length;i++){

      }
    }
    
    


   

    cellButton(cell, row, enumObject, rowIndex, details) {
      return (
          <TableButton cell={cell} row={row} rowIndex={details} />
      )
    }

    cancleButtons(cell, row, enumObject, rowIndex, details) {
      return (
          <Fragment>
              <button type="button"  onClick={()=>(this.props.getData(enumObject, 'cancel'))} className="btn btn-danger btn-sm">CANCEL PR</button>&nbsp;&nbsp;
              <button type="button"  onClick={()=>(this.props.getData(enumObject, 'void'))}  className="btn btn-warning btn-sm">VOID PR </button>&nbsp;&nbsp; 
              <button type="button"  onClick={()=>(this.props.getData(enumObject, 'view'))} className="btn btn-info btn-sm">VIEW PR PDF</button>
          </Fragment> 
      )
    }

    IndexNumber(cell, row, enumObject, rowIndex, details) {
    
      return (<div>{details+1}</div>) 
    }
    

    divButton(cell, row, enumObject, rowIndex, details) {
     
      return (
      <div>{row}</div>
      )
    }

     Select(cell, row, enumObject, rowIndex, details) {
        if(cell=="GIFT"){
            return (
                <select data-name={details} data-details="GIFT" onChange={(e)=>{this.props.update_inputs(e, enumObject)}} className="form-control" name={`GIFT[${enumObject.PRODUCTCODE}]`} defaultValue={(enumObject.GIFT) ? enumObject.GIFT : 'N'}>
                    <option value='N'>NO</option>
                    <option value='Y'>YES</option> 
                </select>
            )
        }
        else if(cell=="Segmentation"){
            return  <select data-name={details} data-details="Segmentation" onChange={(e)=>{this.props.update_inputs(e, enumObject)}} className="form-control" name={`Segmentation[${enumObject.PRODUCTCODE}]`} defaultValue={(row) ? row : 'Critical' }>
                {(this.props.segmentation && this.props.segmentation && this.props.segmentation.map((list)=>{
                    return <option value={list.CF_FIELD_VALUE} key={list.CF_FIELD_INDEX}>{list.FIELDVALUE}</option>
                }))}

            </select>
          
        }
        else{
            return <div>{row}</div>
        }
      }

      
      OpenPopup(cell, row, enumObject, rowIndex, details) {
        if(cell=="FUNDTYPEDESC"){   
        return <Fragment>{row}<span className=""name={`FUNDTYPEDESC[${enumObject.PRODUCTCODE}]`} onClick={(e)=>this.props.handle_popup(e, enumObject)}><i data-name={details}  data-details="FUNDTYPEDESC"   className="fa fa-pencil-square-o text-right" ></i></span></Fragment>
        }

        else if(cell=="PERSONCODEDESC"){   
            return <Fragment>{row}<span  onClick={(e)=>this.props.handle_popup(e, enumObject)}><i data-details="PERSONCODEDESC" data-name={details} className="fa fa-pencil-square-o text-right" ></i></span></Fragment>
        }
        else if(cell=="PROJECTCODEDESC"){   
            return <Fragment>{row}<span onClick={(e)=>this.props.handle_popup(e, enumObject)}><i data-details="PROJECTCODEDESC" data-name={details} className="fa fa-pencil-square-o text-right" ></i></span></Fragment>
        }
        else if(cell=="costCentre"){   
            return <Fragment>{row}<span  onClick={(e)=>this.props.handle_popup(e, enumObject)}><i data-details="costCentre"  data-name={details}  className="fa fa-pencil-square-o text-right" ></i></span></Fragment>
        }
        else if(cell=="deliveryAddress"){   
            return <Fragment>{row}<span   onClick={(e)=>this.props.handle_popup(e, enumObject)}><i data-details="deliveryAddress" data-name={details} className="fa fa-pencil-square-o text-right" ></i></span></Fragment>
        }

        else{
            return <div>{row}</div>
        }
      }

      Input(cell, row, enumObject, rowIndex, details) {
            if(cell=="QUANTITY"){   
                return <input data-name={details} data-details="QUANTITY" onChange={(e)=>{this.props.update_inputs(e, enumObject)}} name={`QUANTITY[${enumObject.PRODUCTCODE}]`}  type="text" className="form-control" value={row}/>
            }
            else if(cell=='WarrantyTerms'){
                return <input data-name={details} data-details="WarrantyTerms" onChange={(e)=>{this.props.update_inputs(e, enumObject)}} name={`WarrantyTerms[${enumObject.PRODUCTCODE}]`}  type="text" className="form-control" value={(row) ? row : 0}/>
            }
            else{
                return <div>{row}</div>
            }
      }

      TextArea(cell, row, enumObject, rowIndex, details) {
            if(cell=="Remarks"){   
                return <textarea data-name={details}  data-details="Remarks" onChange={(e)=>{this.props.update_inputs(e, enumObject)}} name={`Remarks[${enumObject.PRODUCTCODE}]`}  className="form-control" value={row} />
            }
           
            else{
                return <div>{row}</div>
            }
      }

      DatePicker(cell, row, enumObject, rowIndex, details) {
        if(cell=="delivery"){   
            return <input data-name={details} data-details="delivery" onChange={(e)=>{this.props.update_inputs(e, enumObject)}} name={`delivery[${enumObject.PRODUCTCODE}]`}  type="text" className="form-control" value={TodayDate()}/>
        }
        else{
            return <div>{row}</div>
        }
     }

     sortDates (a, b, order) {
      let indices = [6, 7, 8, 9, 3, 4, 0, 1];
      if (order === 'asc') {
        let r = 0;
        indices.find(i => r = a.date.charCodeAt(i) - b.date.charCodeAt(i));
        return r;
      } else if (order === 'desc') {
        let r = 0;
        indices.find(i => r = b.date.toString().charCodeAt(i) - a.date.toString().charCodeAt(i));
        return r;
      }
    }
      

   

    
  
    render() {
     

    const options = {
        page: 1,  // which page you want to show as default
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'All', value: 10
        } ], // you can change the dropdown list for size per page
        sizePerPage: 10,  // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 3,  // the pagination bar size.
        prePage: 'Prev', // Previous page button text
        nextPage: 'Next', // Next page button text
        firstPage: 'First', // First page button text
        lastPage: 'Last', // Last page button text
        paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
        paginationPosition: 'bottom',  // default is bottom, top and both is all available
        hideSizePerPage: true,
        alwaysShowAllBtns: true ,
        withFirstAndLast: true ,
      };

      const selectRowProp = {
        mode: "checkbox",
        clickToSelect: true,
        bgColor: "rgb(238, 193, 213)" ,
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll
      };

      const selectRowPropcheck = {
        mode: "radio",
        clickToSelect: true,
        bgColor: "rgb(238, 193, 213)" ,
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll
      };

      return (
       
        <BootstrapTable data={ this.props.table_body } cellEdit={cellEditProp} selectRow={this.props.select ? (this.props.mode=="radio") ? selectRowPropcheck : selectRowProp : false}  options={ options } responsive striped pagination  hover search>
            
            {this.props.table_header.map((list)=>{
                if(list.key){
                    if(list.type=="select"){
                        return <TableHeaderColumn   
                                tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                                dataField={list.id} 
                                isKey={(list.key) ? true : false}
                                dataSort 
                                editable={ (list.type) ? true : false } 
                                thStyle={{ whiteSpace: 'normal', width: list.width }}
                                dataFormat={(list.type=="select") ? this.Select.bind(this, list.id) : this.divButton.bind(this, list.dataFormat)}>
                                {list.name}
                        </TableHeaderColumn>
                    }
                    else if(list.type=="index"){
                     return  <TableHeaderColumn   
                            tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                            dataField={list.id} 
                            isKey={(list.key) ? true : false}
                            dataSort 
                            editable={ (list.type) ? true : false } 
                            thStyle={{ whiteSpace: 'normal', width: list.width }}
                            dataFormat={(list.type=="index") ? this.IndexNumber.bind(this, list.id) : this.divButton.bind(this, list.dataFormat)}>
                            {list.name}
                        </TableHeaderColumn>
                    }
                    return <TableHeaderColumn   tdStyle={ { whiteSpace: 'normal', width: list.width } }  dataField={list.id} isKey={(list.key) ? true : false} dataSort editable={ (list.type) ? true : false } thStyle={{ whiteSpace: 'normal', width: list.width }} dataFormat={(list.dataFormat) ? this.Select.bind(this, list.dataFormat) : this.divButton.bind(this, list.dataFormat)}>{list.name}</TableHeaderColumn>
                }
                else if(list.type=="select"){
                    return <TableHeaderColumn   
                            tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                            dataField={list.id} 
                            editable={false } 
                            thStyle={{ whiteSpace: 'normal', width: list.width }}
                            dataFormat={this.Select.bind(this, list.id)}>
                            {list.name}
                    </TableHeaderColumn>
                }
                else if(list.type=="click"){
                    return <TableHeaderColumn   
                                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                                    dataField={list.id} 
                                    editable={false} 
                                    thStyle={{ whiteSpace: 'normal', width: list.width }}
                                    dataFormat={this.OpenPopup.bind(this, list.id)}>
                                    {list.name}
                            </TableHeaderColumn>
                }
                else if(list.dataFormat=="number"){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    // customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={this.number.bind(this, list.id)}>{list.name} 
                  </TableHeaderColumn>
                }
                else if(list.type=="input"){
                    return <TableHeaderColumn   
                                tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                                dataField={list.id} 
                                editable={false} 
                                thStyle={{ whiteSpace: 'normal', width: list.width }}
                                dataFormat={this.Input.bind(this, list.id)}>
                            {list.name}
                    </TableHeaderColumn>
                }
                else if(list.type=="textarea"){
                    return <TableHeaderColumn   
                                tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                                dataField={list.id} 
                                editable={false} 
                                thStyle={{ whiteSpace: 'normal', width: list.width }}
                                dataFormat={this.TextArea.bind(this, list.id)}>
                            {list.name}
                    </TableHeaderColumn>
                }
                else if(list.type=="date"){
                    return <TableHeaderColumn   
                        tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                        dataField={list.id} 

                        editable={false} 
                        thStyle={{ whiteSpace: 'normal', width: list.width }}
                        dataFormat={this.DatePicker.bind(this, list.id)}>
                        {list.name}
                    </TableHeaderColumn>
                }
                else if(list.formatter){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={(row, cell)=>list.formatter(row, cell, list.dataFormat)}>{list.name} 
                  </TableHeaderColumn>
                }
                return <TableHeaderColumn  tdStyle={ { whiteSpace: 'normal', width: list.width} }  dataField={list.id} editable={ (list.type) ? true : false }  editable={ (list.type) ? true : false }  thStyle={{ whiteSpace: 'normal', width: list.width }} dataFormat={(list.dataFormat) ? ((list.dataFormat=="button") ? this.cellButton.bind(this, list.dataFormat) : this.cancleButtons.bind(this, list.dataFormat)) : this.divButton.bind(this, list.dataFormat)}>{list.name} </TableHeaderColumn>
            })}
          
        </BootstrapTable>
       
      );
    }
  }

  export default BootstrapCustomTablePr;