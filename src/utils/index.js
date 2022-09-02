export const validate_firstName = (firstName) => {
    // return valid or invalid string
    return firstName.length > 1;
}

export const validate_lastName = (lastName) => {
    return lastName.length > 1;
}
 
export const validate_email = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export const validate_middleInitial = (mi) => {
    return mi.length <= 1;
}

export const validate_phone = (phone) => {
    // ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$
    return /[0-9]{10}/.test(phone);
}

export const validate_address = (address) => {
    return true;
}

export const validate_ssn = (ssn) => {
    return true;
}