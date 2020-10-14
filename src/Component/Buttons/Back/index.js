import React,{Component} from 'react'

class BackButton extends Component{
   
    render(){
        console.log('this.props.goBack',this.props)
        return <div>
             {(this.props.back_data) ? <div className="col-lg-auto col-md">
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.history.push({
                    pathname : (this.props.redirect_to_page ) ? this.props.redirect_to_page : '',
                    redirect_to_tab : (this.props.redirect_to_tab ) ? this.props.redirect_to_tab : '',
                    redirect_to_page : (this.props.redirect_to_page ) ? this.props.redirect_to_page : '',
                })}>Back</button>
            </div> :  <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>(this.props.history && this.props.history.goBack) ? this.props.history.goBack() : {}} >Back</button></div>}
        </div>
    }
}

export default BackButton
