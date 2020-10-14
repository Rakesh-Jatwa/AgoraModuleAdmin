import React, {Component, Fragment} from 'react';
import Pagination from '../Pagination'
import SelectModel from './SelectModel'


class BootstrapCustomTable extends Component {

    constructor(props){
        super(props);
        this.propcess_table_body = this.propcess_table_body.bind(this);
        this.onPageChanged = this.onPageChanged.bind(this);
        this.state = {
          alldetails: [],
          currentdetails: [],
          currentPage: null,
          totalPages: null
        }
    }

     componentDidMount() {
      const alldetails =  this.props.table_body;
     
      this.setState({ alldetails });
    }

    onPageChanged = data => {
      const { alldetails } = this.state;
    
      const { currentPage, totalPages, pageLimit } = data;
      const offset = (currentPage - 1) * pageLimit;
      const currentdetails = alldetails.slice(offset, offset + pageLimit);
      this.setState({ currentPage, currentdetails, totalPages });
    };
  

    propcess_table_body = (table_elements, table_header, select=false, selectname='', radio=false, radioname='', select_function='', dynamic_id=0, change_function='') =>{
   
      let _table_elements = '';
      let _table_datas = [];
      if(table_elements){
        _table_datas = Object.keys(table_elements);
        _table_elements =  _table_datas.map((table_keys, index)=>{

          var _header_details = table_header.filter((table_header_elements)=>{
            return table_header_elements.id == table_keys
          })

          if(_header_details.length){
            if(_header_details[0].id == table_keys){
              if(_header_details[0].type=="select"){
                  let _options = _header_details[0].value;
                  if(_options && _options.length){
                    let _option_name = _options.map((options, index)=>{
                      return <option value={options.value}  key={index} selected={(options.value==table_elements[table_keys] ? 'selected' : '')}>{options.name}</option>
                    })
                    return <td key={index}><div className="select"><select className="select" data-id={table_elements[dynamic_id]} data-inputname={_header_details[0].id}  name={_header_details[0].id+`[${table_elements[dynamic_id]}]`}  onChange={(change_function)? change_function : (e)=>{}}>{_option_name}</select></div></td>
                  }
                  else{
                    return <td key={index}><div className="select"><select className="select" data-id={table_elements[dynamic_id]} data-inputname={_header_details[0].id}  name={_header_details[0].id+`[${table_elements[dynamic_id]}]`}></select></div></td>;
                  }

              }
              else if(_header_details[0].type=="link"){
                return <td key={index}><div className="link_dev">{table_elements[table_keys]} <button type="button" data-id={table_elements[dynamic_id]} data-name={_header_details[0].id}  name={_header_details[0].id}>></button></div></td>;
              }
              else if(_header_details[0].type=="input"){
                return <td key={index}><div className="input_dev"> <input type="text" data-id={table_elements[dynamic_id]}  data-inputname={_header_details[0].id}  value={table_elements[table_keys]} name={_header_details[0].id+`[${table_elements[dynamic_id]}]`}  onChange={(change_function)? change_function : (e)=>{}} /></div></td>;
              }
              return <td key={index}>{table_elements[table_keys]}</td>
            }
          }
          else{
            return <td key={index}></td>
          }
        

           
        })
      }
     return <tr key={222+'-sub-table'}>
       {select ?   <td> <input type="checkbox" name="table-select" onClick={(select_function) ? (e)=>select_function(e) : (e)=>{}} value={(table_elements.hasOwnProperty(selectname)) ? table_elements[selectname] : ''}/></td> : ''}
       {radio ?   <td> <input type="radio" name="table-select" value={(table_elements.hasOwnProperty(selectname)) ? table_elements[selectname] : ''}/></td> : ''}     
      {_table_elements
      }</tr>
    }
    
  
    render() {
      const {alldetails, currentdetails, currentPage, totalPages} = this.state;
      const totalDatas =  alldetails.length;
      if (totalDatas === 0) return null;
      
      return (
        <div className={(this.props.responsive) ? "table-responsive" : ''}>
        <h2>
          <strong className="text-secondary">{totalDatas}</strong>{" "}
        </h2>
        {currentPage && (
          <span className="current-page d-inline-block h-100 pl-4 text-secondary">
            Page <span className="font-weight-bold">{currentPage}</span> /{" "}
            <span className="font-weight-bold">{totalPages}</span>
          </span>
        )}
        <div className="table-responsive">
        <table className="table table-striped table-hover" >
          <thead>
              <tr>
                  {this.props.select?  <th style={{width: '50px'}}  > <input type="checkbox" name="table-select" vlaue='all'/></th> : ''}  
                  {this.props.radio?  <th  style={{width: '50px'}} > <input type="radio" name="table-select" vlaue='all'/></th> : ''}         
                  {this.props.table_header.map((list, index)=>{
                  
                      return <th style={{width: `${String(list.width)}`}} data-field={list.name} key={index}    onClick={(list.type=="click") ? (e)=>this.props.headerclick(e) : ()=>{}} >{list.name}</th>
                  })}
              </tr>
          </thead>
          <tbody>
              {currentdetails.map((list)=>{
                  return  this.propcess_table_body(list, this.props.table_header, this.props.select, this.props.selectname,this.props.radio, this.props.radioname, this.props.select_function, this.props.table_id, this.props.changefunction)}
              )}
              {(this.props.extratotal) ? <Fragment>
                <tr className="removestyles">
                  {(this.props.subtotal) ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> Sub Total : </td> <td> {this.props.subtotal} </td></Fragment>) : '' }
                </tr>
                 <tr  className="removestyles">
                {(this.props.subtotal) ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> SST Amount  : </td> <td> {this.props.sstamount} </td></Fragment>) : '' }
                </tr>
                 <tr  className="removestyles">
                {(this.props.subtotal) ? (<Fragment><td className={'text-right'} colSpan={this.props.colcount}> Grand Total  : </td> <td> {this.props.grandtotal} </td></Fragment>) : '' }
              </tr> </Fragment>: ''}
          </tbody>
        </table>
          <div className="row text-right">
              <div className="col-12">
              <Pagination
                  totalRecords={totalDatas}
                  pageLimit={10}
                  pageNeighbours={1}
                  onPageChanged={this.onPageChanged}
                />
              </div>
          </div>
        </div>
        </div>
      );
    }
  }

  export default BootstrapCustomTable;