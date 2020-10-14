import React, {Component, Fragment} from 'react';
class TotalGridHorizontal extends Component {
    state = {
      width_1 : '50%',
      width_2:'100%',
      wdith_3 : 0
    }
    componentDidMount(){
        let _initial_width = 0;
        let _width_1 =  0;
        let _width_2 = 0;
        let _wdith_3 = 0;
        this.props.table_header.forEach((element, index) => {
          let _temp_total = element.width.replace ( /[^\d.]/g, '' )
            _initial_width += (element.width) ? parseFloat(_temp_total) : 0;
            if(index==this.props.text_grid){
                _width_1 = _initial_width
                _wdith_3 = element.width.replace ( /[^\d.]/g, '' )
                _wdith_3 = parseInt(_wdith_3)
                _initial_width  = 0
              
            }
            if(index==(this.props.table_header.length-1)){
              _width_2 = _initial_width
              _initial_width  = 0
            }
        });
        console.log('width_1', _width_1,_width_2, _wdith_3)
        this.setState({
            width_1 : (this.props.adjust) ? _width_1 : _width_1,
            width_2 :  (this.props.adjust) ? _width_2 : _width_2,
            width_3:_wdith_3
        })

     
    }

    build_tobody = (details) =>{
        let _tmp_div = new Array();
        for(let i=0;i<this.props.body_loop; i++){
          if(this.props.body_type[i]=='text'){
            _tmp_div.push(<tr>
                <td style={{textAlign:'right'}}> {(this.props.body_text.hasOwnProperty(i)) ? details.body_text[i] : ''} </td>
                <td  className="td_right"  style={{textAlign:'right'}}> {(this.props.body_value.hasOwnProperty(i)) ? this.props.body_value[i] : ''} </td>
                <td  className="td_right"  style={{textAlign:'right'}}> {(this.props.body_value.hasOwnProperty(i)) ? this.props.body_value[i+1] : ''} </td>
                <td className="td_left"  style={{textAlign:'right'}}></td>
            </tr>)
          }
          else if(this.props.body_type[i]=='input'){
              console.log('this.props.body_value[i]',this.props.body_value[i])
            _tmp_div.push(<tr><td style={{textAlign:'right'}}> {(this.props.body_text.hasOwnProperty(i)) ? details.body_text[i] : ''} </td><td className="td_right"   style={{textAlign:'right'}}><input className="shipping_charge" type="text" name='shipping_charge' onChange={(e)=>this.props.HandleShippingCharge(e)} defaultValue={(this.props.body_value.hasOwnProperty(i) && this.props.body_value[i]!='') ? this.props.body_value[i] : '0.00'} style={{width:`${this.state.width_3-10}px`}} /> </td><td className="td_left"  style={{textAlign:'right'}}></td></tr>)
          }
          
        }

       
        return _tmp_div;
    }

    render(){

      return  <div className="react-bs-table-container">
        <div className="react-bs-table react-bs-table-bordered">
          <div className="react-bs-container-header table-header-wrapper">
      <table className="table_details table table-hover table-bordered table-stripe table-head-none">
        <thead>
          <tr>
            {(this.props.table_header) ? this.props.table_header.map((list, index)=>{
              if(index==this.props.text_grid){
                if(this.props.hasOwnProperty('adjust_first_row') && this.props.adjust_first_row){
                  return   <td style={{textAlign:'right', width:(this.state.width_1 - this.props.adjust_first_row)}}></td>
                }
                else{
                  return   <td style={{textAlign:'right', width:(this.state.width_1)}}></td>
                }
                
              }

              if(index==this.props.total){
                return  <Fragment><td style={{textAlign:'right', width: this.state.width_3  - this.props.adjust}}></td><td style={{textAlign:'right', width: this.state.width_3  - this.props.adjust}}></td></Fragment>
              }
                
            }) : <td>Loading...</td>}
            <td style={{textAlign:'right', width:this.state.width_2-this.state.width_3 }}></td>
          </tr>
        </thead>
        <tbody>
           
              {this.build_tobody(this.props)}
            
        </tbody>
      </table>
      </div>
      </div>
      </div>
    }
}
export default TotalGridHorizontal;