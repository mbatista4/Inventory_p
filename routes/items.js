const router = require('express').Router();
const Item = require('../models/item');
const User = require('../models/User');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

const {
    ensureAuthenticated
} = require('../config/auth');




router.get('/', async (req, res) => {

    //let query = Item.find();

    try {
        const items = await Item.find({});
        res.render('items/index', {
            items: items
        });

    } catch {

    }
})

router.get('/new', (req, res) => {
    renderNewPage(res, new Item());
})

//Create Item route
router.post('/', async (req, res) => {

    const item = new Item({
        name: req.body.name,
        type: req.body.itemType,
        description: req.body.description,
        Owner: req.body.user
    });

    saveCover(item, req.body.cover);

    try {
        const newItem = await item.save();
        console.log('DONE!');
        res.redirect('users/');
    } catch (err) {
        console.log(err);
        renderNewPage(res, item, err);
    }

});

function renderNewPage(res, item, err = null) {
    renderFormPage(res, item, 'new', err);
}

async function renderFormPage(res, item, form, err = null) {
    try {
        const users = await User.find({});
        let locals = {
            item: item,
            users: users
        };

        if (err != null) locals.Message = err;

        res.render(`items/${form}`, locals);
    } catch {
        console.log('here');
        res.redirect('items');
    }
}

function saveCover(item, coverEncoded) {
    if (coverEncoded == null)
        return;
    const cover = JSON.parse(coverEncoded);

    if (cover != null && imageMimeTypes.includes(cover.type)) {
        item.coverImage = new Buffer.from(cover.data, 'base64');
        item.coverImageType = cover.type;
    }
}

module.exports = router;