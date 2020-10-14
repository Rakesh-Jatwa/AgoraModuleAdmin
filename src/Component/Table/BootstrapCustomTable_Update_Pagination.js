import React, {Component, Fragment} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import SelectModel from './SelectModel'
import TableButton from './TableButton'
import {TodayDate, ddmmyy} from '../Dates'
import {UserDetails} from '../../Common/LocalStorage'

const cellEditProp = {
  mode: 'click',
  blurToSave: true
};



class BootstrapCustomTable extends Component {

    componentDidUpdate(){
      // console.log('table_body', this.props.table_body)
    }

    renderShowsTotal(start, to, total) {
      let _total = 12;
      let _details = to-start;
      let _total_1 = total/_total;
      return (
        <p style={ { color: 'blue' } }>
          {(to > 0) ? (_details+1) : 0} record(s) found. { Math.ceil(_total_1) } page(s) found
        </p>
      );
    }

    

    

    onRowSelect = (row, isSelected, e) => {
      this.props.products(row, isSelected, e)
    }

    onSelectAll = (isSelected, currentDisplayAndSelectedData) => {
      if(this.props.selectall){
        this.props.selectall(currentDisplayAndSelectedData, isSelected)
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


    sortDates (a, b, order) {
      let indices = [6, 7, 8, 9, 3, 4, 0, 1];
      if (order === 'asc') {
        let r = 0;
        indices.find(i => r = a.IM_PAYMENT_DATE.charCodeAt(i) - b.IM_PAYMENT_DATE.charCodeAt(i));
        return r;
      } else if (order === 'desc') {
        let r = 0;
        indices.find(i => r = b.IM_PAYMENT_DATE.toString().charCodeAt(i) - a.IM_PAYMENT_DATE.toString().charCodeAt(i));
        return r;
      }
    }


  

    

    sortDUEDATE (a, b, order) {
      let indices = [6, 7, 8, 9, 3, 4, 0, 1];
      if (order === 'asc') {
        let r = 0;
        indices.find(i => r = a.DUE_DATE.charCodeAt(i) - b.DUE_DATE.charCodeAt(i));
        return r;
      } else if (order === 'desc') {
        let r = 0;
        indices.find(i => r = b.DUE_DATE.toString().charCodeAt(i) - a.DUE_DATE.toString().charCodeAt(i));
        return r;
      }
    }

    sortPOMPODate (a, b, order) {
      let indices = [6, 7, 8, 9, 3, 4, 0, 1];
      if (order === 'asc') {
        let r = 0;
        indices.find(i => r = a.POM_PO_Date.charCodeAt(i) - b.POM_PO_Date.charCodeAt(i));
        return r;
      } else if (order === 'desc') {
        let r = 0;
        indices.find(i => r = b.POM_PO_Date.toString().charCodeAt(i) - a.POM_PO_Date.toString().charCodeAt(i));
        return r;
      }
    }


    

    converted_date (a, b, order) {
      let indices = [6, 7, 8, 9, 3, 4, 0, 1];
      if (order === 'asc') {
        let r = 0;
        indices.find(i => r = a.PRD_CONVERT_TO_DATE.charCodeAt(i) - b.PRD_CONVERT_TO_DATE.charCodeAt(i));
        return r;
      } else if (order === 'desc') {
        let r = 0;
        indices.find(i => r = b.PRD_CONVERT_TO_DATE.toString().charCodeAt(i) - a.PRD_CONVERT_TO_DATE.toString().charCodeAt(i));
        return r;
      }
    }

    

    sortCreatedDates(a, b, order) {
      let indices = [6, 7, 8, 9, 3, 4, 0, 1];
      if (order === 'asc') {
        let r = 0;
        indices.find(i => r = a.IM_CREATED_ON.charCodeAt(i) - b.IM_CREATED_ON.charCodeAt(i));
        return r;
      } else if (order === 'desc') {
        let r = 0;
        indices.find(i => r = b.IM_CREATED_ON.toString().charCodeAt(i) - a.IM_CREATED_ON.toString().charCodeAt(i));
        return r;
      }
    }


    input(cell, row, enumObject, rowIndex, details) {
      return (
         <input onChange={(this.props.change) ? this.props.getInputs :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  type="number" className="form-control" defaultValue={row}/>
        
      )
    }

    rfqinput(cell, row, enumObject, rowIndex, details) {
      return (
         <input onChange={(this.props.change) ? this.props.getInputs :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+details+']'}  type="number" className="form-control" defaultValue={row}/>
        
      )
    }

    textarea(cell, row, enumObject, rowIndex, details) {
      return (
        <input onChange={(this.props.change) ? this.props.getInputs :()=>{} }  data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  type="text" className="form-control" defaultValue={row}/>
      )
    }

    mass_textarea(cell, row, enumObject, rowIndex, details) {
      return (
        <input onChange={(this.props.change) ? this.props.getInputs :()=>{} } data-invoiceno={enumObject.IM_INVOICE_INDEX}   data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  type="text" className="form-control" defaultValue={row}/>
      )
    }

    inv_mass_textarea(cell, row, enumObject, rowIndex, details) {
      let _temp_details ='';
      let _user_details = UserDetails();
      if(enumObject.hasOwnProperty('appRemarks') && enumObject.appRemarks.length > 4){
        _temp_details = enumObject.appRemarks.map((list_details, index)=>{
           return  <div key={list_details.FA_AO_ACTION}> {list_details.FA_SEQ}.{(list_details.FA_AO_REMARK && list_details.FA_AO_REMARK!='null') ? list_details.FA_AO_REMARK : ' - '}</div> 
        })
      }
      return (
        <div>
          {(_user_details.ROLE_NAME && (_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER'))) ? _temp_details : ''}
          <input onChange={(this.props.change) ? this.props.getInputs :()=>{} } data-invoiceno={enumObject.IM_INVOICE_INDEX}   data-name={details} data-details={cell}  name={cell+'['+enumObject.POM_PO_Index+']'}  type="text" className="form-control" defaultValue={row}/>
        </div>
      )
    }

    inv_mass(cell, row, enumObject, rowIndex, details) {
      console.log('inv_mass',enumObject)
      let _temp_details ='';
      let _user_details = UserDetails();
      if(enumObject.hasOwnProperty('appRemarks') && enumObject.appRemarks.length > 0){
        _temp_details = enumObject.appRemarks.map((list_details, index)=>{
           return  <div key={list_details.FA_AO_ACTION}> {list_details.FA_SEQ}.{(list_details.FA_AO_REMARK && list_details.FA_AO_REMARK!='null') ? list_details.FA_AO_REMARK : ' - '}</div> 
        })
      }
     return <div>{(_user_details.ROLE_NAME && (_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER') || _user_details.ROLE_NAME.includes('VERIFIER') || _user_details.ROLE_NAME.includes('verifier'))) ? _temp_details : (row!='null') ? row : ''}</div>
    }

    inv_mass_all(cell, row, enumObject, rowIndex, details) {
      console.log('_temp_details', enumObject.appRemarks)
      let _temp_details ='';
      if(enumObject.hasOwnProperty('appRemarks') && enumObject.appRemarks.length > 0){
        _temp_details = enumObject.appRemarks.map((list_details, index)=>{
           return  <div key={list_details.FA_AO_ACTION}> {list_details.FA_SEQ}.{(list_details.FA_AO_REMARK && list_details.FA_AO_REMARK!='null') ? list_details.FA_AO_REMARK : ' - '}</div> 
        })
      }
     return <div>{(_temp_details) ? _temp_details : (row!='null') ? row : ''}</div>
    }



    

    e2paotextarea(cell, row, enumObject, rowIndex, details) {
      return (
        <input onChange={(this.props.change) ? this.props.getInputs :()=>{} }  data-name={details}  data-invoiceno={enumObject.IM_INVOICE_INDEX} data-details={cell}  name={cell+'['+enumObject.IM_INVOICE_INDEX+']'}  type="text" className="form-control" defaultValue={row}/>
      )
    }

    validatedata(cell, row, enumObject, rowIndex, details) {
      if(row){
          return row
      }
      return 'N/A'
    }

    

    outstd(cell, row, enumObject, rowIndex, details) {
      return parseFloat(enumObject.POD_ORDERED_QTY - enumObject.POD_DELIVERED_QTY - enumObject.POD_CANCELLED_QTY).toFixed(2)
    }

    price(cell, row, enumObject, rowIndex, details) {
      return <div className="text-right">{parseFloat(row).toFixed(2)}</div>
    }

    button_dashbaord(cell, row, enumObject, rowIndex, details) {
      return <button type="button" className="btn btn-outline-primary btn-sm">{row}</button>
    }

    

    price4(cell, row, enumObject, rowIndex, details) {
      return <div className="text-right">{(row) ? parseFloat(row).toFixed(4) : '00.0000'}</div>
    }

    amount(cell, row, enumObject, rowIndex, details) {
      return <div className="text-right">{parseFloat(row).toFixed(2)}</div>
    }

    date(cell, row, enumObject, rowIndex, details) {
      if(row){
        return ddmmyy(row)
      }
      return '-'
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


    
    IndexNumber(cell, row, enumObject, rowIndex, details) {
    
      return (<div>{details+1}</div>) 
    }
   

     sizePerPageListChange = (sizePerPage) => {
 
    }
  
     onPageChange = (page, sizePerPage) => {
      
    }

    price_formatter(cell, row, enumObject, rowIndex, details) {
        if(row){
            return <div className="text-right">{parseFloat(row).toFixed(2)}</div>
        }
        return <div className="text-right"> 0.00 </div>
    }

    price_formatter_na(cell, row, enumObject, rowIndex, details) {
      if(row){
          return <div className="text-right">{parseFloat(row).toFixed(2)}</div>
      }
      return <div className="text-right"> N/A</div>
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

    
    onBootstrapTableRef(instance) {
      
    }
    
  
    render() {
     
    const createSelectModel = (onUpdate, props) => {
      return <SelectModel onUpdate={ onUpdate } {...props}/>
    };

   

    const options = {
        page: 1,  // which page you want to show as default
        sizePerPageList: [ {
          text: '6', value: 6
        }, {
          text: '12', value: 12
        }, {
          text: 'All', value: 12
        } ], // you can change the dropdown list for size per page
        sizePerPage: (this.props.hasOwnProperty('total') ? this.props.total : 12),  // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 6,  // the pagination bar size.
        prePage: 'Prev', // Previous page button text
        nextPage: 'Next', // Next page button text
        firstPage: 'First', // First page button text
        lastPage: 'Last', // Last page button text
        paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
        paginationPosition: 'bottom',  // default is bottom, top and both is all available
        hideSizePerPage: true,
        alwaysShowAllBtns: true ,
        withFirstAndLast: true ,
        insertModalHeader: this.createCustomModalHeader,
        onPageChange: this.onPageChange.bind(this),
        onSizePerPageList: this.sizePerPageListChange.bind(this)
      };

      const selectRowProp = {
        mode: (this.props.mode) ? this.props.mode : 'checkbox',
        clickToSelect: true,
        bgColor: "rgb(197, 228, 255)" ,
        onSelect: this.onRowSelect,
        onSelectAll: this.onSelectAll
      }; 

     


      return (
        <Fragment>
        <BootstrapTable ref={(this.props.ref) ? this.props.ref : ''} data={ (this.props.table_body) ? this.props.table_body : [] } cellEdit={cellEditProp} selectRow={this.props.select ? selectRowProp: false} pagination   options={ options } responsive striped   hover search={(this.props.search!='') ? true : true}>
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

                    else if(list.dataFormat=="button_dashbaord"){
                      return <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.button_dashbaord.bind(this, list.id)}>{list.name}

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


                    else if(list.dataFormat=="price"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.price.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }

                    else if(list.dataFormat=="price4"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.price4.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }

                    
                    else if(list.dataFormat=="amount"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.amount.bind(this, list.id)}>{list.name}
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
                    else if(list.dataFormat=="mass_textarea"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.mass_textarea.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }
                    else if(list.dataFormat=="inv_mass_textarea"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.inv_mass_textarea.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }

                    else if(list.dataFormat=="inv_mass"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.inv_mass.bind(this, list.id)}>{list.name}
                        </TableHeaderColumn>
                    }

                    
                    
                    
                    else if(list.dataFormat=="e2paotextarea"){
                      return  <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          dataFormat={this.e2paotextarea.bind(this, list.id)}>{list.name}
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
                    else if(list.dataFormat=="security_index"){
                      return  <TableHeaderColumn   
                             tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                             dataField={list.id} 
                             isKey={(list.key) ? true : false}                           
                             editable={ (list.type) ? true : false } 
                             thStyle={{ whiteSpace: 'normal', width: list.width }}
                             dataFormat={(list.type=="index") ? this.IndexNumber.bind(this, list.id) : this.divButton.bind(this, list.dataFormat)}>
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

                  
                    return <TableHeaderColumn   
                          tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                          dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                          editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                          thStyle={{ whiteSpace: 'normal', width: list.width }} 
                          hidden= { (list.hidden) ? true : false }
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
                else if(list.dataFormat=="price4"){
                  return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.price4.bind(this, list.id)}>{list.name}
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

                else if(list.dataFormat=="mass_textarea"){
                  return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.mass_textarea.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                }

                else if(list.dataFormat=="inv_mass_textarea"){
                  return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.inv_mass_textarea.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                }


                
                else if(list.dataFormat=="button_dashbaord"){
                  return <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.button_dashbaord.bind(this, list.id)}>{list.name}

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

                else if(list.dataFormat=="sort_pr_created_date"){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} 
                    dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    sortFunc={ this.sort_pr_created_date }
                    dataFormat={this.date.bind(this, list.id)}>{list.name} 
                  </TableHeaderColumn>
                }

                else if(list.dataFormat=="sort_pr_submitted_date"){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} 
                    dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    sortFunc={ this.sort_pr_submitted_date }
                    dataFormat={this.date.bind(this, list.id)}>{list.name} 
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

                else if(list.dataFormat=="pricena"){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={this.price_formatter_na.bind(this, list.id)}>{list.name} 
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

                else if(list.dataFormat=="rfqinput"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.rfqinput.bind(this, list.id)}>{list.name} 
                </TableHeaderColumn>
                }
                
                
                
                else if(list.dataFormat=="cancel"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.cancleButtons.bind(this, list.id)}>{list.name} 
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
                  dataFormat={this.date.bind(this, list.id)}
                  >{list.name} 
                  
                </TableHeaderColumn>
                }

                else if(list.dataFormat=="mandate_date" || list.dataFormat=="mandate_input"){
                  return <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={(row, cell)=>list.formatter(row, cell, list.dataFormat)}>{list.name} 
                      <sapn className="text-danger">*</sapn>               
                   </TableHeaderColumn>
                }  

                else if(list.dataFormat=="POM_PO_Date"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.date.bind(this, list.id)}
                  sortFunc={ this.sortPOMPODate }
                  >{list.name} 
                  
                </TableHeaderColumn>
                }

                else if(list.dataFormat=="DUE_DATE"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  dataSort
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.date.bind(this, list.id)}
                  sortFunc={ this.sortDUEDATE }
                  >{list.name} 
                  
                </TableHeaderColumn>
                }

                

                else if(list.dataFormat=="inv_date"){
                  return <TableHeaderColumn  
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id} 
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.date.bind(this, list.id)}
                  dataSort={ true } 
                  sortFunc={ this.sortDates }
                  >{list.name} 
                  
                </TableHeaderColumn>
                }

                else if(list.dataFormat=="converted_date"){
                  return <TableHeaderColumn  
                    tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                    dataField={list.id} 
                    editable={ (list.type) ? true : false }  
                    customEditor={{ getElement: createSelectModel }} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={this.date.bind(this, list.id)}
                    dataSort={ true } 
                    sortFunc={ this.converted_date }
                  >{list.name} 
                </TableHeaderColumn>
                }

                

                else if(list.dataFormat=="created_date"){
                  return <TableHeaderColumn  
                    tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                    dataField={list.id} 
                    editable={ (list.type) ? true : false }  
                    customEditor={{ getElement: createSelectModel }} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataSort={ true } 
                    sortFunc={ this.sortCreatedDates }
                  >{list.name} 
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
                else if(list.formatter && list.dataFormat=='security_tag'){
                  return  <TableHeaderColumn   
                    tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                    dataField={list.id} isKey={(list.key) ? true : false} 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={(row, cell)=>list.formatter(row, cell, list.dataFormat)}>{list.name} 
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
                    dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                    editable={ (list.type) ? true : false } 
                    customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                    thStyle={{ whiteSpace: 'normal', width: list.width }} 
                    dataFormat={this.remarkstext.bind(this, list.id)}>{list.name} 
                  </TableHeaderColumn>
                }

                else if(list.dataFormat=="e2paotextarea"){
                  return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.e2paotextarea.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                }

                else if(list.dataFormat=="inv_mass"){
                  return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.inv_mass.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                }

                else if(list.dataFormat=="inv_mass_all"){
                  return  <TableHeaderColumn   
                      tdStyle={ { whiteSpace: 'normal', width: list.width } }  
                      dataField={list.id} isKey={(list.key) ? true : false} dataSort 
                      editable={ (list.type) ? true : false } customEditor={(list.type) ? { getElement: createSelectModel } : ''} 
                      thStyle={{ whiteSpace: 'normal', width: list.width }} 
                      dataFormat={this.inv_mass_all.bind(this, list.id)}>{list.name}
                    </TableHeaderColumn>
                }
                else if(list.dataFormat=="security_tag"){
                  return  <TableHeaderColumn   
                  tdStyle={ { whiteSpace: 'normal', width: list.width} }  
                  dataField={list.id}                 
                  editable={ (list.type) ? true : false }  
                  customEditor={{ getElement: createSelectModel }} 
                  thStyle={{ whiteSpace: 'normal', width: list.width }} 
                  dataFormat={this.divButton.bind(this, list.dataFormat)}>{list.name}
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