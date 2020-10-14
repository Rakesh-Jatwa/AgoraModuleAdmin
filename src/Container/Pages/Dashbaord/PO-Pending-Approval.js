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

let POPendingApproval = (props) => {

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

      const [OutStandingPRList, setOutStandingPRList] = useState(
        [{"PRM_PR_Index":312,"PRM_PR_No":"PAMB/PR/1800286","PRM_S_Coy_ID":null,"PRM_PR_Date":null,"PRM_SUBMIT_DATE":"2019-07-09T10:32:55.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":"Prudential Assurance Malaysia Berhad","PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":8,"STATUS_DESC":"Rejected By","PR_AMT":1800,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":null,"PRM_STATUS_CHANGED_BY":"PSA266016","NAME":"CHEW MENG MEI","PRM_CREATED_DATE":"2019-07-09T10:27:41.000Z","PRM_PR_TYPE":"CC","PO_NO":null,"PRM_URGENT":"0"},{"PRM_PR_Index":313,"PRM_PR_No":"PAMB/PR/1800287","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-11T05:25:15.000Z","PRM_SUBMIT_DATE":"2019-07-09T10:43:19.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":null,"PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":5,"STATUS_DESC":"Converted to PO","PR_AMT":1800,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":7133,"PRM_STATUS_CHANGED_BY":"PSA266016","NAME":"CHEW MENG MEI","PRM_CREATED_DATE":"2019-07-09T10:35:22.000Z","PRM_PR_TYPE":"CC","PO_NO":"PAMB/PO/1805364","PRM_URGENT":"0"},{"PRM_PR_Index":314,"PRM_PR_No":"PAMB/PR/1800288","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-09T11:12:54.000Z","PRM_SUBMIT_DATE":"2019-07-09T10:51:57.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":null,"PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":5,"STATUS_DESC":"Converted to PO","PR_AMT":1800,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":7130,"PRM_STATUS_CHANGED_BY":"PSA278119","NAME":"EDWARD KOK","PRM_CREATED_DATE":"2019-07-09T10:35:33.000Z","PRM_PR_TYPE":"CC","PO_NO":"PAMB/PO/1805361","PRM_URGENT":"0"},{"PRM_PR_Index":315,"PRM_PR_No":"PAMB/PR/1800289","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-10T07:51:24.000Z","PRM_SUBMIT_DATE":"2019-07-10T07:42:43.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":"Prudential Assurance Malaysia Berhad","PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":5,"STATUS_DESC":"Converted to PO","PR_AMT":0,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":null,"PRM_STATUS_CHANGED_BY":"PSA278119","NAME":"EDWARD KOK","PRM_CREATED_DATE":"2019-07-10T06:31:54.000Z","PRM_PR_TYPE":"","PO_NO":null,"PRM_URGENT":"1"},{"PRM_PR_Index":317,"PRM_PR_No":"PAMB/PR/1800291","PRM_S_Coy_ID":null,"PRM_PR_Date":null,"PRM_SUBMIT_DATE":null,"PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":"Prudential Assurance Malaysia Berhad","PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":9,"STATUS_DESC":"Void","PR_AMT":0,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":null,"PRM_STATUS_CHANGED_BY":"REQ264095","NAME":"DOREEN YEE","PRM_CREATED_DATE":"2019-07-11T04:15:57.000Z","PRM_PR_TYPE":"","PO_NO":null,"PRM_URGENT":"1"},{"PRM_PR_Index":318,"PRM_PR_No":"PAMB/PR/1800292","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-11T04:33:17.000Z","PRM_SUBMIT_DATE":"2019-07-11T04:21:23.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":null,"PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":99,"STATUS_DESC":"Approved","PR_AMT":0,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":null,"PRM_STATUS_CHANGED_BY":"PSA278119","NAME":"EDWARD KOK","PRM_CREATED_DATE":"2019-07-11T04:20:34.000Z","PRM_PR_TYPE":"","PO_NO":null,"PRM_URGENT":"0"},{"PRM_PR_Index":319,"PRM_PR_No":"PAMB/PR/1800293","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-12T05:07:53.000Z","PRM_SUBMIT_DATE":"2019-07-12T05:04:48.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":"Prudential Assurance Malaysia Berhad","PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":5,"STATUS_DESC":"Converted to PO","PR_AMT":168,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":7137,"PRM_STATUS_CHANGED_BY":"PSA278119","NAME":"EDWARD KOK","PRM_CREATED_DATE":"2019-07-12T05:03:55.000Z","PRM_PR_TYPE":"CC","PO_NO":"PAMB/PO/1805368","PRM_URGENT":"0"},{"PRM_PR_Index":320,"PRM_PR_No":"PAMB/PR/1800294","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-12T05:44:54.000Z","PRM_SUBMIT_DATE":"2019-07-12T05:42:48.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":"Prudential Assurance Malaysia Berhad","PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":5,"STATUS_DESC":"Converted to PO","PR_AMT":120,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":7138,"PRM_STATUS_CHANGED_BY":"PSA278119","NAME":"EDWARD KOK","PRM_CREATED_DATE":"2019-07-12T05:42:38.000Z","PRM_PR_TYPE":"CC","PO_NO":"PAMB/PO/1805369","PRM_URGENT":"0"},{"PRM_PR_Index":321,"PRM_PR_No":"PAMB/PR/1800295","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-12T05:56:49.000Z","PRM_SUBMIT_DATE":"2019-07-12T05:56:07.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":"Prudential Assurance Malaysia Berhad","PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":5,"STATUS_DESC":"Converted to PO","PR_AMT":18,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":7139,"PRM_STATUS_CHANGED_BY":"PSA278119","NAME":"EDWARD KOK","PRM_CREATED_DATE":"2019-07-12T05:56:02.000Z","PRM_PR_TYPE":"CC","PO_NO":"PAMB/PO/1805370","PRM_URGENT":"0"},{"PRM_PR_Index":322,"PRM_PR_No":"PAMB/PR/1800296","PRM_S_Coy_ID":null,"PRM_PR_Date":"2019-07-12T09:52:48.000Z","PRM_SUBMIT_DATE":"2019-07-12T09:45:39.000Z","PRM_CURRENCY_CODE":null,"PRM_S_COY_NAME":"Prudential Assurance Malaysia Berhad","PRM_REQ_NAME":"DOREEN YEE","PRM_PR_STATUS":5,"STATUS_DESC":"Converted to PO","PR_AMT":120,"PRM_RFQ_INDEX":null,"PRM_PO_INDEX":7140,"PRM_STATUS_CHANGED_BY":"PSA278119","NAME":"EDWARD KOK","PRM_CREATED_DATE":"2019-07-12T09:45:28.000Z","PRM_PR_TYPE":"CC","PO_NO":"PAMB/PO/1805371","PRM_URGENT":"0"}]
    );

    const [columnsList, setColumnsList] = useState([
        {
            dataField: 'PRM_PR_No',
            text: 'PO Number',
            sort: true,
            formatter: (cellContent, row) => {
                return (
                    <Button size="sm" variant="info" >{row.PRM_PR_No}</Button>
                )
            },
        },
        {
            dataField: 'PRM_CREATED_DATE',
            text: 'Submitted Date',
            sort: true,
            /*  formatter: (cellContent, row) => {
                 return (
                     row.PRM_CREATED_DATE !== null ? moment(row.PRM_CREATED_DATE).format('DD/MM/YYYY') : ''
                 )
             }, */
        },
        {
            dataField: 'PRM_SUBMIT_DATE',
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
            isDummyField: true,
            sort: true,
            /* formatter: (cellContent, row) => {
                return (
                    row.PRM_SUBMIT_DATE !== null ? moment(row.PRM_SUBMIT_DATE).format('DD/MM/YYYY') : ''
                )
            }, */
        },
        {
            dataField: 'STATUS_DESC',
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
                    <p>PO (Pending Approval) </p>
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

export default POPendingApproval
