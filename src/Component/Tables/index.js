import React,{Component} from 'react';
class Table extends Component{
    componentDidCatch(error, info){
    }
    render(){
        return <table className="table">
            <thead>
                <tr>
                    {(this.props.table_header.length) ?
                        (this.props.table_header.map((list,index)=>{
                            return <th key={index}>{list}</th>;
                    })) : ''}
                </tr>
            </thead>
            <tbody>{(this.props.table_body.length >=1)?(this.props.table_body.map((list,index)=>{return<tr key={index}><td>{list.first_name}</td><td>{list.last_name}</td><td>{list.mobile_number}</td><td>{list.email}</td><td><button onClick={((e)=>this.props.removetoken(e,list.email))}>Remove</button></td></tr>;})):<tr><td colSpan={this.props.table_header.length}> No User To List</td></tr>}</tbody>
        </table>
    }
}
export default Table;