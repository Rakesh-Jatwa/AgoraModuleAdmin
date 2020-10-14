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

let IncomingDeliveryOrder = (props) => {

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
        [{"POM_PO_Index":1527,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000001","DOM_S_Ref_No":"18-39977","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":522,"DOM_PO_Index":1527,"POM_B_Coy_ID":"PAMB","DOM_Created_Date":"2019-02-14T03:03:43.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-14T03:03:43.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2019-01-24T09:05:18.000Z","POM_PO_No":"PAMB/PO/1801511","DOM_D_ADDR_CODE":"DA023","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"},{"POM_PO_Index":518,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000002","DOM_S_Ref_No":"18-43342","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":523,"DOM_PO_Index":518,"POM_B_Coy_ID":"pamb","DOM_Created_Date":"2019-02-14T03:10:15.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-14T03:10:15.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2018-12-18T11:15:37.000Z","POM_PO_No":"PAMB/PO/1800503","DOM_D_ADDR_CODE":"DA001","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"},{"POM_PO_Index":1555,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000003","DOM_S_Ref_No":"19-02922","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":524,"DOM_PO_Index":1555,"POM_B_Coy_ID":"pamb","DOM_Created_Date":"2019-02-14T03:13:17.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-14T03:13:17.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2019-01-24T08:07:53.000Z","POM_PO_No":"PAMB/PO/1801539","DOM_D_ADDR_CODE":"DA042","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"},{"POM_PO_Index":1536,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000004","DOM_S_Ref_No":"19-02907","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":525,"DOM_PO_Index":1536,"POM_B_Coy_ID":"pamb","DOM_Created_Date":"2019-02-14T03:14:34.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-14T03:14:34.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2019-01-24T05:45:11.000Z","POM_PO_No":"PAMB/PO/1801520","DOM_D_ADDR_CODE":"DA016","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"},{"POM_PO_Index":1058,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000005","DOM_S_Ref_No":"19-02903","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":526,"DOM_PO_Index":1058,"POM_B_Coy_ID":"PAMB","DOM_Created_Date":"2019-02-14T03:19:31.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-14T03:19:31.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2019-01-10T11:29:20.000Z","POM_PO_No":"PAMB/PO/1801043","DOM_D_ADDR_CODE":"DA008","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"},{"POM_PO_Index":635,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000006","DOM_S_Ref_No":"18-42007","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":527,"DOM_PO_Index":635,"POM_B_Coy_ID":"PAMB","DOM_Created_Date":"2019-02-14T03:24:14.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-14T03:24:14.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2018-12-26T09:53:53.000Z","POM_PO_No":"PAMB/PO/1800620","DOM_D_ADDR_CODE":"DA023","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"},{"POM_PO_Index":634,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000007","DOM_S_Ref_No":"18-41462","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":528,"DOM_PO_Index":634,"POM_B_Coy_ID":"PAMB","DOM_Created_Date":"2019-02-14T03:27:19.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-14T03:27:19.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2018-12-26T09:53:29.000Z","POM_PO_No":"PAMB/PO/1800619","DOM_D_ADDR_CODE":"DA023","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"},{"POM_PO_Index":1697,"POM_S_Coy_Name":"PACIFIC OFFICE (M) SDN BHD","DOM_DO_NO":"POS/DO/00000008","DOM_S_Ref_No":"19-03235","DOM_S_Coy_ID":"339201P160","DOM_DO_Index":590,"DOM_PO_Index":1697,"POM_B_Coy_ID":"PAMB","DOM_Created_Date":"2019-02-19T03:47:01.000Z","DOM_Created_By":"JACQUELINEa27","DOM_DO_Date":"2019-02-19T03:47:12.000Z","Status_Desc":"Invoiced","DOM_DO_Status":6,"POM_PO_Date":"2019-01-29T03:25:53.000Z","POM_PO_No":"PAMB/PO/1801668","DOM_D_ADDR_CODE":"DA022","CM_COY_NAME":"Prudential Assurance Malaysia Berhad"}]
    );

    const [columnsList, setColumnsList] = useState([
        {
            dataField: 'DOM_DO_NO',
            text: 'DO Number',
            sort: true,
             formatter: (cellContent, row) => {
                return (
                    <Button size="sm" variant="info"  >{row.DOM_DO_NO}</Button>
                )
            }, 
        },
        {
            dataField: 'DOM_Created_Date',
            text: 'DO Date',
            sort: true,
            /*  formatter: (cellContent, row) => {
                 return (
                     row.PRM_CREATED_DATE !== null ? moment(row.PRM_CREATED_DATE).format('DD/MM/YYYY') : ''
                 )
             }, */
        },
        {
            dataField: 'POM_PO_No',
            text: 'PO Number',
            sort: true,
            /*  formatter: (cellContent, row) => {
                 return (
                     row.PRM_SUBMIT_DATE !== null ? moment(row.PRM_SUBMIT_DATE).format('DD/MM/YYYY') : ''
                 )
             }, */
        },
        {
            dataField:'POM_PO_Date',
            text: 'PO Date',
            sort: true,
            /* formatter: (cellContent, row) => {
                return (
                    row.PRM_SUBMIT_DATE !== null ? moment(row.PRM_SUBMIT_DATE).format('DD/MM/YYYY') : ''
                )
            }, */
        },
        {
            dataField: 'POM_S_Coy_Name',
            text: 'Vendor Name',
            sort: true,
        }
        
    ]);

    useEffect(() => {

    },[])


   

    return (

        
        <div className="row">

            <div className="container-fluid">
                <div className="d-flex bg-info text-white p-1 mt-2">
                    <p>Incoming Delivery Order </p>
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
                    keyField="PRM_PR_Index" 
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

export default IncomingDeliveryOrder
