import React from 'react';
import OutStandingPR from './OutStandingPR'
import POPendingApproval from './PO-Pending-Approval'
import OutStandingPO from './OutstandingPurchaseOrder'
import IncomingInvoice from './IncomingInvoice'

import IncomingDeliveryOrder from './IncomingDeliveryOrder'


class Dashboard extends React.Component {

    constructor(props) {
        var _token = localStorage.getItem('token');
        var _profile = localStorage.getItem('profile');
        localStorage.clear();
        if(_token){
            localStorage.setItem('token',_token);
        }

        if(_profile){
            localStorage.setItem('profile',_profile);
        }
       
        
       
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Make", field: "make"
            }, {
                headerName: "Model", field: "model"
            }, {
                headerName: "Price", field: "price"
            }],
            rowData: [{
                make: "Toyota", model: "Celica", price: 35000
            }, {
                make: "Ford", model: "Mondeo", price: 32000
            }, {
                make: "Porsche", model: "Boxter", price: 72000
            }]
        }
    }

    render() {
        return (
            <div className="container-fluid">
             
                    {/* <Contract/> */}
                    <h3>Dashboard</h3>
                    {/* <div style={{ height: '150px', width: '600px' }} className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            enableSorting
                            enableFilter>
                        </AgGridReact>
                    </div> */}
                    <OutStandingPR/>
                    <POPendingApproval></POPendingApproval>
                    <OutStandingPO/>
                    <IncomingInvoice/>
                    <IncomingDeliveryOrder/>
              
            </div>
        );
    }
}

export default Dashboard;