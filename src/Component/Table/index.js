import React, {Component, Fragment} from 'react';
import {FromSelectNoLabel, FormDatePickerNoLabelTabel, TablePlainInput, FromTextareaTable, FormDatePickerNoLabel, DateCustomInput} from '../../Component/From/FromInputs'
import {Field, change} from 'redux-form'
import {addDate} from '../../Component/Dates'
import {NormalizeNumbers} from '../../Actions/Common/Functions'
import {EscapeQuotes, maxlength10, maxLength1000, price2decimal4} from '../../validation/TableValidation'


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

    number4(row) {
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
      return <div className="text-right"> 00.0000</div>
    }
  

    process_table_data = (details) =>{
    }

    

    propcess_table_body = (table_elements, table_header, select=false, selectname='', radio=false, radioname='', select_function='', dynamic_id=0, change_function='', body_index, serial_id, serial_text, inputPrefix, _table_details) =>{
      let _table_elements = '';
      let _body_index = body_index.toString()
      if(table_elements){
        let _table_data_keys = (table_elements.PRODUCTCODE) ? table_elements.PRODUCTCODE : body_index
        _table_elements =  table_header.map((table_keys, index)=>{
            let _element_name = table_keys.id;
            console.log('_element_name_element_name', _element_name, table_keys)
            if(table_keys.type=="select"){
                let _options = table_keys.value;
                if(_options && _options.length){
                  let _option_name =''
                
                  if(table_keys.id=="Segmentation"){
                       _option_name = _options.map((options, index)=>{
                        return <option value={options.CF_FIELD_VALUE}  key={index} >{options.CF_FIELD_VALUE}</option>
                      })
                  }

                  else if(table_keys.id=="GSTRate"){
                     
                      _option_name = _options.map((options, index)=>{
                        return <option value={options.TAX_PERC}  key={index} >{options.TAX_CODE}</option>
                      })
                  }

                  else if(table_keys.id=="GSTRate_FF"){
                    _option_name = _options.map((options, index)=>{
                      return <option value={options.TAX_PERC}  key={index} >{options.TAX_CODE}</option>
                    })
                }

                  else{

                    console.log('_option_name', _options)
                       _option_name = _options.map((options, index)=>{
                        return <option value={options.value}  key={index} >{options.name}</option>
                      })
                  }
                
                  
                  if(_option_name){
                    if(table_keys.id=="GSTRate"){
                     
                      if(table_elements.GST){
                        return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} >{_option_name}</Field></div></td>
                      }
                      else{
                        return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_keys.select_status=="disable") ? true : false }>
                              <option value="">NS</option>
                          </Field></div></td>
                      }
                    } 
                    else if(table_keys.id=="GSTRate_FF"){
                      console.log('table_keys_value_1', table_keys.value, _option_name)
                      return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} >{_option_name}</Field></div></td>
                    }
                    return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_keys.select_status=="disable") ? true : false }>{_option_name}</Field></div></td>

                  }
                }
                else{
                     return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={table_elements[_element_name]} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id} disabled={(table_keys.select_status=="disable") ? true : false }></Field></div></td>;
                }
            }

            if(table_keys.type=="select_gst_codes"){
                let _options = table_keys.value;
                if(_options && _options.length){
                    let _option_name =''
                    if(table_elements.hasOwnProperty('sst_code_ls') && table_elements.sst_code_ls && table_elements.sst_code_ls.length){
                        _option_name = table_elements.sst_code_ls.map((options, index)=>{
                          return <option value={options.TM_TAX_CODE}  key={index} >{options.TM_TAX_CODE}</option>
                        })
                    }
                    else{
                        _option_name = _options.map((options, index)=>{
                            return <option value={options.value}  key={index} >{options.name}</option>
                        })
                    }
                    return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_elements.change_gst) ? false : true }>{_option_name}</Field></div></td>
                }
                else{
                    return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={table_elements[_element_name]} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id} disabled={(table_elements.change_gst) ? false : true }></Field></div></td>;
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

            else if(table_keys.type=="div_text"){
              return <td key={index}><div className="link_dev">{(table_elements[_element_name]) ? table_elements[_element_name] : '0.00'} </div></td>;
            }

            else if(table_keys.type=="price"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? this.number(table_elements[_element_name]) : '0.00'}</div></td>;
            }

            else if(table_keys.type=="gift"){
              return <td key={index}><div className="text-left">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? (table_elements[_element_name]=='N') ? 'No' : 'Yes' : '0.00'}</div></td>;
            }

            

            else if(table_keys.type=="gst_rate"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A" && (!isNaN(table_elements[_element_name]))) ? (table_elements[_element_name]>0) ? parseFloat((table_elements[_element_name]/100) * (table_elements.QUANTITY * table_elements.UNITCOST)).toFixed(2)  : '0.00' : '0.00'}</div></td>;
            }

          

            

            else if(table_keys.type=="price2"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? price2decimal4(table_elements[_element_name]) : '0.00'}</div></td>;
            }

            else if(table_keys.type=="GSTRate_FF_SST"){
              console.log('GSTRate_FF_Display', table_elements, table_elements[_element_name])
              if(table_elements.GST!=0){
                  return <td key={index}>
                      <div className="text-right">{(table_elements.GST) ? parseFloat((table_elements.QUANTITY * table_elements.UNITCOST) * table_elements.GST/100).toFixed(2) : '0.00'}</div>
                  </td>;
              }
              else{
                return <td key={index}>
                    <div className="text-right">{'0.00'}</div>
                </td>;
              }
            
            }


            
            

            else if(table_keys.type=="textinput"){
              if(table_elements.VENDORITEMCODE){
                return <td key={index}>{table_elements[_element_name]}</td>
              }
              else{
                return <td key={index}><div className="input_dev text-right"> <Field component={TablePlainInput} type="text" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={(table_elements[_element_name]) ? table_elements[_element_name] : 0} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
              }
              
            }



            else if(table_keys.type=="textselect"){

              if(table_elements.VENDORITEMCODE){
                return <td key={index}>{table_elements[_element_name]}</td>
              }
              else{
                let _options = table_keys.value;
                if(_options && _options.length){
                  let _option_name =''
                  if(table_keys.id=="UOM"){
                       _option_name = _options.map((options, index)=>{
                        return <option value={(options.CODE_ABBR) ? options.CODE_ABBR.trim() : ''}  key={index} >{options.CODE_DESC}</option>
                      })
                  }
                  else{
                       _option_name = _options.map((options, index)=>{
                        return <option value={options.value}  key={index} >{options.name}</option>
                      })
                  }
                  if(_option_name){
                    return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_keys.select_status=="disable") ? true : false }>{_option_name}</Field></div></td>
  
                  }
                }
                else{
                  return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={table_elements[_element_name]} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id} disabled={(table_keys.select_status=="disable") ? true : false }></Field></div></td>;
                }
              }
              
            }

            else if(table_keys.type=="textselect_ffo_po"){

                console.log('textselect_ffo_po', table_keys.value)
                let _options = table_keys.value;
                if(_options && _options.length){
                  let _option_name =''
                  if(table_keys.id=="UOM"){
                       _option_name = _options.map((options, index)=>{
                        return <option value={(options.CODE_ABBR) ? options.CODE_ABBR.trim() : ''}  key={index} >{options.CODE_DESC}</option>
                      })
                  }
                  else{
                       _option_name = _options.map((options, index)=>{
                        return <option value={options.value}  key={index} >{options.name}</option>
                      })
                  }
                  if(_option_name){
                    return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={(table_elements[_element_name])} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? this.props.select_change.bind(this, body_index) : (e)=>{}} disabled={(table_keys.select_status=="disable") ? true : false }>{_option_name}</Field></div></td>
  
                  }
                }
                else{
                  return <td key={index}><div className="select"><Field component={FromSelectNoLabel} inputvalue={table_elements[_element_name]} className="select" data-id={table_elements[dynamic_id]} data-inputname={table_keys.id}  name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id} disabled={(table_keys.select_status=="disable") ? true : false }></Field></div></td>;
                }
              
              
            }


            
            else if(table_keys.type=="sst_amount"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? this.number((table_elements.QUANTITY * table_elements.UNITCOST) * (table_elements[_element_name]/100)) : '0.00'}</div></td>;
            }

            
            else if(table_keys.type=="price4"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? this.number4(table_elements[_element_name]) : '00.0000'}</div></td>;
            }

            else if(table_keys.type=="text-right"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? table_elements[_element_name] : '0'}</div></td>;
            }

           

            else if(table_keys.type=="pricena"){
              return <td key={index}><div className="text-right">{(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? this.number(table_elements[_element_name]) : 'N/A'}</div></td>;
            }

            else if(table_keys.type=="product_link"){
              return <td key={index}> {(table_elements[_element_name] && table_elements[_element_name]!="N/A") ? <div className="link" onClick={()=>this.props.product_details(table_elements)}> {table_elements[_element_name]} </div> : 'N/A'} </td>;
            }

            else if(table_keys.type=="click"){
              return <td key={index}><div className="link_dev">{table_elements[_element_name]} <i data-details={table_keys.id} data-name={body_index}  data-id={body_index}  onClick={(e)=>this.props.handle_popup(e, table_elements)} className="fa fa-pencil-square-o text-right" aria-hidden="true"></i> </div></td>;
            }

            else if(table_keys.type=="click_tax"){
              return <td key={index}>{(table_elements.change_gst) ? <div className="link_dev">{table_elements.GSTRATE} <i data-details={table_keys.id} data-name={body_index}  data-id={body_index}  onClick={(e)=>this.props.handle_popup(e, table_elements)} className="fa fa-pencil-square-o text-right" aria-hidden="true"></i>  </div> : (table_elements.GSTRATE) ? table_elements.GSTRATE :  'NS'}</td>;
            }

            
            
            else if(table_keys.type=="textarea"){
              return <td key={index}><div className="link_dev"><Field validate={[ maxLength1000]}  component={FromTextareaTable} type="text" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={table_elements[_element_name]} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
            }
            
            else if(table_keys.type=="date"){
              return <td key={index}><div className="input_dev"> <Field  component={FormDatePickerNoLabelTabel}  selected={(this.props.dates && this.props.dates.length) ? this.props.dates[body_index]  : this.state.min_date} minDate={this.state.min_date} type="text" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id} keypress={(e)=>e.preventDefault()}  value={table_elements[_element_name]} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(this.props.handle_date)? (value) => this.props.handle_date(value, table_keys.id, body_index) : (e)=>{e.preventdefault()}} /></div></td>;
            }

            else if(table_keys.type=="number"){
              return <td key={index}><div className="input_dev text-right"> <Field normalize={NormalizeNumbers} component={TablePlainInput} type="number" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={(table_elements[_element_name]) ? table_elements[_element_name] : 0} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
            }

            else if(table_keys.type=="input"){
              return <td key={index}><div className="input_dev text-right"> <Field component={TablePlainInput} type="text" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={(table_elements[_element_name]) ? table_elements[_element_name] : 0} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
            }

            else if(table_keys.type=="wtnumber"){
              return <td key={index}><div className="input_dev text-right"> <Field  normalize={maxlength10} component={TablePlainInput} type="number" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={(table_elements[_element_name]) ? table_elements[_element_name] : 0} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
            }

            

            else if(table_keys.type=="input"){
              return <td key={index}><div className="input_dev"> <Field component={TablePlainInput} type="text" data-id={table_elements[dynamic_id]}  data-inputname={table_keys.id}  value={table_elements[_element_name]} name={inputPrefix+'.'+body_index+'.'+_table_data_keys+'.'+table_keys.id}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
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
                  {this.props.select?  <th style={{width: '50px'}}  > <input type="checkbox" name="table-select" vlaue='all' checked={(this.props.select_all) ? true : false } onClick={this.props.selectall}/></th> : ''} 
                  {this.props.serial?  <th style={{width: '50px'}}  > {this.props.serial_text}</th> : ''}  
                  {this.props.radio?  <th  style={{width: '50px'}} > <input type="radio" name="table-select" vlaue='all'/></th> : ''}         
                  {this.props.table_header.map((list, index)=>{
                      return <th  style={{width: `${String(list.width)}`}} data-field={list.name} key={index} onClick={(list.type=="click" || list.type=="select_click" || list.type=="click_tax" || list.type=="select_click_ffo")  ? ()=>this.props.headerclick(this, list) : ()=>{}} className={(list.type=="select_click" || list.type=="click" || list.type=="select_click_ffo") ? "link_text" : "" }>
                        {list.name} {list.type=="date" ? <Field dateFormat="dd/mm/yyyy" component={FormDatePickerNoLabel} selected={(this.props.main_date) ? this.props.main_date : this.state.min_date} dateFormat="dd/mm/yyyy" minDate={this.state.min_date} onChange={this.props.handledateHeader} type="text" customInput = {<DateCustomInput/>}  /> : ''}
                        </th>
                  })}
              </tr>
          </thead>
          <tbody>
              {this.state.alldetails && this.state.alldetails.map((list, index)=>{                 
                  if(!list.hasOwnProperty('removed')){
                      _table_details = _table_details+1
                      return  this.propcess_table_body(list, this.props.table_header, this.props.select, this.props.selectname,this.props.radio, this.props.radioname, this.props.select_function, this.props.table_id, this.props.changefunction, index, this.props.serial, this.props.serial_text, this.props.inputPrefix, _table_details)}
                  }
              )}
              {(this.props.extratotal) ? <Fragment>
               
                <tr className="">
                  {(this.props.subtotal!='' || this.props.subtotal!='0') ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>Sub Total :</strong> </td> <td className={'text-right'} > {this.number((this.props.subtotal!="0.00") ? this.props.subtotal : '0.00')} </td></Fragment>)  : <Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>Sub Total  :</strong> </td> <td className={'text-right'}> 0.00 </td> </Fragment>}
                </tr>
                 <tr  className="">
                  {(this.props.sstamount!='' || this.props.sstamount!='0') ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>SST Amount  :</strong>  </td> <td className={'text-right'}> {this.number((this.props.sstamount!="0.00") ? this.props.sstamount : '0.00')}</td></Fragment>)  : <Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>SST Amount :</strong> </td> <td className={'text-right'}> 0.00 </td> </Fragment>}
                </tr>
                <tr  className="">
                {(this.props && this.props.shipping_charge && this.props.shipping_charge_update) ? (<Fragment>
                  <td className={'text-right'} colSpan={this.props.colcount}> <strong>Shipping & Handling  :</strong>  </td> 
                  <td className={'text-right'}><input type="number" className="from-control text-right" data-detailsvalue={this.props.shipping_amount} value={this.props.shipping_amount} onChange={(e)=>this.props.shipping_charge_update(e.target.value)}/> </td></Fragment>) : '' }
                </tr>
                 <tr  className="">
                {(this.props.grandtotal!='' || this.props.grandtotal!='0') ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>Grand Total  :</strong> </td> <td className={'text-right'}> {this.number((this.props.grandtotal!="0.00") ? this.props.grandtotal : '0.00')} </td></Fragment>) : <Fragment><td className={'text-right'} colSpan={this.props.colcount}> <strong>Grand Total  :</strong> </td> <td className={'text-right'}> 0.00 </td> </Fragment>}
              </tr> </Fragment>: ''}
          </tbody>
        </table>
         
        </div>
        </div>
      );
    }
  }

  export default BootstrapCustomTable;