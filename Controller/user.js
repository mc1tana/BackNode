const express=require('express')
const User=require('../Model/User')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');
const secret= require('../Sensible')
exports.allUser=(req,res,next)=>{
  User.find({}).then(e=>{console.log(e)})
  next()
}
exports.signup = (req, res, next) => {
  // const user = new User({
  //   email: req.body.email,
  //   password: req.body.password
  // });
  // user.save()
  //   .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
  //   .catch(error => res.status(400).json({ error }));
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
  exports.connectUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
          console.log(user);
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                  // console.log(jwt.sign({ userId: user._id },'RANDOM_TOKEN_SECRET',{ expiresIn: '24h' }))
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                          { userId: user._id },
                          secret.secretToken,
                          { expiresIn: '24h' }
                      )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
 exports.deleteUser = (req, res, next) => {
  User.deleteOne({ email: req.body.email })
      .then(r=>{
        console.log(r)
        r.deletedCount == 1 ? res.status(201).json({message : "user deleted"}) : res.status(400).json({message : "not deleted !"})
        
      }).catch(error => res.status(500).json({ error }));
      
     
};
exports.testApi= (req, res, next)=>{
  res.status(200).json({message : "test ok !"});
  next();
}
exports.authTest = (req,res,next)=>{
      console.log(" part euthentification ok !");
      next();
}