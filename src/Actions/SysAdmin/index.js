import * as Actions from '../Actions';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as Months from '../../Common/Months';
import {
  PurchaseCateSearchData,
  AddPurchaseCatalogue,
  GetPurchaserCatalogue,
  PurchaserCatalogueData,
  AddAccountData,
  AddCategoryCode,
  Adduom,
  DownloadAuditFile,
  getAdduom,
  AddSearchResult, 
  UpdatePurchaseCatalogueData,
  DeletePurchaseCatalogueData,
  DeleteItemPurchaseCatalogueData,
  SaveItemDetails,
  GetPurchaserAssignmentData,
  saveItemForPurchaser,
  GetCommodity,
  DownloadOutstandingInvoice,
  DownloadOutstandingPO,
  DownloadOverdueInvoice,
  DownloadOverduePO,
  DownloadPODetails,
  DownloadPOSummary,
  DepartmentSearchList,
  DepartmentInvoiceApprovelListDropDown,
  UsernameDropDown,
  GetApprovalMainUserAssignmentData,
  GetApprovalMainGroupType,
  GetApprovalMainApprovaGroup,
  GetApprovalMainItemAssignmentData
} from '../../Apis/SysAdmin';

const PostModifyPurchaseCatalogue = (values) => {
  let companyID = JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"];
  return (dispatch) => {
    UpdatePurchaseCatalogueData(values)
      .then( receiveddata => {
          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            } else if (values.frm === 'matrix') {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            } else {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            }
          } else {
            // dispatch({
            //   type: Actions.ADD_PURCHASE_CAT_FAILURE,
            //   payload: receiveddata.errMessage,
            // });
          }
        },
        (failure) => {
          // dispatch({
          //   type: Actions.ADD_PURCHASE_CAT_FAILURE,
          //   payload: failure.message,
          // });
        }
      )
      .catch((error) => {
        // dispatch({
        //   type: Actions.ADD_PURCHASE_CAT_FAILURE,
        //   payload: error.message,
        // });
      });
  };
};

const PostDeletePurchaseCatalogue = (values) => {
  let companyID = JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"];
  return (dispatch) => {
    DeletePurchaseCatalogueData(values)
      .then( receiveddata => {
          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            } else if (values.frm === 'matrix') {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            } else {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            }
          } else {
            // dispatch({
            //   type: Actions.ADD_PURCHASE_CAT_FAILURE,
            //   payload: receiveddata.errMessage,
            // });
          }
        },
        (failure) => {
          // dispatch({
          //   type: Actions.ADD_PURCHASE_CAT_FAILURE,
          //   payload: failure.message,
          // });
        }
      )
      .catch((error) => {
        // dispatch({
        //   type: Actions.ADD_PURCHASE_CAT_FAILURE,
        //   payload: error.message,
        // });
      });
  };
};

const GetPurchaseCateSearchData = (values) => {
  return (dispatch) => {
    dispatch({
      type: Actions.PURCHASE_CAT_ACCESS,
      payload: { loading: true, errMessage: 'loading' },
    });
    PurchaseCateSearchData(values)
      .then(receiveddata => {
          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch({
                type: Actions.PURCHASE_CAT_SUCCESS,
                payload: receiveddata,
              });
            } else if (values.frm === 'matrix') {
              dispatch({
                type: Actions.PURCHASE_CAT_SUCCESS,
                payload: receiveddata,
              });
            } else {
              dispatch({
                type: Actions.PURCHASE_CAT_SUCCESS,
                payload: receiveddata,
              });
            }
          } else {
            dispatch({
              type: Actions.PURCHASE_CAT_FAILURE,
              payload: receiveddata.errMessage,
            });
          }
        },
        (failure) => {
          dispatch({
            type: Actions.PURCHASE_CAT_FAILURE,
            payload: failure.message,
          });
        }
      )
      .catch((error) => {
        dispatch({
          type: Actions.PURCHASE_CAT_FAILURE,
          payload: error.message,
        });
      });
  };
};
// ABHI


// GetContractCatGetAvailablePurchasers
const GetPurchaserCatalogueData = (values) => {
  return (dispatch) => {
    dispatch({
      type: Actions.PURCHASE_CAT_DATA_ACCESS,
      payload: { loading: true, errMessage: 'loading' },
    });
    ;
    GetPurchaserCatalogue(values)
      .then(receiveddata => {
        ;
          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch({
                type: Actions.PURCHASE_CAT_DATA_SUCCESS,
                payload: receiveddata,
              });
            } else if (values.frm === 'matrix') {
              dispatch({
                type: Actions.PURCHASE_CAT_DATA_SUCCESS,
                payload: receiveddata,
              });
            } else {
              dispatch({
                type: Actions.PURCHASE_CAT_DATA_SUCCESS,
                payload: receiveddata,
              });
            }
          } else {
            dispatch({
              type: Actions.PURCHASE_CAT_DATA_FAILURE,
              payload: receiveddata.errMessage,
            });
          }
        },
        (failure) => {
          dispatch({
            type: Actions.PURCHASE_CAT_FAILURE,
            payload: failure.message,
          });
        }
      )
      .catch((error) => {
        dispatch({
          type: Actions.PURCHASE_CAT_FAILURE,
          payload: error.message,
        });
      });
  };
};

const PurchaserCatalogue = (values) => {
  return (dispatch) => {
    dispatch({
      type: Actions.PURCHASE_CATALOGUE_DATA_ACCESS,
      payload: { loading: true, errMessage: 'loading' },
    });
    PurchaserCatalogueData(values)
      .then(receiveddata => {
          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch({
                type: Actions.PURCHASE_CATALOGUE_DATA_SUCCESS,
                payload: receiveddata,
              });
            } else if (values.frm === 'matrix') {
              dispatch({
                type: Actions.PURCHASE_CATALOGUE_DATA_SUCCESS,
                payload: receiveddata,
              });
            } else {
              dispatch({
                type: Actions.PURCHASE_CATALOGUE_DATA_SUCCESS,
                payload: receiveddata,
              });
            }
          } else {
            dispatch({
              type: Actions.PURCHASE_CATALOGUE_DATA_FAILURE,
              payload: receiveddata.errMessage,
            });
          }
        },
        (failure) => {
          dispatch({
            type: Actions.PURCHASE_CAT_FAILURE,
            payload: failure.message,
          });
        }
      )
      .catch((error) => {
        dispatch({
          type: Actions.PURCHASE_CAT_FAILURE,
          payload: error.message,
        });
      });
  };
};

const GetAccountData = (values) => {
  return (dispatch) => {
      dispatch({ type:Actions.AD_ACCESS, payload:{loading:true, errMessage:'loading'}});
      AddAccountData(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.AD_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.AD_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.AD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.AD_FAILURE, payload:error.message})
      })
  }
};

const GetCategoryCode = (values) => {
  return (dispatch) => {
      dispatch({ type:Actions.CC_ACCESS, payload:{loading:true, errMessage:'loading'}});
      AddCategoryCode(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.CC_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.CC_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.CC_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.CC_FAILURE, payload:error.message})
      })
  }
};

const Getuom = (values) => {
  return (dispatch) => {
      dispatch({ type:Actions.UOM_ACCESS, payload:{loading:true, errMessage:'loading'}});
      getAdduom(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.UOM_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.UOM_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.UOM_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.UOM_FAILURE, payload:error.message})
      })
  }
};

const GetSearchResult = (values) => {
  return (dispatch) => {
      dispatch({ type:Actions.SR_ACCESS, payload:{loading:true, errMessage:'loading'}});
      AddSearchResult(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.SR_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.SR_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.SR_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.SR_FAILURE, payload:error.message})
      })
  }
};

// const GetAccountData = (values) => {
//   return (dispatch) => {
//       dispatch({ type:Actions.AD_ACCESS, payload:{loading:true, errMessage:'loading'}});
//       AddAccountData(values).then(
//           ((receiveddata)=>{
//               if(receiveddata.status==="SUCCESS"){
//                   dispatch({ type:Actions.AD_SUCCESS,  payload:receiveddata});
//               }
//               else{
//                   dispatch({type:Actions.AD_FAILURE, payload:receiveddata.errMessage})
//               }
//           }),
//           ((failure)=>{
//               dispatch({type:Actions.AD_FAILURE, payload:failure.message})
//           }),
//       )
//       .catch((error)=>{
//           dispatch({type:Actions.AD_FAILURE, payload:error.message})
//       })
//   }
// }

// const GetCategoryCode = (values) => {
// return (dispatch) => {
//     dispatch({ type:Actions.CC_ACCESS, payload:{loading:true, errMessage:'loading'}});
//     AddCategoryCode(values).then(
//         ((receiveddata)=>{
//             if(receiveddata.status==="SUCCESS"){
//                 dispatch({ type:Actions.CC_SUCCESS,  payload:receiveddata});
//             }
//             else{
//                 dispatch({type:Actions.CC_FAILURE, payload:receiveddata.errMessage})
//             }
//         }),
//         ((failure)=>{
//             dispatch({type:Actions.CC_FAILURE, payload:failure.message})
//         }),
//     )
//     .catch((error)=>{
//         dispatch({type:Actions.CC_FAILURE, payload:error.message})
//     })
// }
// }

// const Getuom = (values) => {
// return (dispatch) => {
//     dispatch({ type:Actions.UOM_ACCESS, payload:{loading:true, errMessage:'loading'}});
//     Adduom(values).then(
//         ((receiveddata)=>{
//             if(receiveddata.status==="SUCCESS"){
//                 dispatch({ type:Actions.UOM_SUCCESS,  payload:receiveddata});
//             }
//             else{
//                 dispatch({type:Actions.UOM_FAILURE, payload:receiveddata.errMessage})
//             }
//         }),
//         ((failure)=>{
//             dispatch({type:Actions.UOM_FAILURE, payload:failure.message})
//         }),
//     )
//     .catch((error)=>{
//         dispatch({type:Actions.UOM_FAILURE, payload:error.message})
//     })
// }
// }

// const GetSearchResult = (values) => {
// return (dispatch) => {
//     dispatch({ type:Actions.SR_ACCESS, payload:{loading:true, errMessage:'loading'}});
//     AddSearchResult(values).then(
//         ((receiveddata)=>{
//             if(receiveddata.status==="SUCCESS"){
//                 dispatch({ type:Actions.SR_SUCCESS,  payload:receiveddata});
//             }
//             else{
//                 dispatch({type:Actions.SR_FAILURE, payload:receiveddata.errMessage})
//             }
//         }),
//         ((failure)=>{
//             dispatch({type:Actions.SR_FAILURE, payload:failure.message})
//         }),
//     )
//     .catch((error)=>{
//         dispatch({type:Actions.SR_FAILURE, payload:error.message})
//     })
// }
// }

const SaveItemDetailsData = (values, purchaserID) => {
  return (dispatch) => {

    SaveItemDetails(values)
      .then( receiveddata => {
          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch(GetSearchResult({
                strCoyId: "pamb",
                strDel: "N",
                strItemType: "B"
              }));
            } else if (values.frm === 'matrix') {
              dispatch(GetSearchResult({
                strCoyId: "pamb",
                strDel: "N",
                strItemType: "B"
              }));
            } else {
              dispatch(GetSearchResult({
                strCoyId: "pamb",
                strDel: "N",
                strItemType: "B"
              }));
            }
          } else {
          }
        },
        (failure) => {
        }
      )
      .catch((error) => {
      });
  };
};

const DeleteItemPurchaseCatalogue = (values, purchaserID) => {
  return (dispatch) => {
    // dispatch({
    //   type: Actions.ADD_PURCHASE_CAT_ACCESS,
    //   payload: { loading: true, errMessage: 'loading' },
    // });

    DeleteItemPurchaseCatalogueData(values)
      .then( receiveddata => {

          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch(GetPurchaserCatalogueData(purchaserID));
            } else if (values.frm === 'matrix') {
              dispatch(GetPurchaserCatalogueData(purchaserID));
            } else {
              dispatch(GetPurchaserCatalogueData(purchaserID));
            }
          } else {
          }
        },
        (failure) => {
        }
      )
      .catch((error) => {
      });
  };
};

const PurchaserAssignmentData = (values, purchaserID) => {
  return (dispatch) => {
    dispatch({ type:Actions.PA_ACCESS, payload:{loading:true, errMessage:'loading'}});
    GetPurchaserAssignmentData(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.PA_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.PA_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.PA_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.PA_FAILURE, payload:error.message})
      })
  };
};

const GetAddCommodity = (values) => {
  return (dispatch) => {
      dispatch({ type:Actions.COMMODITY_ACCESS, payload:{loading:true, errMessage:'loading'}});
      GetCommodity(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.COMMODITY_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.COMMODITY_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.COMMODITY_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.COMMODITY_FAILURE, payload:error.message})
      })
  }
}

const SaveItemOfPurchaser = (values) => {
  let companyID = JSON.parse(localStorage.getItem("profile"))["UM_COY_ID"];
  return (dispatch) => {
    saveItemForPurchaser(values)
      .then( receiveddata => {
          if (receiveddata.status === 'SUCCESS') {
            if (values.frm === 'master') {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            } else if (values.frm === 'matrix') {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            } else {
              dispatch(GetPurchaseCateSearchData({ 'companyId': companyID }));
              dispatch(PurchaserCatalogue({ 'companyId': companyID }));
            }
          } else {
          }
        },
        (failure) => {
        }
      )
      .catch((error) => {
      });
  };
};

const GetItemMasterAudit=  (values) =>{
  return (dispatch) => {
    dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
    DownloadAuditFile(values).then(
        (async (receiveddata)=>{
      //      let blob = new Blob([receiveddata], { type: "octet/stream" });
     const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                 const fileExtension = '.xlsx';
            const data1 = await new Blob([receiveddata], {type: fileType});

            console.log('data ',receiveddata);
            FileSaver.saveAs(data1, "ItemMasterAuditTrail" + fileExtension);
            // var fileURL = window.URL.createObjectURL(blob);
            // var fileLink = document.createElement('a');
            // fileLink.href = fileURL;
            // console.log('fileURL ',fileURL);
            // fileLink.setAttribute('download', 'test.xlsx');
            // document.body.appendChild(fileLink);
            // fileLink.click();
            dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
          }),
          ((failure)=>{
              dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
      })
  }
}

const GetOutstandingInvoice =  (values) =>{
  return (dispatch) => {
    dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
    DownloadOutstandingInvoice(values).then(
        (async (receiveddata)=>{
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const fileExtension = '.xlsx';
            const data1 = await new Blob([receiveddata], {type: fileType});
            let date = new Date();

            console.log('data ',receiveddata);
            FileSaver.saveAs(data1, "OutstandingInvoiceReport(" + date.getDate() + Months.SHORTMONTHS[date.getMonth()] + date.getFullYear() + ')' + fileExtension);
            dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
          }),
          ((failure)=>{
              dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
      })
  }
}

const GetOutstandingPO =  (values) =>{
  return (dispatch) => {
    dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
    DownloadOutstandingPO(values).then(
        (async (receiveddata)=>{
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const fileExtension = '.xlsx';
            const data1 = await new Blob([receiveddata], {type: fileType});
            let date = new Date();

            console.log('data ',receiveddata);
            debugger;
            FileSaver.saveAs(data1, "OutstandingPOReport(" + date.getDate() + Months.SHORTMONTHS[date.getMonth()] + date.getFullYear() + ')'+ fileExtension);
            dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
          }),
          ((failure)=>{
              dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
      })
  }
}

const GetOverdueInvoice =  (values) =>{
  return (dispatch) => {
    dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
    DownloadOverdueInvoice(values).then(
        (async (receiveddata)=>{
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const fileExtension = '.xlsx';
            const data1 = await new Blob([receiveddata], {type: fileType});
            let date = new Date();

            console.log('data ',receiveddata);
            FileSaver.saveAs(data1, "OverdueInvoiceReport(" + date.getDate() + Months.SHORTMONTHS[date.getMonth()] + date.getFullYear() + ')' + fileExtension);
            dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
          }),
          ((failure)=>{
              dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
      })
  }
}

const GetOverduePO =  (values) =>{
  return (dispatch) => {
    dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
    DownloadOverduePO(values).then(
        (async (receiveddata)=>{
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const fileExtension = '.xlsx';
            const data1 = await new Blob([receiveddata], {type: fileType});
            let date = new Date();

            console.log('data ',receiveddata);
            FileSaver.saveAs(data1, "OverduePOReport(" + date.getDate() + Months.SHORTMONTHS[date.getMonth()] + date.getFullYear() + ')' + fileExtension);
            dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
          }),
          ((failure)=>{
              dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
      })
  }
}

const GetPODetails=  (values) =>{
  return (dispatch) => {
    dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
    DownloadPODetails(values).then(
        (async (receiveddata)=>{
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const fileExtension = '.xlsx';
            const data1 = await new Blob([receiveddata], {type: fileType});
            let date = values.startDate.split('-');
            debugger
            console.log('data ',receiveddata);
            FileSaver.saveAs(data1, "PODetailsReport(" + Months.SHORTMONTHS[parseInt(date[1]) - 1] + date[0] + ')' + fileExtension);
            dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
          }),
          ((failure)=>{
              dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
      })
  }
}

const GetPOSummary=  (values) =>{
  return (dispatch) => {
    dispatch({ type:Actions.DOWNLOAD_ACCESS, payload:{loading:true, errMessage:'loading'}});
    DownloadPOSummary(values).then(
        (async (receiveddata)=>{
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const fileExtension = '.xlsx';
            const data1 = await new Blob([receiveddata], {type: fileType});
            let date = values.startDate.split('-');
            debugger;
            console.log('data ',receiveddata);
            FileSaver.saveAs(data1, "POSummaryReport(" + Months.SHORTMONTHS[parseInt(date[1]) - 1] + date[0] + ')' + fileExtension);
            dispatch({ type:Actions.DOWNLOAD_SUCCESS,  payload:receiveddata});
          }),
          ((failure)=>{
              dispatch({type:Actions.DOWNLOAD_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DOWNLOAD_FAILURE, payload:error.message})
      })
  }
}

const GetDepartmentSearchList = (values) => {
  return (dispatch) => {
      dispatch({ type:Actions.DEPARTMENT_SEARCH_ACCESS, payload:{loading:true, errMessage:'loading'}});
      DepartmentSearchList(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.DEPARTMENT_SEARCH_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.DEPARTMENT_SEARCH_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.DEPARTMENT_SEARCH_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DEPARTMENT_SEARCH_FAILURE, payload:error.message})
      })
  }
}

const GetDepartmentApprovelListDropDown = (values) => {
  return (dispatch) => {
      dispatch({ type:Actions.DEPARTMENT_APPROVEL_LIST_ACCESS, payload:{loading:true, errMessage:'loading'}});
      DepartmentInvoiceApprovelListDropDown(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.DEPARTMENT_APPROVEL_LIST_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.DEPARTMENT_APPROVEL_LIST_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.DEPARTMENT_APPROVEL_LIST_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.DEPARTMENT_APPROVEL_LIST_FAILURE, payload:error.message})
      })
  }
}

const GetUsernameDropDown = (values) => {
    return (dispatch) => {
        dispatch({ type:Actions.DL_ACCESS, payload:{loading:true, errMessage:'loading'}});
        UsernameDropDown(values).then(
            ((receiveddata)=>{
              console.log("receiveddata",receiveddata)
                if(receiveddata.status==="SUCCESS"){
                    if(values.frm=="master"){
                        dispatch({ type:Actions.DL_SUCCESS,  payload:receiveddata});
                    }
                    else if(values.frm=="matrix"){
                        dispatch({ type:Actions.DL_MX_SUCCESS,  payload:receiveddata});
                    }
                    else{
                        dispatch({ type:Actions.DL_LST_SUCCESS,  payload:receiveddata});
                    }
                }
                else{
                    dispatch({type:Actions.DL_FAILURE, payload:receiveddata.errMessage})
                }
            }),
            ((failure)=>{
                dispatch({type:Actions.DL_FAILURE, payload:failure.message})
            }),
        )
        .catch((error)=>{
            dispatch({type:Actions.DL_FAILURE, payload:error.message})
        })
    }
}

const ApprovalProcessUserAssigment = (values) => {
  return (dispatch) => {
    dispatch({ type:Actions.USER_ASSIGMENT_ACCESS, payload:{loading:true, errMessage:'loading'}});
    GetApprovalMainUserAssignmentData(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.USER_ASSIGMENT_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.USER_ASSIGMENT_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.USER_ASSIGMENT_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.USER_ASSIGMENT_FAILURE, payload:error.message})
      })
  };
};


const ApprovalProcessGroupType = (values) => {
  return (dispatch) => {
    dispatch({ type:Actions.GROUP_TYPE_ACCESS, payload:{loading:true, errMessage:'loading'}});
    GetApprovalMainGroupType(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.GROUP_TYPE_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.GROUP_TYPE_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.GROUP_TYPE_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.GROUP_TYPE_FAILURE, payload:error.message})
      })
  };
};

const ApprovalProcessApprGroup = (values) => {
  return (dispatch) => {
    dispatch({ type:Actions.APPROVAL_GROUP_ACCESS, payload:{loading:true, errMessage:'loading'}});
    GetApprovalMainApprovaGroup(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.APPROVAL_GROUP_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.APPROVAL_GROUP_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.APPROVAL_GROUP_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.APPROVAL_GROUP_FAILURE, payload:error.message})
      })
  };
};


const ApprovalProcessItemAssigment = (values) => {
  return (dispatch) => {
    dispatch({ type:Actions.ITEM_ASSIGMENT_ACCESS, payload:{loading:true, errMessage:'loading'}});
    GetApprovalMainItemAssignmentData(values).then(
          ((receiveddata)=>{
              if(receiveddata.status==="SUCCESS"){
                  dispatch({ type:Actions.ITEM_ASSIGMENT_SUCCESS,  payload:receiveddata});
              }
              else{
                  dispatch({type:Actions.ITEM_ASSIGMENT_FAILURE, payload:receiveddata.errMessage})
              }
          }),
          ((failure)=>{
              dispatch({type:Actions.ITEM_ASSIGMENT_FAILURE, payload:failure.message})
          }),
      )
      .catch((error)=>{
          dispatch({type:Actions.ITEM_ASSIGMENT_FAILURE, payload:error.message})
      })
  };
};





export { GetPurchaseCateSearchData,
  PostModifyPurchaseCatalogue,
  PostDeletePurchaseCatalogue,
  GetPurchaserCatalogueData,
  PurchaserCatalogue,
  GetAccountData,
  GetCategoryCode,
  Getuom,
  GetSearchResult,
  DeleteItemPurchaseCatalogue,
  SaveItemDetailsData,
  PurchaserAssignmentData,
  SaveItemOfPurchaser,
  GetAddCommodity,
  GetItemMasterAudit,
  GetOutstandingInvoice,
  GetOutstandingPO,
  GetOverdueInvoice,
  GetOverduePO,
  GetPODetails,
  GetPOSummary,
  GetDepartmentSearchList,
  GetDepartmentApprovelListDropDown,
  GetUsernameDropDown,
  ApprovalProcessUserAssigment,
  ApprovalProcessGroupType,
  GetApprovalMainApprovaGroup,
  ApprovalProcessApprGroup,
  ApprovalProcessItemAssigment
};
