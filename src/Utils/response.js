
function sendResponse(statusCode,data,res){
    return res.status(statusCode).send(data);
}

module.exports = {sendResponse}