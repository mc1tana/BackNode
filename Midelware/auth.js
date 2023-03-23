const jwt = require('jsonwebtoken');
const secret= require('../Sensible')
module.exports = (req, res, next) => {
   try {
    // console.log(req.headers)
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, secret.secretToken);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
    //    console.log(userId)
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};