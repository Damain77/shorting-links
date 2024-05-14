const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const PORT = config.get('port') || 5000

app.use(express.json({ extended: true }))
// app.use(express.json)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use('/api/auth', require('./routes/auth_routes'))
app.use('/api/link', require('./routes/links.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUrl'))
        app.listen(PORT, () =>
            console.log(`Server has been started on ${PORT}`)
        )
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()
