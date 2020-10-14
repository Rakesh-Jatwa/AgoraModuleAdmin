const base_url = process.env.REACT_APP_API_URL
console.log('REACT_APP_API_URL', process.env)
const axios = require('axios');
let Web_Apis = {
    UserLogin(values){
        return axios.post(base_url+'login',values)
			.then((response)=> { return response.data })
    },

    UserRegister(values){
        return axios.post(base_url+'register',values)
			.then((response)=> { return response.data })
    },

    UserList(token){
        return axios.get(base_url+'list_user',{
            headers: {
                Authorization: 'Bearer ' +token
            }
        })
        .then((response)=>{return response.data})
    },
    RemoveUser(token,data){
        return axios.delete(`${base_url}user/${data}`,{
            headers: {
                Authorization: 'Bearer ' +token
            }
        })
        .then((response)=>{return response.data})
    },

    UploadFile(token,data){
		const formData = new FormData();
		formData.append('imgUploader',data)
        formData.append('token',token)
        
        return axios.post(`${base_url}file_upload`,formData,{
            headers: {
                Authorization: 'Bearer ' +token,
            }
        })

        .then((response)=>{return response.data})
    }
}

export default Web_Apis;