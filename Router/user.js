const express = require('express');
const router = express.Router();
const userCtrl = require('../Controller/user');
const auth = require('../Midelware/auth');
router.post('/signup',userCtrl.signup)
router.post('/login',userCtrl.connectUser)
router.post('/delete',userCtrl.deleteUser)
router.get('/testAuth',auth,userCtrl.authTest)
router.get('/',userCtrl.allUser)


module.exports = router;