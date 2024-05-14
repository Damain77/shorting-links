const { Router } = require('express')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const config = require('config')
const { nanoid } = require('nanoid')

const router = new Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const { from } = req.body
        const code = nanoid(8)
        const existing = await Link.findOne({ from })
        if (existing) {
            return res.json(existing)
        }
        const to = baseUrl + '/t/' + code
        const link = new Link({ code, to, from, owner: req.user.userId })
        await link.save()
        res.json(link)
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, поробуйте снова',
        })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId })
        res.status(200).json(links)
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, поробуйте снова',
        })
    }
})
router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.status(200).json(link)
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, поробуйте снова',
        })
    }
})

module.exports = router
