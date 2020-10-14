import React, {Component, Fragment} from 'react';
class TableButton extends Component {
    constructor(props) {
        super(props);
        
        this.build_table_body = this.build_table_body.bind(this)
        
    }
 
    build_table_body(list, index){
    console.log('list==========================>',list)
        let {table_header, table_body} = this.props;
           let _temp_details =  table_header.map((list_sub, list_index)=>{
               if(list_sub.type=="checked"){
                    return <td className="table-select-center">
                        <input type="checkbox" 
                         name={`menu[${list.menuId}]`} 
                         value={list[list_sub.id]} 
                          onClick={(e)=>this.handle(e.target, list_sub.id, list.menuId)}
                        // onClick ={(e)=>{this.props.handleupdate(target, list, menu)}}
                         checked={(list[list_sub.id] === 'Y')} 
                         disabled={list.allowInsert !== 'Y' && list.allowUpdate !== 'Y' && list.allowDelete !== 'Y' && list.allowView !== 'Y'}                        
                        />
                         </td>
                }
                else{
                    return <td className="table-select-text">{list[list_sub.id]}</td>
                }
               
        })
        return  <tr className={(list.menuParent == list.menuLevel) ? 'bold-row' : ''}>
                    <td>
                        <input type="checkbox"
                            name={`menu[${list.menuId}]`}
                            onClick={(e)=>{this.onCheckBoxClick(e, list)}} 
                            checked={
                                (list.allowInsert ==='Y' )||(list.allowInsert!=='Y' )&&
                                (list.allowUpdate ==='Y' )|| (list.allowUpdate!=='Y' ) &&
                                (list.allowDelete ==='Y')|| (list.allowDelete ==='Y') &&
                                (list.allowView ==='Y' )|| (list.allowView ==='Y' )
                            }                 
                       />
                    </td>
                    {_temp_details}
                </tr>
    }
    onCheckBoxClick = (e, list) => {
       
        console.log(list);
        if(list.menuParent == list.menuLevel){
        
            this.props.handlemainheader(e.target, list.menuParent);
        } else {
            
            this.props.handlerowheader(e.target, list.menuId)
        }
    }
  
    handle=(target,list ,menu)=>{
        this.props.handleupdate(target, list, menu)
    } 
    render() {
            const {table_header, table_body} = this.props;
        return (
            <Fragment>
                <div className="row mt-2">
                    <div className="col-12 mt-3">
                        <table className="table">
                            <thead className="">
                                
                                <tr>
                                    <td style={{width:'46px'}}></td>
                                    {table_header.map((list,index)=>{
                                        return <td>{list.name}</td>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {table_body.map((list,index)=>{
                                    return  this.build_table_body(list, index)
                                })} 
                            </tbody>
                        </table>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default TableButton