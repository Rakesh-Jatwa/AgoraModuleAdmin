const ApiExtract = async (extractunction, datas) => {
   return await extractunction(datas).then(
        (apis_dats)=>{            
            console.log("apis_dats",apis_dats)
            if(apis_dats.status=="SUCCESS"){
                let _temp_details = {} 
                _temp_details.status = true
                _temp_details.message = apis_dats.errMessage
                _temp_details.number = apis_dats.number
                _temp_details.response = apis_dats.responseList
                return _temp_details; 
            }
            else{
                let _temp_details = {} 
                _temp_details.status = false
                _temp_details.message = apis_dats.errMessage
                return _temp_details; 
            }
           
        },
        (apis_errors)=>{
            console.log("apis_dats",apis_errors)
            let _temp_details = {} 
            _temp_details.status = false
            _temp_details.message = apis_errors.errMessage
            return _temp_details; 
        }
    )
    .catch((error)=>{
        console.log("apis_dats",error)
            
        let _temp_details = {} 
        _temp_details.status = false
        _temp_details.message = error.errMessage
        return _temp_details; 
    })

}

const ApiExtractFiles = async (extractunction, files, datas) => {
    console.log('ApiExtractFiles', files,datas)
    return await extractunction(files, datas).then(
         (apis_dats)=>{
             if(apis_dats.status=="SUCCESS"){
                 let _temp_details = {} 
                 _temp_details.status = true
                 _temp_details.message = apis_dats.errMessage
                 _temp_details.number = apis_dats.number
                 _temp_details.response = apis_dats.responseList
                 return _temp_details; 
             }
             else{
                 let _temp_details = {} 
                 _temp_details.status = false
                 _temp_details.message = apis_dats.errMessage
                 return _temp_details; 
             }
            
         },
         (apis_errors)=>{
             let _temp_details = {} 
             _temp_details.status = false
             _temp_details.message = apis_errors.errMessage
             return _temp_details; 
         }
     )
     .catch((error)=>{
         let _temp_details = {} 
         _temp_details.status = false
         _temp_details.message = error.errMessage
         return _temp_details; 
     })
 
 }

export {ApiExtract, ApiExtractFiles}