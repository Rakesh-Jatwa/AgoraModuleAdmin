import React, {Component, Fragment} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import SelectModel from './SelectModel'
import TableButton from './TableButton'
import {TodayDate, ddmmyy} from '../../Component/Dates'

const cellEditProp = {
  mode: 'click',
  blurToSave: true
};



class BootstrapCustomTable extends Component {

  renderShowsTotal(start, to, total) {
    let _details = to-start
    let _total = total/10
    return (
      <p style={ { color: 'blue' } }>
         {(to > 0) ? (_details+1) : 0} record(s) found. { Math.ceil(_total) } page(s) found
      </p>
    );
  }

    

    

    onRowSelect = (row, isSelected, e) => {
      this.props.products(row, isSelected, e)
    }

    onSelectAll = (isSelected, currentDisplayAndSelectedData) => {
      for(let i=0;i<currentDisplayAndSelectedData.length;i++){
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

    createCustomModalHeader(onClose, onSave) {
      const headerStyle = {
        fontWeight: 'bold',
        fontSize: 'large',
        textAlign: 'center',
        backgroundColor: '#eeeeee'
      };
      return (
        <div className='modal-header' style={ headerStyle }>
          <h3>That is my custom header</h3>
          <button className='btn btn-info' onClick={ onClose }>Close it!</button>
        </div>
      );
    }

    cellButton(cell, row, enumObject, rowIndex, details) {
      return (
          <TableButton cell={cell} enumObject={enumObject} row={(row) ? row : this.props.button_text} rowIndex={rowIndex} click={this.props.click} table_name={this.props.table_name} {...this.props}/>
      )
    }


    input(cell, row, enumObject, rowIndex, details) {
      return (
         <input onChange={(this.props.change) ? this.props.getInputs :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  type="number" className="form-control" defaultValue={row}/>
        
      )
    }

    textarea(cell, row, enumObject, rowIndex, details) {
      return (
        <input onChange={(this.props.change) ? this.props.getInputs :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  type="text" className="form-control" defaultValue={row}/>
      )
    }

    outstd(cell, row, enumObject, rowIndex, details) {
      return parseFloat(enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY - enumObject.POD_CANCELLED_QTY).toFixed(2)
    }

    approval(cell, row, enumObject, rowIndex, details) {
        return enumObject.FA_AGA_TYPE === 'FO' ? ((this.props.app_details ) ? this.props.app_details.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE) + (val.POM_SHIP_AMT), 0) < enumObject.AO_LIMIT ? "N/A" : "Approval" :  "N/A") : "Approval"
    }

    

    date(cell, row, enumObject, rowIndex, details) {
      if(row){
        return ddmmyy(row)
      }
      return <div></div>
    }


    price_formatter(cell, row, enumObject, rowIndex, details) {
      if(row){
          return parseFloat(row).toFixed(2)
      }
      return 0.00
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

    

    divButton(cell, row, enumObject, rowIndex, details) {
      return (
      <div>{row}</div>
      )
    }

 
    shipinput(cell, row, enumObject, rowIndex, details) {
      return (
         <input onChange={(this.props.change) ? this.props.getInputs :()=>{} }  defaultValue={parseFloat(enumObject.POD_ORDERED_QTY).toFixed(2)} data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  type="number" value={row}/>
      )
    }

    remarkstext(cell, row, enumObject, rowIndex, details) {
  
      return (
         <textarea onChange={(this.props.change) ? this.props.getInputs :()=>{} }  defaultValue={enumObject.DOD_REMARKS} data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  value={row}/>
      )
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

    
    IndexNumber(cell, row, enumObject, rowIndex, details) {
    
      return (<div>{details+1}</div>) 
    }
   

    
  
    render() {
     
    const createSelectModel = (onUpdate, props) => {
      return <SelectModel onUpdate={ onUpdate } {...props}/>
    };

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
        insertModalHeader: this.createCustomModalHeader
      };

      const selectRowProp = {
        mode: (this.props.mode) ? this.props.mode : 'checkbox',
        clickToSelect: true,
        bgColor: "rgb(238, 193, 213)" ,
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll,
        
        selected : (this.props.hasOwnProperty('selected_row') && this.props.selected_row) ? ['Monthly Consumption Report'] : []
      };


      return (
        <Fragment>
        <BootstrapTable  data={ (this.props.table_body) ? this.props.table_body : [] } cellEdit={cellEditProp} selectRow={this.props.select ? selectRowProp: false}  options={ options } striped   hover >
            {this.props.table_header && this.props.table_header.map((list)=>{
                if(list.key){
                    if(list.dataFormat=="button"){
                      return <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.cellButton.bind(this, list.id)}>{list.name}

                        </TableHeaderColumn>
                    }
                    else if(list.dataFormat=="input"){
                      return   <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.input.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }
                    else if(list.dataFormat=="textarea"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.textarea.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }
                    else if(list.formate){
                     return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={list.formatter(this)}>{list.name} 
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
                    return <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.divButton.bind(this, list.dataFormat)}>{list.name} 
                          </TableHeaderColumn>
                }

                if(list.dataFormat=="button"){
                  return <TableHeaderColumn  
                    tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                    dataField={list.id} 
                    editable={ (list.type) ? true : false }  
                    dataSort
                    customEditor={{ getElement: createSelectModel }} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={this.cellButton.bind(this, list.id)}>{list.name} 
                  </TableHeaderColumn>
                }
                else if(list.dataFormat=="input"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.input.bind(this, list.id)}>{list.name} 
                </TableHeaderColumn>
                }
                else if(list.dataFormat=="Outstd"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.outstd.bind(this, list.id)}>{list.name} 
                </TableHeaderColumn>
                }
                
                else if(list.dataFormat=="number"){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={this.number.bind(this, list.id)}>{list.name} 
                  </TableHeaderColumn>
                }

                else if(list.dataFormat=="shipinput"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.shipinput.bind(this, list.id)}>{list.name} 
                </TableHeaderColumn>
                }

                
                else if(list.dataFormat=="date"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.date.bind(this, list.id)}>{list.name} 
                   
                </TableHeaderColumn>
                }
                else if(list.dataFormat=="textarea"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.textarea.bind(this, list.id)}>{list.name} 
                </TableHeaderColumn>
                }
                else if(list.formatter){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={list.formatter.bind(this, list.dataFormat)}>{list.name} 
                  </TableHeaderColumn>
                }
                else if(list.dataFormat=="remarkstext"){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={this.remarkstext.bind(this, list.id)}>{list.name} 
                  </TableHeaderColumn>
                }

                else if(list.dataFormat=="approval"){
                    return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } 
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.approval.bind(this, list.id)}>{list.name} 
                    </TableHeaderColumn>
                  }

                  else if(list.dataFormat=="price"){
                    return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } 
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.approval.price_formatter(this, list.id)}>{list.name} 
                    </TableHeaderColumn>
                  }

                

                return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.divButton.bind(this, list.dataFormat)}>{list.name}
               </TableHeaderColumn>
            })}
        
        </BootstrapTable>
        
        </Fragment>
       
      );
    }
  }

  export default BootstrapCustomTable;