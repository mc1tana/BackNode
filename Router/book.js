const express = require('express');
const router = express.Router();
const multer= require('../Midelware/multerFichier')
const bookCtrl = require('../Controller/book');
const auth = require('../Midelware/auth');
router.get('/', bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);
// router.get('/bestrating',bookCtrl.getAllBook)

// router.get( "/bestrating" , (req, res,next)=>{console.log("ok ?!");next();} )
// router.get('/bestrating', bookCtrl.getMostRatingBooks);

// router.get('/bestrating', bookCtrl.getMostRatingBooks);
router.post('/:id/rating',auth, bookCtrl.modifyRating);
router.post('/',auth,multer, bookCtrl.createBook);
router.put('/:id',auth,multer, bookCtrl.modifyBook);
router.delete('/:id',auth, bookCtrl.deleteBook);
// router.get('/bestrating',bookCtrl.getAllBook)

// router.get('/', (req, res, next)=>{console.log("ok?!");next()});
router.get('/bestrating', bookCtrl.getMostRatingBooks);
// router.get('/:id', stuffCtrl.getOneThing);
// router.put('/:id', stuffCtrl.modifyThing);
// router.delete('/:id', stuffCtrl.deleteThing);

module.exports = router;