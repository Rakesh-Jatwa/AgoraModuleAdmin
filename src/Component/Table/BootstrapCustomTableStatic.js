import React, {Component, Fragment} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import SelectModel from './SelectModel'
import TableButton from './TableButton'
import {number_only,decimal_number, ddmmyy, DateMinusTimeNoIni} from '../../Component/Dates'


let prevAppType = '';
const cellEditProp = {
  mode: 'click',
  blurToSave: true
};



class BootstrapCustomTable extends Component {

  renderShowsTotal(start, to, total) {
    let _details = total
    let _total = total/10
    return (
      <p style={ { color: 'blue' } }>
          {(to > 0) ? (_details) : 0} record(s) found. { Math.ceil(_total) } page(s) found
      </p>
    );
  }





    onRowSelect = (row, isSelected, e) => {
      this.props.products(row, isSelected, e)
    }

    onSelectAll = (isSelected, currentDisplayAndSelectedData, e) => {
      for(let i=0; i<currentDisplayAndSelectedData.length; i++){
        this.props.products(currentDisplayAndSelectedData[i], isSelected, e)
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
         <input onKeyPress={(e) => number_only(e)}  onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+(details)+']'}  type="number" className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell]) ? this.props.input_values[details][cell] : row}/>
      )
    }

    cn_input(cell, row, enumObject, rowIndex, details) {
      return (
         <input onKeyPress={(e) => number_only(e)}  onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+(details)+']'}  type="number" className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell]!=null) ? this.props.input_values[details][cell] : row}/>
      )
    }

    cn_textarea(cell, row, enumObject, rowIndex, details) {
      return (
         <textarea onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+(details)+']'}  className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell]!=null) ? this.props.input_values[details][cell] : row} />
      )
    }



    doinput(cell, row, enumObject, rowIndex, details) {
      return (
         <input  onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+(details)+']'}  type="input" className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details].hasOwnProperty(cell)) ? this.props.input_values[details][cell] : ''}/>
      )
    }




    textarea(cell, row, enumObject, rowIndex, details) {
      return (
        <input  onChange={(this.props.change) ?  (eve)=>this.props.getInputs(eve,cell,details) :()=>{}}  data-name={details} data-details={cell}  name={cell+'['+(details+1)+']'}  type="text" className="form-control" defaultValue={row}/>
      )
    }

    outstd(cell, row, enumObject, rowIndex, details) {
      return parseFloat(enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY - enumObject.POD_CANCELLED_QTY).toFixed(2)
    }

    approval(cell, row, enumObject, rowIndex, details) {

        let elementData = enumObject;
        let _sub_details = '';
        let _send_object = ''
        let aoLimit = elementData.AO_LIMIT ? elementData.AO_LIMIT : 0;
        _sub_details= 'Approval';
        if (elementData.FA_AGA_TYPE == 'FO' && (this.props.invoiceAmount < aoLimit)) {
            _sub_details= 'N/A';
        }

        if (_sub_details== 'N/A' && prevAppType == 'Approval') {
            prevAppType = 'Already Set'
            _sub_details= 'Approval';

        }

        if (prevAppType !== 'Already Set') {
            prevAppType =_sub_details;
        }

        return _sub_details
    }



  date(cell, row, enumObject, rowIndex, details) {
    if(row){
        return<div>{ddmmyy(row)} </div>
    }
    return <div></div>
  }


  datetime(cell, row, enumObject, rowIndex, details) {
    if(row){
        return<div>{DateMinusTimeNoIni(row)} </div>
    }
    return <div></div>
  }



  price_formatter(cell, row, enumObject, rowIndex, details) {
    if(row){
        return <div className="text-right">{parseFloat(row).toFixed(2)}</div>
    }
    return <div className="text-right">0.00</div>
  }

  pricena(cell, row, enumObject, rowIndex, details) {
    if(row && parseFloat(row)){
        return <div className="text-right">{(row).toFixed(2)}</div>
    }
    return <div className="text-right">N/A</div>
  }




  price_formatter_2(cell, row, enumObject, rowIndex, details) {
    if(row){
        return <div className="text-right">{parseFloat(row).toFixed(2)}</div>
    }
    return <div className="text-right">0.00</div>
  }

  validatedata(cell, row, enumObject, rowIndex, details) {
    console.log('validatedata', row, cell)
    if(row && row!=null && row!='' && row!=' ' && row!='null'){
        return row
    }
    return 'N/A'
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

  number4(cell, row, enumObject, rowIndex, details) {
    if(row && row>0){
       let total = 0.00
       row = parseFloat(row).toFixed(4)
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


  numberna(cell, row, enumObject, rowIndex, details) {
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
    return <div className="text-right"> N/A</div>
  }




  async downloads(cell, row, enumObject, rowIndex, details) {
    if(row){
        let _details = await row.map((list, index) => {
            return <p><u><span >{list.strFile} &nbsp;&nbsp;</span></u> </p>
        })
        return <div>{_details} 123 </div>
    }
    return <div className="text-right">0.00</div>
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
      let _ship_qty = enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY - enumObject.POD_CANCELLED_QTY
      return (
         <div className="text-right"><input  onKeyPress={(e) => number_only(e)}  onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  defaultValue={parseFloat(_ship_qty).toFixed(2)} data-name={details} data-details={cell}  name={cell+`[${details+1}]`} className="form-control"  type="number" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell]) ? this.props.input_values[details][cell] : row} /></div>
      )
    }

    shipinputmain(cell, row, enumObject, rowIndex, details) {
      let _ship_qty = (enumObject.DOD_SHIPPED_QTY=='') ? enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY : enumObject.DOD_SHIPPED_QTY
      console.log('shipinputmain', row ,cell)
      return (
        <div className="text-right"><input disabled={(enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY) == "0" ? true : false}  onKeyPress={(e) => number_only(e)}  onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  defaultValue={(_ship_qty) ? parseFloat(_ship_qty).toFixed(2) : 0.00} data-name={details} data-details={cell}  name={cell+`[${details+1}]`} className="form-control"  type="text" value={(this.props.input_values && typeof this.props.input_values[details] != 'undefined' &&  typeof this.props.input_values[details][cell] != 'undefined' && !isNaN(this.props.input_values[details][cell])) ? this.props.input_values[details][cell] : (row)} /></div>
      )
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



    remarkstext(cell, row, enumObject, rowIndex, details) {
      let _remarks = (enumObject.DOD_REMARKS && typeof enumObject.DOD_REMARKS  !== "undefined" ) ? enumObject.DOD_REMARKS : '';
      return (
         <textarea  onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  defaultValue={_remarks} data-name={details} data-details={cell}  name={cell+`[${details+1}]`} className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell]) ? this.props.input_values[details][cell] : enumObject.DOD_REMARKS}  />
      )
    }


    delremarkstext(cell, row, enumObject, rowIndex, details) {
      let _remn_type = enumObject.DOD_REMARKS !="undefined";
      let _remarks = (_remn_type==true) ? enumObject.DOD_REMARKS : '';
      return (
         <textarea disabled={(enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY) == "0" ? true : false} onChange={(this.props.change) ? (eve)=>this.props.getInputs(eve,cell,details) :()=>{} }  defaultValue={_remarks} data-name={details} data-details={cell}  name={cell+`[${details+1}]`} className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell] && this.props.input_values[details][cell].DOD_REMARKS !="undefined") ? this.props.input_values[details][cell] : (enumObject.DOD_REMARKS!='undefined') ? enumObject.DOD_REMARKS : '' }  />
      )
    }

    cndn_input_disabled (cell, row, enumObject, rowIndex, details) {

      return  <div className="cndn_qty_inputs">
        <input readOnly={true} data-name={details} data-details={cell}  name={cell+'['+(details)+']'}  type="number" className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell]!=null) ? this.props.input_values[details][cell] : row}/>
      </div>
    }

    cndn_input_sst_disabled (cell, row, enumObject, rowIndex, details) {
      let _sub_details =   ((enumObject.ID_GST) ? ((enumObject.ID_ORDERED_QTY * enumObject.ID_UNIT_COST) * (enumObject.ID_GST/100)) : '0.00');
      _sub_details = (_sub_details) ? parseFloat(_sub_details).toFixed(2) : '0.00'
      _sub_details  = isNaN(_sub_details) ? '0.00' : _sub_details;
      return  <div className="cndn_qty_inputs">
        <input readOnly={true} data-name={details} data-details={cell}  name={cell+'['+(details)+']'}  type="number" className="form-control" value={(this.props.input_values && this.props.input_values[details] && this.props.input_values[details][cell]!=null) ? this.props.input_values[details][cell] : _sub_details}/>
      </div>
    }




    IndexNumber(cell, row, enumObject, rowIndex, details) {

      return (<div>{details+1}</div>)
    }




    render() {

    const createSelectModel = (onUpdate, props) => {
      return <SelectModel onUpdate={ onUpdate } {...props}/>
    };

    let options = {
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
      alwaysShowAllBtns: false ,
      withFirstAndLast: false ,
      insertModalHeader: this.createCustomModalHeader
    };

      const selectRowProp = {
        mode: (this.props.mode) ? this.props.mode : 'checkbox',
        clickToSelect: true,
        bgColor: "rgba(197, 228, 255, 1)",
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll,
        // selected : (this.props.hasOwnProperty('selected_row') && this.props.selected_row) ? this.props.selected_row : []

      };


      if(options.page && this.props && typeof this.props.defaultsort != 'undefined' && this.props.defaultsort !== false){
        options.defaultSortName = this.props.defaultSortName;
          options.defaultSortOrder = this.props.defaultSortOrder;
      }
      return (
        <Fragment>

        <BootstrapTable ref={(this.props.table_ref) ? this.props.table_ref : ''}
        footerData={ (this.props.footer) ? this.props.footerData : ''}
        footer ={this.props.footer}
        data={ (this.props.table_body) ? this.props.table_body : [] }
        cellEdit={cellEditProp}
        selectRow={this.props.select ? selectRowProp: false}
        options={ options }
        search={(this.props.search) ? true : false}
        pagination={ this.props.pagination } striped   hover >
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
                    else if(list.type=="index"){
                      return  <TableHeaderColumn
                             tdStyle={ { whiteSpace: 'normal', width: list.width } }
                             dataField={list.id}
                             isKey={(list.key) ? true : false}
                             dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                             editable={ (list.type) ? true : false }
                             thStyle={{ whiteSpace: 'normal', width: list.width }}
                             dataFormat={this.IndexNumber.bind(this, list.id)}>
                             {list.name}
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

                    else if(list.dataFormat=="cn_input"){
                      return   <TableHeaderColumn
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                          thStyle={{ whiteSpace: 'normal', width: list.width }}
                          dataFormat={this.cn_input.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }

                    else if(list.formatter){
                      return  <TableHeaderColumn
                        tdStyle={ { whiteSpace: 'normal', width: list.width } }
                        dataField={list.id} isKey={(list.key) ? true : false} dataSort
                        editable={ (list.type) ? true : false }
                        customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                        thStyle={{ whiteSpace: 'normal', width: list.width }}
                        dataFormat={(row, cell)=>list.formatter(row, cell, list.dataFormat)}>{list.name}
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
                      dataFormat={(row, cell)=>list.formatter(row, cell, list.dataFormat)}>{list.name}
                      </TableHeaderColumn>
                    }
                    else if(list.type=="index"){
                      return  <TableHeaderColumn
                             tdStyle={ { whiteSpace: 'normal', width: list.width } }
                             dataField={list.id}
                             isKey={(list.key) ? true : false}
                             dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                             editable={ (list.type) ? true : false }
                             thStyle={{ whiteSpace: 'normal', width: list.width }}
                             dataFormat={this.IndexNumber.bind(this, list.id)}>
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
                    dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                    customEditor={{ getElement: createSelectModel }}
                    thStyle={{ whiteSpace: 'normal', width: list.width }}
                    dataFormat={this.cellButton.bind(this, list.id)}>{list.name}
                  </TableHeaderColumn>
                }
                else if(list.dataFormat=="input"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.input.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }
                else if(list.dataFormat=="doinput"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.doinput.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }


                else if(list.dataFormat=="Outstd"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.outstd.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }

                else if(list.dataFormat=="shipinput"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.shipinput.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }


                else if(list.dataFormat=="cndn_input_sst_disabled"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.cndn_input_sst_disabled.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }



                else if(list.dataFormat=="shipinputmain"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.shipinputmain.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }

                else if(list.dataFormat=="cn_input"){
                  return   <TableHeaderColumn
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                      thStyle={{ whiteSpace: 'normal', width: list.width }}
                      dataFormat={this.cn_input.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                }


                else if(list.dataFormat=="date"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.date.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }

                else if(list.dataFormat=="datetime"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
                  editable={ (list.type) ? true : false }
                  customEditor={{ getElement: createSelectModel }}
                  thStyle={{ whiteSpace: 'normal', width: list.width }}
                  dataFormat={this.datetime.bind(this, list.id)}>{list.name}
                </TableHeaderColumn>
                }


                else if(list.dataFormat=="textarea"){
                  return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
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
                    dataFormat={(row, cell)=>list.formatter(row, cell, list.dataFormat)}>{list.name}
                  </TableHeaderColumn>
                }
                else if(list.dataFormat=="remarkstext"){
                  return  <TableHeaderColumn
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }
                    dataField={list.id} isKey={(list.key) ? true : false}
                    editable={ (list.type) ? true : false }
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                    thStyle={{ whiteSpace: 'normal', width: list.width }}
                    dataFormat={this.remarkstext.bind(this, list.id)}>{list.name}
                  </TableHeaderColumn>
                }

                else if(list.dataFormat=="delremarkstext"){
                  return  <TableHeaderColumn
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }
                    dataField={list.id} isKey={(list.key) ? true : false}
                    editable={ (list.type) ? true : false }
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                    thStyle={{ whiteSpace: 'normal', width: list.width }}
                    dataFormat={this.delremarkstext.bind(this, list.id)}>{list.name}
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

                else if(list.dataFormat=="number4"){
                  return  <TableHeaderColumn
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort
                    editable={ (list.type) ? true : false }
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                    thStyle={{ whiteSpace: 'normal', width: list.width }}
                    dataFormat={this.number4.bind(this, list.id)}>{list.name}
                  </TableHeaderColumn>
                }



                else if(list.dataFormat=="numberna"){
                  return  <TableHeaderColumn
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort
                    editable={ (list.type) ? true : false }
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                    thStyle={{ whiteSpace: 'normal', width: list.width }}
                    dataFormat={this.numberna.bind(this, list.id)}>{list.name}
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
                      dataFormat={this.price_formatter.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                  }

                  else if(list.dataFormat=="price2"){
                    return  <TableHeaderColumn
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort
                      editable={ (list.type) ? true : false }
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                      thStyle={{ whiteSpace: 'normal', width: list.width }}
                      dataFormat={this.price_formatter_2.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                  }

                  else if(list.dataFormat=="pricena"){
                    return  <TableHeaderColumn
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort
                      editable={ (list.type) ? true : false }
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                      thStyle={{ whiteSpace: 'normal', width: list.width }}
                      dataFormat={this.pricena.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                  }

                  else if(list.dataFormat=="cn_textarea"){
                    return  <TableHeaderColumn
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort
                      editable={ (list.type) ? true : false }
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                      thStyle={{ whiteSpace: 'normal', width: list.width }}
                      dataFormat={this.cn_textarea.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                  }



                  else if(list.dataFormat=="downloads"){
                    return  <TableHeaderColumn
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort
                      editable={ (list.type) ? true : false }
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                      thStyle={{ whiteSpace: 'normal', width: list.width }}
                      dataFormat={this.downloads.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                  }

                  else if(list.dataFormat=="validatedata"){
                    return  <TableHeaderColumn
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort
                      editable={ (list.type) ? true : false }
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                      thStyle={{ whiteSpace: 'normal', width: list.width }}
                      dataFormat={this.validatedata.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                  }

                  else if(list.dataFormat=="cndn_input_disabled"){
                    return  <TableHeaderColumn
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort
                      editable={ (list.type) ? true : false }
                      customEditor={(list.type) ? { getElement: createSelectModel } : ''}
                      thStyle={{ whiteSpace: 'normal', width: list.width }}
                      dataFormat={this.cndn_input_disabled.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                  }





                return <TableHeaderColumn
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }
                  dataField={list.id}
                  dataSort = {(this.props.sorting!=='' && this.props.sorting !=='undefined') ? this.props.sorting : true }
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
