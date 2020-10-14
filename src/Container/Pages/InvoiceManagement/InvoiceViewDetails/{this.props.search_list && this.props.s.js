{this.props.search_list && this.props.search_list.getUnInvoiceGRNLine &&

                      
                    
    <table className="table table-striped">
        <tr className="borderless-data text-right">
            <td colspan="8"></td>
            <td style={{width:'200px'}}><strong>Sub Total. :</strong></td>
            <td style={{width:'127px'}}>{ parseFloat(_sub_total).toFixed(2)}</td>
        </tr>
        <tr className="borderless-data text-right">
            <td colspan="8"></td>
            <td style={{width:'200px'}}><strong>SST Amount. :</strong></td>
            <td style={{width:'127px'}}>{parseFloat(_sub_gst).toFixed(2)}</td>
        </tr>
        <tr className="borderless-data text-right">
            <td colspan="8"></td>
            <td style={{width:'200px'}}><strong>Sub Total (incl. Tax). :</strong></td>
            <td style={{width:'127px'}}>{parseFloat(_sub_total_inc).toFixed(2)}</td>
        </tr>
        <tr className="borderless-data text-right">
            <td colspan="8"></td>
            <td style={{width:'200px'}}><strong>Shipping &amp; Handling :</strong></td>
            <td style={{width:'127px'}}><input style={{width:'100%'}} type="text" className="text-right" onChange={(e)=>{
               
            }} defaultValue={(this.state.products && this.state.products.BALSHIP) ? this.state.products.BALSHIP : '0.00'} /></td>
        </tr>
        <tr>
            <td colspan="8"></td>
            <td className="borderless-data-top text-right"><strong>Grand Total :</strong></td>
        <td className="borderless-data-top text-right">{parseFloat(_total)}</td>
        </tr>
        </table>
        }