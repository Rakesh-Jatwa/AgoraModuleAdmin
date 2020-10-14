import {
  GetPurchaserCatalogueData,
  PurchaserCatalogue,
} from "../../Actions/SysAdmin";

const base_url = process.env.REACT_APP_API_URL;
const axios = require("axios");
const _token = localStorage.getItem("token");

const getToken = () => {
  return localStorage.getItem("token");
}; 

const getCompanyDetails = () => {
  var detail = {
    id: JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"],
    role: JSON.parse(localStorage.getItem("profile"))["ROLE_NAME"]
  }
  return detail
};






// ABHI
const PurchaseCateSearchData = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url + "sysAdmin/purchaserCatalogueDropDown",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const AddPurchaseCatalogue = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url + "sysAdmin/addPurchaserCatalogue",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const AddAccountData = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/FillGLCode", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};

const AddCategoryCode = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/itemMaster/add/getCategoryCode", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};

const Adduom = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url + "sysAdmin/addPurchaserCatalogue",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

// const AddAccountData = (values) => {
//   console.log('values', values);
//   return axios
//     .post(base_url + 'sysAdmin/FillGLCode', {
//       ...values
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// const AddCategoryCode = (values) => {
//   console.log('values', values);
//   return axios
//     .post(base_url + 'sysAdmin/itemMaster/add/getCategoryCode', {
//       ...values
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// const Adduom = (values) => {
//   console.log('values', values);
//   return axios
//     .post(base_url + 'sysAdmin/itemMaster/add/getUom', {
//       ...values
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

const AddSearchResult = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/itemMaster/itemAssignment/assignItemSearch", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};
const CommoditySearchResult = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/commodity/search", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};

const searchVendorCompany = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/itemMaster/conCatMaint/conCat/add/searchVendorCompany", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};

const ContractCatalogueExtend = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/contractCatalogue/extend", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};
const ContractCatalogueViewItem = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/contractCatalogue/viewItem", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};
const ContractCatalogueDelete = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/contractCatalogue/delete", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};
const ContractCatalogueAddModify = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/contractCatalogue/save", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};
const ContractCatalogueSearch = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/contractCatalogue/search", {
      ...values,
    })
    .then((response) => {
      return response.data;
    });
};

const GetPurchaserCatalogue = (values) => {
  let companyID = JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"];
  return axios
    .post(
      base_url + "sysAdmin/getPurchaserCatalogueData",
      {
        companyId: companyID,
        cboCatalogueBuyer: values,
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const PurchaserCatalogueData = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url + "sysAdmin/purchaserCatalogue/getData",
      {
        ...values,
        catalogueIndex: 0,
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const ContractCatAssignItem = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/itemAssignment/assignItem",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const ContractCatGetAvailablePurchasers = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/userAssignment/getAvailablePurchasers",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};
// TODO
const ContractCatGetPurchasers = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/userAssignment/getAvailablePurchasers",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};
const ContractCAtassignMultipleUsersGetData = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/userAssignment/assignMultipleUsersGetData",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const ContractCatAssignMultipleUsersSave = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/userAssignment/assignMultipleUsersSave",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const ContractCatGetContractRefNo = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/itemAssignment/getContractRefNo",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};
const ContractCatViewItem = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/contractCatalogue/viewItem", values, {
      method: "POST",
      // policyData: values,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: getToken(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

const ContractCatGetCurrency = (values) => {
  console.log("values", values);
  return axios
    .post(base_url + "sysAdmin/getCurrency", values, {
      method: "POST",
      // policyData: values,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: getToken(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

const ContractCatUserAssignmentGetDropDownList = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/userAssignment/getDropDownList",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const ContractCatUserAssignmentgetDropDownData = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/userAssignment/getDropDownData",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};
const ContractCatUserAssignmentAssignUsers = (values) => {
  console.log("values", values);
  return axios
    .post(
      base_url +
        "sysAdmin/itemMaster/contractCatMaint/userAssignment/assignUsers",
      values,
      {
        method: "POST",
        // policyData: values,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};
// ABHI

const UpdatePurchaseCatalogueData = (values) => {
  return axios
    .post(
      base_url + "sysAdmin/updatePurchaserCatalogue",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const DeletePurchaseCatalogueData = (values) => {
  return axios
    .post(
      base_url + "sysAdmin/deletePurchaserCatalogue",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const SaveItemDetails = (data) => {
  return axios
    .post(
      base_url + "sysAdmin/assignItem",
      { items: data },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const DeleteItemPurchaseCatalogueData = (values) => {
  return axios
    .post(
      base_url + "sysAdmin/itemMaster/purchaserCatalogue/itemAssignment/delete",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const GetPurchaserAssignmentData = (values) => {
  return axios
    .post(
      base_url + "sysAdmin/purchaserAssignment/getDropDownData",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const saveItemForPurchaser = (values) => {
  return axios
    .post(
      base_url + "sysAdmin/purchaserAssignment/assignPurchasers",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};


const getAdduom = (values) => {
  console.log('values', values);
  return axios
    .post(base_url + 'sysAdmin/itemMaster/add/getUom', {
      ...values
    })
    .then((response) => {
      return response.data;
    });
};

const AddUpdateItemMaster = (values) =>{
  return axios.post(base_url+'sysAdmin/itemMaster/addUpdate',values,{
      method: 'POST',
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization" : getToken(),
      }
  }).then((response)=> { return response.data })
}

const GetCommodity = (values) =>{
  return axios.post(base_url+'sysAdmin/commodity/search',values,{
      method: 'POST',
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization" : getToken(),
      }
  }).then((response)=> { return response.data })
}

const ActivateDeactivateAdd = (values) =>{
  return axios.post(base_url+'sysAdmin/ItemListing/activateDeactivate/UpdBuyerProductMstr',values,{
      method: 'POST',
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization" : getToken()
      }
  }).then((response)=> { return response.data })
}

const GetItemById= (values) =>{
  return axios.post(base_url+'sysAdmin/itemMaster/itemMasterMaint/itemListing/getIteamById',values,{
      method: 'POST',
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization" : getToken()
      }
  }).then((response)=> { return response.data })
}

const DownloadAuditFile = (values) => {
  return axios(base_url+'sysAdmin/itemMaster/itemMasterAudit', {
      method: 'POST',
      data: values,
      responseType: 'blob',
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
  }
  }).then((response)=> { return response.data })
}

const GetGlCategorySearchCodeData = (values) =>{
  return axios.post(base_url + 'sysAdmin/searchGlCode',
      {...values},
      {
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken()
        }
      }
  )
  .then ( response => {
    return response.data
  });
}

const AddGLCategoryCodeData = (value) => {
  return axios.post(base_url + 'sysAdmin/addGlCode',
      {...value},
      {
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken()
        }
      }
    )
    .then ( response => {
    return response.data
  });
}

const UpdateGlCategoryCode = (value) => {
  return axios.post(base_url + 'sysAdmin/updateGlCode',
      {...value},
      {
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken()
        }
      }
    )
    .then ( response => {
    return response.data
  });
}

const DeleteGlCategoryCode = (value) => {
  return axios.post(base_url + 'sysAdmin/deleteGlCode',
      {...value},
      {
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization" : getToken()
        }
      }
    )
    .then ( response => {
    return response
  });
}


const DownloadOutstandingInvoice = (values) => {
  return axios(base_url+'sysAdmin/report/reports/outstandingInvoice', {
      method: 'POST',
      data: values,
      responseType: 'blob',
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
  }
  }).then((response)=> { return response.data })
}

const DownloadOutstandingPO = (values) => {
  return axios(base_url+'sysAdmin/report/reports/outstandingPo', {
      method: 'POST',
      data: values,
      responseType: 'blob',
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
  }
  }).then((response)=> { return response.data })
}

const DownloadOverdueInvoice = (values) => {
  return axios(base_url+'sysAdmin/report/reports/overdueInvoice', {
      method: 'POST',
      data: values,
      responseType: 'blob',
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
  }
  }).then((response)=> { return response.data })
}

const DownloadOverduePO = (values) => {
  return axios(base_url+'sysAdmin/report/reports/overduePo', {
      method: 'POST',
      data: values,
      responseType: 'blob',
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
  }
  }).then((response)=> { return response.data })
}

const DownloadPODetails = (values) => {
  return axios(base_url+'sysAdmin/report/reports/poDetails', {
      method: 'POST',
      data: values,
      responseType: 'blob',
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
  }
  }).then((response)=> { return response.data })
}

const DownloadPOSummary = (values) => {
  return axios(base_url+'sysAdmin/report/reports/poSummary', {
      method: 'POST',
      data: values,
      responseType: 'blob',
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
  }
  }).then((response)=> { return response.data })
}

const SearchBillingDeliveryAddress = (values) => {
  return axios.post(base_url+'sysAdmin/maintenanceSetup/companyProfile/address/search',
    { ...values },
    {
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
      }
    }
  ).then((response)=> { return response.data })
}


const AddBillingDeliveryAddress = (values) => {
  return axios.post(base_url+'sysAdmin/maintenanceSetup/companyProfile/address/addUpdate',
    { ...values },
    {
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
      }
    }
  ).then((response)=> { return response.data })
}

const DeleteAddress = (values) => {
  return axios.post(base_url+'sysAdmin/maintenanceSetup/companyProfile/address/delete',
    { ...values },
    {
      headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization" : getToken(),
      }
    }
  ).then((response)=> { return response.data })
}


/*********************Aman*********************/

const UsernameDropDown = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/financeVewingDept/userNameDropDown',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const GetDropDownData = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/financeVewingDept/getDropDownData',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const SaveDropDownData = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/financeVewingDept/save',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CommodityUsernameDropDown = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/commodityAssignment/getCommodityAssignmentNameDropDown',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const CommodityGetData = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/commodityAssignment/getCommodityAssignmentList',{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const CommodityDataSave = (value) => {
    console.log(value)
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/commodityAssignment/save',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}



// export {
//   PurchaseCateSearchData,
//   AddPurchaseCatalogue,
//   AddAccountData,
//   AddCategoryCode,
//   Adduom,
//   AddSearchResult,
//   GetPurchaserCatalogue,
//   PurchaserCatalogueData,
// export {
//=======
// company profiled details apis----->

const companyNameList = (values) => {
  return axios.post(base_url + 'sysAdmin/maintenanceSetup/companyProfile/companyDetails/getCompanyDataOnPageLoad',
    { ...values },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {

      return response.data
    })
};


const parentDropDown = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/companyDetails/getParentCompanyDropDown",
    { ...values },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      return response.data
    })
};

const stateDropDownList = (values) => {
  return axios.post(base_url + "sysAdmin/getState",
    { ...values }, {
    "countryCode": "IN"
  },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      return response.data
    })
};

const countryDropDownList = (values) => {
  return axios.post(base_url + "sysAdmin/getCountry",
    { ...values },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      return response.data
    })
};

const currencyDropDownList = (values) => {

  return axios.post(base_url + "sysAdmin/getCurrency",
    { ...values },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )

    .then((response) => {

      return response.data
    })
};

const paymentTermsDropDownList = (values) => {
  return axios.post(base_url + 'sysAdmin/getPaymentTerm',
    { ...values },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      return response.data
    })
};


const paymentMethodsDropDownList = (values) => {
  return axios.post(base_url + "sysAdmin/getPaymentMethod",
    { ...values },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      return response.data
    })
};

const companyProfileDataPost = (values) => {

  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/companyDetails/save",
    { ...values },
    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("apiresposne------------>", response)
      return response
    })
};

// for parameters apis

const parametersOnPageLoad = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/parameters/getDataOnPageLoad",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("parameters_apis_response------------>", response)
      return response
    })
};

// for deliverAddress apis

const searchCriteria = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/address/search",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("searchCriteria------------>", response)
      return response
    })
};

const DeliveryAddressSave = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/address/addUpdate",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("DeliveryAddressSave------------>", response)
      return response
    })
};

// company profile departmant apis

const departmentSearch = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/department/search",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("department/search------------>", response)
      return response.data
    })
};

const departmentAddApi = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/department/addUpdate",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("departmentAddApi----------->>>>fglfkglfdklf------------>", response)
      return response
    })
};

const ApprovalListDrowpDownList = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/department/add/approvalListDropDown",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("ApprovalListDrowpDownList------------>", response.data)
      return response.data
    })
};

const DepartmentSearchList = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/department/search",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("DepartmentSearchList------------>", response.data)
      return response.data
    })
};

const DepartmentInvoiceApprovelListDropDown = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/department/add/invoiceApprovalListDropDown",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("DepartmentInvoiceApprovelListDropDown------------>", response.data)
      return response.data
    })
};

const DepartmentAddUpdate = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/department/addUpdate",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("DepartmentAddUpdate------------>", response.data)
      return response.data
    })
};

const DepartmentDeleteData = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/companyProfile/billingAddress/delete",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("DepartmentDeleteData------------>", response.data)
      return response.data
    })
};

const GetUserAccountList = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/search",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("GetUserAccountList------------>", response.data)
      return response.data
    })
};

const AddUpdateUserManagementDetails = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/addModify",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("AddUpdateUserManagementDetails------------>", response.data)
      return response.data
    })
};

const GetUserGroupList = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/add/userGroupList",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("GetUserGroupList------------>", response.data)
      return response.data
    })
};

const GetDepartmentList = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/add/deptNameList",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("GetDepartmentList------------>", response.data)
      return response.data
    })
};

const GeneratePassword = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/modify/geratePassword",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("GeneratePassword------------>", response.data)
      return response.data
    })
};

const DeleteUserData = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/delete",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("DeleteUserData------------>", response.data)
      return response.data
    })
}

const UnlockUserAccount = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/unlockUserAccount",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("UnlockUserAccount------------>", response.data)
      return response.data
    })
}

const ActivateDeactivateUser = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/activateDeactivate",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("ActivateDeactivateUser------------>", response.data)
      return response.data
    })
}

const SearchUserManagementDeliveryBillingAddress = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/userManagement/userAccount/address/search",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("SearchUserManagementDeliveryBillingAddress------------>", response.data)
      return response.data
    })
}



/***************************AMAN********************/

const VendorListRfqMaintSearch = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/vendorListRfqMaint/search',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const AddVendorListRfqMaint = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/vendorListRfqMaint/add/vendorList',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const AddModifyVendorListRfqMaint = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/vendorListRfqMaint/addModify',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const DeleteVendorListRfqMaint = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/vendorListRfqMaint/delete',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const DeliveryUserNameDropDown = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/address/userNameDropDown',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}


const DeliverySearchAddress = (value) => {
    return axios.post(base_url+'sysAdmin/maintenanceSetup/userManagement/userAccount/address/search',value,{
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "authorization" : getToken(),
        }
    }).then((response)=> { return response.data })
}

const PostDeletePurchaseCatalogue = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/customFields/deleteCustomField",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("PostDeletePurchaseCatalogue------------>", response.data)
      return response.data
    })
}


/**************************************************************/

// Custom fields apis .......>
const CustomFieldsNameDrop = (values) => {
  return axios.post(base_url + "sysAdmin/maintenanceSetup/customFields/getCustomFieldNameList",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("CustomFieldsNameDrop------------>", response.data)
      return response.data
    })
};
 const SearchCustomFieldsApiData = (values) =>{

  return axios.post(base_url + "sysAdmin/maintenanceSetup/customFields/getCustomFieldSearchList",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("SearchCustomFieldsApiData------------>", response.data)
      return response.data
    })
 };

const GetApprovalMainUserAssignmentData = (values) => {
  return axios
    .post(
      base_url + "sysAdmin/purchaserAssignment/getDropDownData",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {

      return {status: "SUCCESS", errMessage: "", responseList: {availablePurchasers: [{GROUP_NAME: "Purchaser 1",GROUP_ID: "Purchaser1"},{GROUP_NAME: "Purchaser 2",GROUP_ID: "Purchaser2"},{GROUP_NAME: "Purchaser 3",GROUP_ID: "Purchaser3"}], selectedPurchasers: []} };

      // return response.data;
    });
};

const GetApprovalMainGroupType = (values) => {
  
  return axios
    .post(
      base_url + "sysAdmin/purchaserAssignment/getDropDownData",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return {status: "SUCCESS", errMessage: "", responseList: [{GROUP_NAME: "Group 1",GROUP_ID: "Group1"},{GROUP_NAME: "Group 2",GROUP_ID: "Group2"}]};
    });
};

const GetApprovalMainApprovaGroup = (values) => {
  
  return axios
    .post(
      base_url + "sysAdmin/purchaserAssignment/getDropDownData",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return {status: "SUCCESS", errMessage: "", responseList: [{GROUP_NAME: "Group 4",GROUP_ID: "Group4"},{GROUP_NAME: "Group 5",GROUP_ID: "Group5"}]};
    });
};

const GetApprovalMainItemAssignmentData = (values) => {
  return axios
    .post(
      base_url + "sysAdmin/purchaserAssignment/getDropDownData",
      { ...values },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: getToken(),
        },
      }
    )
    .then((response) => {
      return {status: "SUCCESS", errMessage: "", responseList: [{ ITEM_CODE: "IV-QC0001", ITEM_NAME:"Inventory Item", COMMODITY_TYPE:"PAMB General", UOM:"Unit", STATUS:"Active"}]};
      // return response.data;
    });
};




 const CustomFieldsAddModify = (values) =>{

  return axios.post(base_url + "sysAdmin/maintenanceSetup/customFields/addModifyCustomField",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("CustomFieldsAddModify------------>", response.data)
      return response.data
    })
 }

 // personal settings apis--->

const GetpageLoadPersonalDetails = (values) =>{

  return axios.post(base_url + "sysAdmin/maintenanceSetup/personalSetting/personalDetails/getDataOnPageLoad",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("GetpageLoadPersonalDetails------------>", response.data)
      return response.data
    })
 };

const PersonalSettingDetailsSave = (values) =>{

  return axios.post(base_url + "sysAdmin/maintenanceSetup/personalSetting/personalDetails/save",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("PersonalSettingDetailsSave------------>", response.data)
      return response.data
    })
 };
 const GetConfigureDropDownData = (values) =>{

  return axios.post(base_url + "sysAdmin/maintenanceSetup/personalSetting/configureDefaultSettings/configureForDropDown",
    { ...values },

    {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        authorization: getToken(),
      }
    }
  )
    .then((response) => {
      console.log("GetConfigureDropDownData------------>", response.data)
      return response.data
    })
 };

export {
  PurchaseCateSearchData,
  AddPurchaseCatalogue,
  AddAccountData,
  AddCategoryCode,
  Adduom,
  getAdduom,
  AddSearchResult,
  GetPurchaserCatalogue,
  PurchaserCatalogueData,
  ContractCatAssignItem,
  ContractCatViewItem,
  ContractCatGetAvailablePurchasers,
  ContractCatGetPurchasers,
  ContractCAtassignMultipleUsersGetData,
  ContractCatAssignMultipleUsersSave,
  ContractCatGetContractRefNo,
  ContractCatGetCurrency,
  ContractCatUserAssignmentGetDropDownList,
  ContractCatUserAssignmentgetDropDownData,
  ContractCatUserAssignmentAssignUsers,
  UpdatePurchaseCatalogueData,
  DeletePurchaseCatalogueData,
  CommoditySearchResult,
  ContractCatalogueSearch,
  ContractCatalogueAddModify,
  ContractCatalogueDelete,
  ContractCatalogueViewItem,
  ContractCatalogueExtend,
  SaveItemDetails,
  DeleteItemPurchaseCatalogueData,
  GetPurchaserAssignmentData,
  saveItemForPurchaser,
  searchVendorCompany,
  AddUpdateItemMaster,
  GetCommodity,
  ActivateDeactivateAdd,
  GetItemById,
 // GetItemMasterAudit,
  GetGlCategorySearchCodeData,
  AddGLCategoryCodeData,
  UpdateGlCategoryCode,
  DeleteGlCategoryCode,
  DownloadAuditFile,
  DownloadOutstandingInvoice,
  DownloadOutstandingPO,
  DownloadOverdueInvoice,
  DownloadOverduePO,
  DownloadPODetails,
  DownloadPOSummary,
  // SearchBillingAddress,
  UsernameDropDown,
  GetDropDownData,
  SaveDropDownData,
  CommodityUsernameDropDown,
  CommodityGetData,
  CommodityDataSave,
  SearchBillingDeliveryAddress,
  AddBillingDeliveryAddress,
  DeleteAddress,
  parametersOnPageLoad,
  searchCriteria,
  DeliveryAddressSave,
  departmentSearch,
  departmentAddApi,
  companyNameList,
  parentDropDown,
  stateDropDownList,
  countryDropDownList,
  currencyDropDownList,
  paymentTermsDropDownList,
  paymentMethodsDropDownList,
  companyProfileDataPost,
  ApprovalListDrowpDownList,
  VendorListRfqMaintSearch,
  AddVendorListRfqMaint,
  AddModifyVendorListRfqMaint,
  DeleteVendorListRfqMaint,
  DeliveryUserNameDropDown,
  DeliverySearchAddress,
  DepartmentInvoiceApprovelListDropDown,
  DepartmentSearchList,
  ActivateDeactivateUser,
  AddUpdateUserManagementDetails,
  DeleteUserData,
  GeneratePassword,
  GetDepartmentList,
  GetUserAccountList,
  GetUserGroupList,
  UnlockUserAccount,
  SearchUserManagementDeliveryBillingAddress,
  CustomFieldsNameDrop,
  SearchCustomFieldsApiData,

  GetApprovalMainUserAssignmentData,
  GetApprovalMainGroupType,
  GetApprovalMainApprovaGroup,
  GetApprovalMainItemAssignmentData,
  PostDeletePurchaseCatalogue,
  CustomFieldsAddModify,
  GetConfigureDropDownData,
  PersonalSettingDetailsSave,
  GetpageLoadPersonalDetails
};
