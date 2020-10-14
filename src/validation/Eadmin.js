const ValidateCompanyDetails = (values) => {
 
    const errors = {}
    console.log('AddUserGroup',values, errors)
    if (!values.CoyId) {
       errors.CoyId = 'Enter Company ID'
    }
    if (!values.CoyName) {
        errors.CoyName =  'Enter Company Name'
    }
    if (!values.CoyType) {
        errors.CoyType = 'Choose Company Type'
    }
    if (!values.LicenseUsers) {
        errors.LicenseUsers = 'Choose User License'
    }
    // if (!values.ReportUsers) {
    //     errors.ReportUsers = 'Enter Report User '
    // }
    if (!values.Address1) {
        errors.Address1 = 'Enter Address 21'
    }
    if (!values.Address2) {
        errors.Address2 = 'Enter Address 2'
    }
    if (!values.Address3) {
        errors.Address3 = 'Enter Address 3'
    }
    if (!values.City) {
        errors.City = 'Choose City'
    }
    if (!values.State) {
        errors.State = 'Choose State'
    }
    if (!values.Country) {
        errors.Country = 'Choose Country'
    }
    if (!values.Phone) {
        errors.Phone = 'Enter Phone Number'
    }
    if (!values.Fax) {
        errors.Fax = 'Enter Fax Number'
    }
    if (!values.Email) {
        errors.Email = 'Enter Email'
    }
    if (!values.BusinessRegNo) {
        errors.BusinessRegNo = 'Enter Business Registration No'
    }
    // if (!values.ContactPerson) {
    //     errors.ContactPerson = 'Enter Contact Person'
    // }
    // if (!values.BankName) {
    //     errors.BankName = 'Enter Bank Name'
    // }

    // if (!values.AccountNo) {
    //     errors.AccountNo = 'Enter Bank Account No'
    // }

    // if (!values.BankCode) {
    //     errors.BankCode = 'Enter Bank Code'
    // }
    // if (!values.BranchCode) {
    //     errors.BranchCode = 'Enter Bank Branch Code'
    // }
    if (!values.Currency) {
        errors.Currency = 'Choose Currency'
    }
    // if (!values.TaxRegNo) {
    //     errors.TaxRegNo = 'Enter SST Registration No'
    // }
    if (values.CoyType == "VENDOR" && !values.TransNo) {
        errors.TransNo = 'Enter No of Transaction'
    }
    if (values.CoyType == "BUYER" && !values.PaymentTerm) {
        errors.PaymentTerm = 'Enter Payment Terms'
    }
    if (values.CoyType == "BUYER" &&  !values.PaymentMethod) {
        errors.PaymentMethod = 'Enter Payment Method'
    }
    if (!values.PwdDuration) {
        errors.PwdDuration = 'Enter Password Duration'
    }
   
    return errors
}

export {ValidateCompanyDetails}