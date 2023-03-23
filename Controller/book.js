const express=require('express')
const User=require('../Model/User')
const Book=require('../Model/Book')
const fs = require('fs');

exports.getAllBook= (req, res, next) => {
    Book.find()
      .then(books => {res.status(200).json(books)})
      .catch(error => res.status(400).json({ error }));
  }
  exports.getOneBook= (req, res, next) => {
    Book.findOne({_id:req.params.id})
      .then(book => {res.status(200).json(book)})
      .catch(error => res.status(400).json({ error }));
  }
  exports.getMostRatingBooks= (req, res, next) => {
    Book.find()
      .then(books =>{
        const bestBooks=books.sort((a,b)=>{a.averageRating-b.averageRating;})
         res.status(200).json(bestBooks.slice(bestBooks.length-3,bestBooks.length))}
         )
      .catch(error => res.status(401).json({ error }));
  }
exports.createBook=(req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message : 'Not authorized'});
  } else {
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
    }
  }

exports.modifyBook= (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };

delete bookObject._userId;
Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
  }

exports.deleteBook= (req, res, next) => {
  Book.findOne({ _id: req.params.id})
  .then(book => {
      if (book.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              book.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
 };

 
 exports.modifyRating= (req, res, next) => {
  // console.log(req.body)
  console.log(req.params.id)
Book.findOne({_id: req.params.id})
    .then((book) => {
        if (!req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
          let moye=0;
          book.ratings.push({"userId":req.auth.userId,"grade":req.body.rating})
          book.ratings.forEach(elt => {
                if(book.ratings.findIndex(e=>e.userId==elt.userId)==0==true){
                  moye=elt.grade
                }else{
                moye=(moye+elt.grade)/2
              }
          });
        book.averageRating=moye
          const bookObject=new Book({...book})
            Book.updateOne({ _id: req.params.id}, { ...book._doc, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!',book:book._doc}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
  }
