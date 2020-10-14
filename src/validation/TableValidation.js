const validateTableInput = (value, allValues, props) => {
    const membersArrayErrors = []
}

const normalizePhone = (value, previousValue) => {
  if (!value) {
    return value
  }
  const onlyNums = value.replace(/[^\d]/g, '')
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 3) {
      return onlyNums + '-'
    }
    if (onlyNums.length === 6) {
      return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3) + '-'
    }
  }
  if (onlyNums.length <= 3) {
    return onlyNums
  }
  if (onlyNums.length <= 6) {
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3)
  }
  return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 6) + '-' + onlyNums.slice(6, 10)
}

const floatnumbers = (value, previousValue) => {
  var floatValues =  /^\d*\.?\d*$/;
  if (value.match(floatValues)) {
      return value
  } 
  else if(value==""){
      return '';
  }
  else{

  }
}

const alphanumeric = (value, previousValue) => {
  var floatValues =  /^[A-Za-z]+$/;
  if (value.match(floatValues)) {
       return value
  } 
  else if(value==""){
      return '';
  }
  else{

  }
}



const RaiseRFQ = values => {
  console.log('RaiseRFQ', values)
  const errors = {}
  if (!values.paymentTerm) {
     errors.paymentTerm = 'Choose Vendor a vendor to rise RFQ'
  }
  if (!values.RFQDescription) {
    errors.RFQDescription = 'Enter RFQ Description'
  }
  
  return errors
}

const NormalizeNumbers = values => {
  var RegExp = new RegExp(/^\d*\.?\d*$/); 
  if (RegExp.test(values)) { 
    return values
  }
}

const RemoveSpecialChar = values => {
 let _values = values.replace(/[^\w\s]/, '')
 return _values;
}

const EscapeQuotes = values => {
  let _values = values.replace(/[^\w\s/]/g, "")
  return _values;
}


const EscapePlus = values => {
  let _values = values.replace(/[^\w\s+]/g, "")
  return _values;
}


const EscapeQuotesRejex = values => {
  var RegExp = new RegExp(/[^\w\s/]/g); 
  if (RegExp.test(values)) { 
    return values
  }
}





const floatnumbers_length_6 = values => {
   
      var regex = /^(\d+)?([.]?\d{0,2})?$/
      let _length = 0
      let _temp_values = values.toString()
      let _count = _temp_values.indexOf('.')

      if(values && _count>=0){
          _length = 9
      }
      else{
          _length = 6
      }

      console.log('_length', _length, _count)

      if (values.match(regex) && values.length<=_length) { 
          values = values.replace(/[^0-9\.]/g,'');
          return values
      }
    
}

const price2decimal4 = (num) =>{
    num  = (num) ? num.toString() : 0;
    var value = Number(num);      
    var res = num.split(".");     
    if(res.length == 1 || res[1].length < 3) { 
        let _init_value  = res[0]
        if(_init_value.length <= 1){
          _init_value = '0'+_init_value;
          var s = _init_value;
          if (s._init_value < 2) s = "0" + _init_value;
          value = parseFloat(_init_value+'.'+res[1]);
        }
        value = value.toFixed(4);
        return value;
    }  
}

const maxlength10 = (values) => {
  var regex = /^(\d+)?([.]?\d{0,2})?$/
  if (values.match(regex)) { 
     values = values.replace(/[^0-9\.]/g,'');
     return values.slice(0, 5)
  }
}

const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined

const maxLength50 = maxLength(50)

const maxLength1000 = maxLength(1000)


export {validateTableInput, normalizePhone, floatnumbers, alphanumeric, RaiseRFQ, NormalizeNumbers, floatnumbers_length_6, RemoveSpecialChar, EscapeQuotes, maxlength10, EscapeQuotesRejex, maxLength50, price2decimal4, EscapePlus, maxLength1000}