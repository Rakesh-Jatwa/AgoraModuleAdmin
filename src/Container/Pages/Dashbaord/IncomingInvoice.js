import React, { useState, useEffect } from 'react'
import { Field, Form, Formik } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import { Button, Table } from 'react-bootstrap';
import Datetime from 'react-datetime';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const { SearchBar } = Search;

var moment = require('moment');

let IncomingInvoice = (props) => {

    const options = {
        paginationSize: 4,
        pageStartIndex: 1,
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        sizePerPageList: [4] // A numeric array is also available. the purpose of above example is custom the text
      };

     const [OutStandingPRList, setOutStandingPRList] = useState([{"IM_INVOICE_NO":"POS/INV/00000002","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1800503","POM_B_COY_ID":"pamb","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":208.65},{"IM_INVOICE_NO":"POS/INV/00000003","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1800619","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":981.25},{"IM_INVOICE_NO":"POS/INV/00000004","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1800620","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":25},{"IM_INVOICE_NO":"POS/INV/00000005","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1801043","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":1929.5},{"IM_INVOICE_NO":"POS/INV/00000006","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1801511","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":1422},{"IM_INVOICE_NO":"POS/INV/00000007","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1801520","POM_B_COY_ID":"pamb","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":351.45},{"IM_INVOICE_NO":"POS/INV/00000008","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1801539","POM_B_COY_ID":"pamb","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":470.75},{"IM_INVOICE_NO":"POS/INV/00000009","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1801668","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":177.75},{"IM_INVOICE_NO":"POS/INV/00000010","IM_CREATED_ON":"26/02/2019","POM_PO_NO":"PAMB/PO/1801684","POM_B_COY_ID":"pamb","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":730.6},{"IM_INVOICE_NO":"POS/INV/00000018","IM_CREATED_ON":"06/03/2019","POM_PO_NO":"PAMB/PO/1801695","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":592.5},{"IM_INVOICE_NO":"POS/INV/00000016","IM_CREATED_ON":"06/03/2019","POM_PO_NO":"PAMB/PO/1801698","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":414.35},{"IM_INVOICE_NO":"POS/INV/00000015","IM_CREATED_ON":"01/03/2019","POM_PO_NO":"PAMB/PO/1801740","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":382.6},{"IM_INVOICE_NO":"POS/INV/00000014","IM_CREATED_ON":"01/03/2019","POM_PO_NO":"PAMB/PO/1801765","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":643.6},{"IM_INVOICE_NO":"POS/INV/00000057","IM_CREATED_ON":"18/04/2019","POM_PO_NO":"PAMB/PO/1801857","POM_B_COY_ID":"PAMB","POM_S_COY_ID":"339201P160","IM_INVOICE_STATUS":2,"POM_BILLING_METHOD":"GRN","STATUS_DESC":"Pending Approval","CM_COY_NAME":"Prudential Assurance Malaysia Berhad","POM_CURRENCY_CODE":"MYR","IM_INVOICE_TOTAL":784.79}]);

    const [columnsList, setColumnsList] = useState([
        {
            dataField: 'IM_INVOICE_NO',
            text: 'Invoice Number',
             sort: true,
            formatter: (cellContent, row) => {
                return (
                    <Button size="sm" variant="info"  >{row.IM_INVOICE_NO}</Button>
                )
            }, 
        },
        {
            dataField: 'IM_CREATED_ON',
            text: 'Due Date ',
            sort: true,
            /*  formatter: (cellContent, row) => {
                 return (
                     row.PRM_CREATED_DATE !== null ? moment(row.PRM_CREATED_DATE).format('DD/MM/YYYY') : ''
                 )
             }, */
        },
        {
            dataField: 'CM_COY_NAME',
            text: 'Vendor Name',
            sort: true,
            /*  formatter: (cellContent, row) => {
                 return (
                     row.PRM_SUBMIT_DATE !== null ? moment(row.PRM_SUBMIT_DATE).format('DD/MM/YYYY') : ''
                 )
             }, */
        },
        {
            text: 'Currency',
            dataField:'POM_CURRENCY_CODE',
            sort: true,
            /* formatter: (cellContent, row) => {
                return (
                    row.PRM_SUBMIT_DATE !== null ? moment(row.PRM_SUBMIT_DATE).format('DD/MM/YYYY') : ''
                )
            }, */
        },
        {
            dataField: 'IM_INVOICE_TOTAL',
            text: 'Amount',
            sort: true,
        }
        
    ]);

    useEffect(() => {

    },[])


   

    return (
        <div className="row">

            <div className="container-fluid">
                <div className="d-flex bg-info text-white p-1 mt-2">
                    <p>Incoming Invoice   </p>
                </div>
                {/* <ToolkitProvider
                    bootstrap4
                    keyField="PRM_PR_No"
                    data={OutStandingPRList}
                    columns={columnsList}
                    
                > */}
                    {/* {props => ( */}
                        <div>
                            {/* <SearchBar
                                {...props.searchProps}
                                style={{ width: "400px", height: "40px" }}
                            /> */}

                            <BootstrapTable 
                    keyField="PRM_PR_No"
                                {...props.baseProps}
                                pagination={paginationFactory(options)}
                               
                                loading={true}
                                 data={OutStandingPRList}
                                columns={columnsList}/>
                        </div>
                  
                {/* </ToolkitProvider> */}


            </div>
        </div>
    )

}

export default IncomingInvoice
