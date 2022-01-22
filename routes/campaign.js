const express = require('express')
const router = express.Router()
const verify = require('../validations/verified')

router.get('/',verify,(req, res) => {
    res.json({
        campaingName: "Balk SMS",
        Language: "Bangla"
   }) 
})

module.exports = router