import React, {Component, Fragment} from 'react';
import {FromSelectNoLabel, FormDatePickerNoLabelTabel, TablePlainInput, FromTextareaTable, FormDatePickerNoLabel, DateCustomInput} from '../../Component/From/FromInputs'
import {Field, change} from 'redux-form'
import {addDate} from '../../Component/Dates'
import {NormalizeNumbers} from '../../Actions/Common/Functions'


class BootstrapCustomTable extends Component {

    constructor(props){
        super(props);
        this.propcess_table_body = this.propcess_table_body.bind(this);
        this.onPageChanged = this.onPageChanged.bind(this);
        this.process_table_data = this.process_table_data.bind(this);
        this.state = {
          delete:false,
          alldetails: [],
          currentdetails: [],
          currentPage: null,
          totalPages: null,
          reredner:false,
          min_date:new Date()
        }
    }

     static getDerivedStateFromProps(props, state){
       console.log('table_body_1', props.table_body)
        if((!state.delete)){
            return {
              alldetails : props.table_body
            }
        }
        return null
     }

     componentDidMount() {
      const alldetails =  this.props.table_body;
      let update_date = this.state.min_date
      update_date = update_date.setDate((update_date.getDate() + 1))
      this.setState({ alldetails: alldetails,min_date:update_date  });
    }

    onPageChanged = data => {
      const { alldetails } = this.state;
    
      const { currentPage, totalPages, pageLimit } = data;
      const offset = (currentPage - 1) * pageLimit;
      const currentdetails = alldetails.slice(offset, offset + pageLimit);
      this.setState({ currentPage, currentdetails, totalPages });
    };

    number(row) {
      if(row && row>0){
        console.log('number',row)
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
  

    process_table_data = (details) =>{
    }

    

    propcess_table_body = (table_elements, table_header, select=false, selectname='', radio=false, radioname='', select_function='', dynamic_id=0, change_function='', body_index, serial_id, serial_text, inputPrefix, _table_details, _delete=false) =>{
      let _table_elements = '';
      let _body_index = body_index.toString()
      if(table_elements){
        let _table_data_keys = (table_elements.PRODUCTCODE) ? table_elements.PRODUCTCODE : body_index
        _table_elements =  table_header.map((table_keys, index)=>{
            let _element_name = table_keys.id;
            if(table_keys.type=="select"){
                let _options = table_keys.value;
                if(_options && _options.length){
                  let _option_name =''
                
                  if(table_keys.id=="Segmentation"){
                       _option_name = _options.map((options, index)=>{
                        return <option value={options.CF_FIELD_VALUE}  key={index} >{options.CF_FIELD_VALUE}</option>
                      })
                  }
                  else if (table_keys.id=="ID_PAY_FOR"){
                    _option_name = _options.map((options, index)=>{
                      return <option value={options.IC_OTHER_B_COY_CODE}  key={index} >{options.IC_OTHER_B_COY_CODE}</option>
                    })
                  }

                  else if (table_keys.id=="ID_GST_INPUT_TAX_CODE"){
                 
                    _option_name = _options.map((options, index)=>{
                      return <option value={options.TM_TAX_CODE}  key={index} >{options.GST}</option>
                    })
                    _option_name = [<option value="" key={index} >Select</option>,..._option_name]
                  }

                  
                  else{
                       _option_name = _options.map((options, index)=>{
                        return <option value={options.value}  key={index} >{options.name}</option>
                      })
                  }
                
                  if(_option_name){
                    // console.log('table_elements[_element_name]', table_elements[_element_name])
                    return <td key={_body_index}><div className="select" ><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_keys.select_status=="disable") ? true : false }>{_option_name}</Field></div></td>

                  }
                }
                else{
                  return <td key={index}><div className="select" ><Field component={FromSelectNoLabel} inputvalue={table_elements[_element_name]} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id} disabled={(table_keys.select_status=="disable") ? true : false }></Field></div></td>;
                }
            }
            else if(table_keys.type=="select_click"){
              let _options = table_keys.value;
              if(_options && _options.length){
                let _option_name =''
                if(table_keys.id=="Segmentation"){
                     _option_name = _options.map((options, index)=>{
                      return <option value={options.CF_FIELD_VALUE}  key={index} >{options.CF_FIELD_VALUE}</option>
                    })
                }
                else{
                     _option_name = _options.map((options, index)=>{
                      return <option value={options.value}  key={index} >{options.name}</option>
                    })
                }
              
                if(_option_name){
                  console.log('selectvalue', table_elements[_element_name])
                  return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_keys.select_status=="disable") ? true : false }>{_option_name}</Field></div></td>

                }
              }
              else{
                return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={table_elements[_element_name]} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id} disabled={(table_keys.select_status=="disable") ? true : false }></Field></div></td>;
              }
          }


          else if(table_keys.type=="select_click_ffo"){
            let _options = table_keys.value;
            if(_options && _options.length){
              let _option_name =''
              if(table_keys.id=="Segmentation" || table_keys.id=="Test"){
                   _option_name = _options.map((options, index)=>{
                    return <option value={options.CF_FIELD_VALUE}  key={index} >{options.CF_FIELD_VALUE}</option>
                  })
              }
              
              else{
                   _option_name = _options.map((options, index)=>{
                    return <option value={options.value}  key={index} >{options.name}</option>
                  })
              }
            
              if(_option_name){
                // console.log('table_keys.select_status', table_keys.select_status)
                console.log('selectvalue', table_elements[_element_name])
                return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_keys.select_status=="disable") ? true : false }>{_option_name}</Field></div></td>

              }
            }
            else{
              return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={table_elements[_element_name]} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id} disabled={(table_keys.select_status=="disable") ? true : false }></Field></div></td>;
            }
        }
          
            else if(table_keys.type=="link"){
              return <td key={index}><div className="link_dev">{table_elements[_element_name]} <button type="button" data-id={table_elements[dynamic_id]} data-name={table_keys.id}  name={table_keys.id}>></button></div></td>;
            }

            else if(table_keys.type=="link_text"){
              return <td key={index}><div className="link_dev">{table_elements[_element_name]} <i data-details={table_keys.id} data-name={body_index}  data-id={body_index}  onClick={(e)=>this.props.handle_popup(e, table_elements)} className="fa fa-pencil-square-o text-right" aria-hidden="true"></i> </div></td>;
            }

            else if(table_keys.type=="price"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? this.number(table_elements[_element_name]) : '0.00'}</div></td>;
            }

            else if(table_keys.type=="product_link"){
              return <td key={index}> {(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? <div className="link" onClick={()=>this.props.product_details(table_elements)}> {table_elements[_element_name]} </div> : 'N/A'} </td>;
            }

            else if(table_keys.type=="click"){
              return <td key={index}><div className="link_dev">{table_elements[_element_name]} <i data-details={table_keys.id} data-name={body_index}  data-id={body_index}  onClick={(e)=>this.props.handle_popup(e, table_elements)} className="fa fa-pencil-square-o text-right" aria-hidden="true"></i> </div></td>;
            }
            
            else if(table_keys.type=="textarea"){
              return <td key={index}><div className="link_dev"><Field component={FromTextareaTable} type="text" className="form-control"  data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={table_elements[_element_name]} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
            }
            
            else if(table_keys.type=="date"){
              console.log('table_date', table_elements[_element_name])
              return <td key={index}><div className="input_dev"> <Field  component={FormDatePickerNoLabelTabel} className="form-control"  selected={(this.props.dates && this.props.dates.length) ? this.props.dates[body_index]  : this.state.min_date} minDate={this.state.min_date} type="text" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id} keypress={(e)=>e.preventDefault()}  value={table_elements[_element_name]} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(this.props.handle_date)? (value) => this.props.handle_date(value, table_keys.id, body_index) : (e)=>{e.preventdefault()}} /></div></td>;
            }

             else if(table_keys.type=="number"){
            
              return <td key={index}><div className="input_dev text-right"> <Field normalize={NormalizeNumbers} className="form-control" component={TablePlainInput} type="number" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={(table_elements[_element_name]) ? table_elements[_element_name] : 0} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
            }

            else if(table_keys.type=="input"){
              return <td key={index}><div className="input_dev"> <Field component={TablePlainInput} className="form-control" type="text" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={table_elements[_element_name]} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
            }
            else if(!table_elements[_element_name]){
              return <td key={index}>N/A</td>
            }
            else{
              return <td key={index}>{table_elements[_element_name]}</td>
            }
        })
     }
     return <tr key={body_index}>
   
       {_delete?<td><span ><i onClick={() => this.props.delete_function(table_elements)} className="fa fa-trash" aria-hidden="true"></i></span></td> : ''  } 
       {select?<td><input type="checkbox" name="table-select" onClick={(this.props.select_function_inex) ? (e)=>this.props.select_function_inex(e) : (e)=>{}} value={body_index+'.'+table_elements.PRODUCTCODE} checked={(this.props.selected_items && this.props.selected_items.length && (this.props.selected_items.includes(_body_index))) ? true : false}/></td> : ''  } 
       {radio ?<td><input type="radio" name="table-select" value={(table_elements.hasOwnProperty(selectname)) ? table_elements[selectname] : ''}/></td> :''}
       {serial_id ? <td>{_table_details}</td> :''}{_table_elements}</tr>
    
    }
    
    
    render() {      
      let _table_details = 0 ;
      return (
     
        <div className={(this.props.responsive) ? "table-responsive" : ''}>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered" >
                <thead>
                    <tr>
                        {this.props.delete?  <th style={{width: '50px'}}  ></th> : ''} 
                        {this.props.select?  <th style={{width: '50px'}}  > <input type="checkbox" name="table-select" vlaue='all' checked={(this.props.select_all) ? true : false } onClick={this.props.selectall}/></th> : ''} 
                        {this.props.serial?  <th style={{width: '50px'}}  > {this.props.serial_text}</th> : ''}  
                        {this.props.radio?  <th  style={{width: '50px'}} > <input type="radio" name="table-select" vlaue='all'/></th> : ''}         
                        {this.props.table_header.map((list, index)=>{
                            return <th  style={{width: `${String(list.width)}`}} data-field={list.name} key={index} onClick={(list.type=="click" || list.type=="select_click" || list.type=="select_click_ffo")  ? ()=>this.props.headerclick(this, list) : ()=>{}} className={(list.type=="select_click" || list.type=="click" || list.type=="select_click_ffo") ? "link_text" : "" }>
                              {list.name} {(list.rem) ?<span className="text-danger">*</span> : ''} {list.type=="date" ? <Field dateFormat="dd/mm/yyyy" component={FormDatePickerNoLabel} selected={(this.props.main_date) ? this.props.main_date : this.state.min_date} dateFormat="dd/mm/yyyy" minDate={this.state.min_date} onChange={this.props.handledateHeader} type="text" customInput = {<DateCustomInput/>}  /> : ''}
                              </th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {this.state.alldetails && this.state.alldetails.map((list, index)=>{
                        
                      
                        if(!list.hasOwnProperty('removed')){
                          _table_details = _table_details+1
                          return  this.propcess_table_body(list, this.props.table_header, this.props.select, this.props.selectname,this.props.radio, this.props.radioname, this.props.select_function, this.props.table_id, this.props.changefunction, index, this.props.serial, this.props.serial_text, this.props.inputPrefix, _table_details,  this.props.delete)}
                        }
                    )}
                    {(this.props.extratotal) ? <Fragment>
                      
                      <tr className="">
                        {(this.props.subtotal) ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>Total Amount (excl.SST) :</strong> </td> <td className={'text-right'} > {this.number((this.props.subtotal!="0.00") ? this.props.subtotal : 0.00)} </td></Fragment>) : '' }
                      </tr>
                      <tr  className="">
                      {(this.props.sstamount) ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>SST Amount Input  :</strong>  </td> <td className={'text-right'}> {this.number((this.props.sstamount!="0.00") ? this.props.sstamount : 0.00)}</td></Fragment>) : '' }
                      </tr>
                      <tr  className="">
                      {(this.props.sstamount) ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>(SST Amount Output)  :</strong>  </td> <td className={'text-right'}> {this.number((this.props.sstamount!="0.00") ? this.props.sstamount_out : 0.00)}</td></Fragment>) : '' }
                      </tr>
                      <tr  className="">
                      {(this.props.grandtotal) ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>Total (incl.SST) :</strong> </td> <td className={'text-right'}> {this.number((this.props.grandtotal!="0.00") ? this.props.grandtotal : 0.00)} </td></Fragment>) : '' }
                    </tr> </Fragment>: ''}
                </tbody>
              </table>
          </div>
        </div>
      );
    }
  }

  export default BootstrapCustomTable;