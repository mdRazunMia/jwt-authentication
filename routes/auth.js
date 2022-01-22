const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validations/validatons')


router.post('/register',async(req, res) => {
    const { error, value } = registerValidation(req.body)
    if (error) {
        res.send(error.details[0].message)
    } else {
    //check user
  
    const emailExist = await User.findOne({ userEmail: value.userEmail })
        if (emailExist) return res.status(400).send({ errorMessage: "Email already exist." })    
    
    //hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashPassword =  await bcrypt.hash(value.userPassword1, salt)   
    const user = new User({
        userFullName: value.userFullName,
        userEmail: value.userEmail,
        userPassword: hashPassword
    })
    try {
        user.save(function(err,result){
    if (err){
        res.send({ errorMessage: "user is not registered successfuly."})
    }
    else{
        res.send({ message: "User has been registered successfully", user: result })
    }
})
    } catch (error) {
        if(error) res.status(400).send(error)
    }
    }

})




router.post('/login', async (req, res) => {
    const { error, value } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const checkUser = await User.findOne({ userEmail: value.userEmail})
    if (checkUser) {
        const validPasword = await bcrypt.compare(value.userPassword, checkUser.userPassword)
        if (validPasword) { 
            const token = jwt.sign({ _id: checkUser._id }, process.env.TOKEN_SECRET)
            res.header('auth-token').send(token)
            // res.send({ message: "User has been logged in successfully", user: checkUser })
        } else {
            res.send({ errorMessage: "email or Password is invalid"})
        }
    } else {
        res.send({ errorMessage: "User is not registered yet. Please register first." })
    }


})



module.exports = router