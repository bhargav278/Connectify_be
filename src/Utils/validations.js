
const signUpValidations = (req) => {
    const { firstName, lastName, userName, emailId, age, gender, phoneNo, password } = req.body;
    if ([firstName, lastName, userName, emailId, age, gender, phoneNo, password].some(field => !field)) {
        throw new Error("Required Fields are Empty!");
    }
}

const getTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization; // Get the "Authorization" header
    if (authHeader && authHeader.startsWith("Bearer")) {
        return authHeader.split(" ")[1]; // Extract token after "Bearer "
    }
    return null; // Return null if no token found
};

module.exports = {
    signUpValidations,
    getTokenFromHeader
}