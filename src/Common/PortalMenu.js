var _menu =[
    {
        "name": "search",
        "active":true,
        "children": [
          {
            "name": "Contract Catalogue",
            "url": "/contract-catalogue"
          },
          {
            "name": "Buyer Catalogue",
            "url": "/buyer-catalogue"
          }
        ]
    },
    {
      "name": "Request",
      "active":false,
      "children": [
        {
          "name": "Purchase Request",
          "url": "/purchase-request"
        }
      ]
    },

    {
      "name": "Procure",
      "active":false,
      "children": [
        {
          "name": "Purchase Order",
          "url": "/purchase_order"
        },
        {
          "name": "Goods Receive Note",
          "url": "/issueGrn"
        }
      ]
    },


    {
      "name": "Inventory Transfer",
      "active":false,
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
          "url": "/Adjustment",
        }
      
      ]
    },


    {
      "name": "QC/Verify",
      "active":false,
      "children": [
        {
          "name": "Status Update/Listing",
          "url": "status_update_listing"
        }
      
      ]
    },


    {
      "name": "Maintenance / Setup",
      "active":false,
      "children": [
        {
          "name": "Location Maint./Setup",
          "url": "location_main_setup"
        },
        {
          "name": "Personal Setting",
          "url": "personal_setting"
        }
      
      ]
    }


  ]

  export default _menu;