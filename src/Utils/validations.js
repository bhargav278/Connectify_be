
const signUpValidations = (req) => {
    const { firstName, lastName, userName, emailId, age, gender, phoneNo, password } = req.body;
    if ([firstName, lastName, userName, emailId, age, gender, phoneNo, password].some(field => !field)) {
        throw new Error("Required Fields are Empty!");
    }
}

module.exports = {signUpValidations}