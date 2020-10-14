import jwt from 'jsonwebtoken';

const UserDetails = () => {
    let _user_details =''
    if(localStorage.getItem('token')){
        _user_details = jwt.verify(localStorage.getItem('token'), 'AGORA@123');
    }   
    return _user_details;
}

const UserDetailsMain = async () => {
    let _user_details =''
    if(localStorage.getItem('token')){
        _user_details =  await jwt.verify(localStorage.getItem('token'), 'AGORA@123');
    }   
    return _user_details;
}



const PutLocalstorage = (name, values) => {
    let _details = localStorage.getItem(name)
    if(!_details){
        localStorage.setItem(name, values)
    }
    
}

const GetLocalstorage = (name) => {
    let _details = localStorage.getItem(name)
    return _details;
}

const SumDetails = (details, value1, value2=0 ) => {
    var total = 0
    for ( var i = 0; i < details.length; i++ ) {
        if(value2){
            total += details[i][value1]+details[i][value2]
        }
        else{
            total += details[i][value1]
        }
        
    }
    return total
}


const TotalDetails = (details, value1, value2=0 , value3 ) =>{
    var total = 0
    for ( var i = 0; i < details.length; i++ ) {
        total += (details[i][value1]*details[i][value2])+details[i][value3]
    }
    return total
}
export {UserDetails, PutLocalstorage, GetLocalstorage, SumDetails, TotalDetails, UserDetailsMain}