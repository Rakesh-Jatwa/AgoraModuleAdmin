const validateTableInput = (value, allValues, props) => {
    const membersArrayErrors = []
}

const AddUserGroup = (values) => {
 
    const errors = {}
    if (!values.userGroupId) {
       errors.userGroupId = 'Enter User Group ID'
    }
    if (!values.userGroupName) {
        errors.userGroupName = 'Enter User Group Name'
    }
    if (!values.appPackageId) {
        errors.appPackageId = 'Choose App Package ID'
    }
    if (!values.role) {
        errors.role = 'Choose Role'
    }
    if (!values.type) {
        errors.type = 'Choose Type'
    }
    console.log('AddUserGroup',values, errors)
    return errors
}

export {validateTableInput, AddUserGroup}