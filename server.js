const express = require('express')
const app = express()
const mongoose = require('mongoose')

//routes 
const authRoute = require('./routes/auth')
const campaignRoute = require('./routes/campaign')

require('dotenv').config()

//connect to DB
mongoose.connect(process.env.MONGO_DB_URL, () => {
    console.log('Database connection is successfull.')
})

//middleware
app.use(express.json())



app.use('/api/user', authRoute)
app.use('/api/campaign', campaignRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`)
})

