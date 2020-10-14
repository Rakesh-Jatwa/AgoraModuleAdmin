import React from 'react';
import Input from '../Component/From/Input';
import Password from '../Component/From/Password';
var _commonfunction  = {
    renderInput(props){
      return <Input {...props}/>;
    },

    renderInputPlain(props){
      return <Input {...props}/>;
    },

    renderPasswordPlain(props){
      return <Password {...props}/>;
    },

    async formatefile(file_list){
        let _details = new Array();
        if(file_list && file_list.length){
            _details =  await file_list.map((list,index)=>{
                return {
                    strFile : list.CDA_ATTACH_FILENAME,
                    strFile1 : list.CDA_HUB_FILENAME,
                    Text : list.CDA_FILESIZE,
                    ID : list.CDA_ATTACH_INDEX,
                }
            })
        }
        return _details;
    },

    portalMenu(){
      let _menu =  [
          {
              "name": "search",
              "children": [
                {
                  "name": "Contract Catalogue",
                  "url": "/contract-catalogue"
                },
                {
                  "name": "Buyer Catalogue",
                  "url": "/buyer_catalogue"
                },
              ]
          },
          {
            "name": "Request",
            "children": [
              {
                "name": "Purchase Request",
                "url": "/purchase-request"
              },
            ]
          },

          {
            "name": "Procure",
            "children": [
              {
                "name": "Purchase Order",
                "url": "/purchase_order"
              },
              {
                "name": "Goods Receive Note",
                "url": "/goods_receive_note"
              },
            ]
          },


          {
            "name": "Inventory Transfer",
            "children": [
              {
                "name": "Adjustment",
                "url": "/Adjustment"
              },
              {
                "name": "Inventory Listing",
                "url": "/Adjustment"
              },
              {
                "name": "MRS Approval",
                "url": "/Adjustment"
              },
              {
                "name": "Return Outward",
                "url": "/Adjustment"
              },
              {
                "name": "Return Inward Acknowledge",
                "url": "/Adjustment"
              },
              {
                "name": "Write Off",
                "url": "/Adjustment"
              },
            
            ]
          },
         
        ]
      
      return _menu;
    },

  


    modelData(){
      return[{
        description : "AP-Reinsurance Biz-Aon Re",
        code : "3320300000",
      },
      {
        description : "	AP-Reinsurance Biz-Aon Re",
        code : "3320300001",
      },
      {
        description : "AP-Reinsurance Biz-Aon Re",
        code : "3320300002",
      },
      {
        description : "	AP-Reinsurance Biz-Aon Re",
        code : "3320300003",
      }]
    },

  
}
export default _commonfunction;