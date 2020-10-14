import React, {Component} from 'react';
class Input extends Component{
    render(){
        return <div className="form-group">
        <input  {...this.props.input}  className="form-control" placeholder={this.props.placeholder} name={this.props.input.name} id={this.props.input.name} readOnly={this.props.readOnly}/>
         <div className="text-danger">
             {this.props.meta.touched && ((this.props.meta.error && <span>{this.props.meta.error}</span>) || (this.props.meta.warning && <span>{this.props.meta.warning}</span>))}
         </div>
     </div>;
    }
}

export default Input;