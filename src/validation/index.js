export const LoginValidation = values => {
    const errors = {}
    if (!values.password) {
      errors.password = 'Enter Your Password'
    }
    if (!values.companyid) {
      errors.companyid = 'Enter Your Company Id'
    }
    if (!values.userid) {
      errors.userid = 'Enter Your User Id'
    }
    return errors

}

export const PasswordExpiredValidation = values => {
  const errors = {}
  if (!values.userId) {
    errors.userId = 'User Id is required'
  }
  if (!values.oldPwd) {
    errors.oldPwd = 'Old Password is required'
  }
  if (!values.newPwd) {
    errors.newPwd = 'New Password is required'
  }
  if (!values.confirmPwd) {
    errors.confirmPwd = 'Confirm New Password is required'
  }
  // if (!(/[^0-9a-zA-Z]/.test(values.newPwd))) {
  //   errors.newPwd = 'Password must be alpha numeric'
  // }
  if (!values.questionIndex) {
    errors.questionIndex = 'Challenge Phrase is required'
  }
  

  if (!values.answer) {
    errors.answer = 'Answer is required'
  }
 
  if (values.newPwd != values.confirmPwd) {
    errors.confirmPwd = 'Confirm New Password does not match with new password'
  }

  return errors

}

export const RegisterValidation = values => {
  const errors = {}
  if (!values.first_name) {
     errors.first_name = 'Enter Your First Name'
  }
  if (!values.last_name) {
    errors.last_name = 'Enter Your Last Name'
  }
  if (!values.email) {
    errors.email = 'Enter Your EMail'
  }
  if (!values.mobile_number) {
    errors.mobile_number = 'Enter Your Mobile Number'
  }
  if (!values.password) {
    errors.password = 'Enter Your Password'
  }
  return errors
}


export const E2PREquest = values => {
  let  errors = {}
  errors.e2psearch= {}
  if(values.e2psearch){
    if (!values.e2psearch.DocType) {
      errors.e2psearch.DocType = 'Choose Document Type'
    }
    if (!values.e2psearch.CurrencyCode) {
      errors.e2psearch.CurrencyCode = 'Choose Currency Code'
    }
    if (!values.e2psearch.DocNo) {
      errors.e2psearch.DocNo = 'Enter Document No'
    }
    if (!values.e2psearch.DocDate) {
      errors.e2psearch.DocDate = 'Enter Document Date'
    }

    if (!values.e2psearch.TotalAmtNoGST) {
      errors.e2psearch.TotalAmtNoGST = 'Enter Total Amount(excl.SST)* '
    }

    if (!values.e2psearch.PaymentAmt) {
      errors.e2psearch.PaymentAmt = 'Enter Total Amount(excl.SST) or SST Amount'
    }



    
    
    // if (!values.e2psearch.PaymentAmt) {
    //   errors.e2psearch.PaymentAmt = 'Enter Payment Amount* '
    // }

    // if (!values.e2psearch.PRCSSentDate) {
    //   errors.e2psearch.PRCSSentDate = 'PSD Sent Date * '
    // }

    // if (!values.e2psearch.PRCSReceivedDate) {
    //   errors.e2psearch.PRCSReceivedDate = 'PSD Received Date * '
    // }

    if (!values.e2psearch.VendorName) {
      errors.e2psearch.VendorName = 'Choose a Vendor* '
    }

    
    
  
    
  }
  console.log('errors', errors)
  return errors
}



export const InvoiceDetails = values => {
  const errors = {}
  if (!values.Vendorinvoiceno) {
     errors.first_name = 'Enter Vendor invoice no'
  }
  return errors
}

export  const numeric = (e) => {
  var reg = /^[0-9]+([,.][0-9]+)?$/g;
  if (!reg.test(String.fromCharCode(e.which))) {
      e.preventDefault();
  }
}

export  const decimal = (e) => {
  var reg = /^(\d+)?([.]?\d{0,2})?$/
  if (!reg.test(String.fromCharCode(e.which))) {
      e.preventDefault();
  }
}


