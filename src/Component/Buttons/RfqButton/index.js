import React,{Component} from 'react'
class RfqButton extends Component{
    render(){
        console.log('qwqwe', this.props)
        console.log('RfqButton', { vcomid :  this.props.POM_S_COY_ID,
            rfq_id :  this.props.POM_RFQ_INDEX,
            rfq_no :  this.props.RM_RFQ_No,})
        return (this.props.RFQ_ATTACHEMENT==1) ? <span className="rfq_attachment" onClick={()=>this.props.history.push({
                    pathname : (this.props.pathname ) ? this.props.pathname : '',
                    datas : this.props.datas,
                    redirect_to_tab : (this.props.redirect_to_tab ) ? this.props.redirect_to_tab : '',
                    redirect_to_page : (this.props.redirect_to_page ) ? this.props.redirect_to_page : '',
                })}>Q</span>: ''
    }
}


export default RfqButton
