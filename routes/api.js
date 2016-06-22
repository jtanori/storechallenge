var express = require('express');
var _ = require('lodash');
var router = express.Router();
var discounts = require('../discounts');
var Cart = require('../Cart');
var data = require('../data/products');
/**
* Ensure we have a cart instance to use
*/
function ensureCart(req, res, next){
    var sess = req.session;

    console.log('session', sess);

    if(!sess.cart || !(sess.cart instanceof Cart)){
        sess.cart = new Cart();
    }

    next();
}

/**
* Post to the cart endpoint
* Will add products to current cart instance
*
* @param {array} products
* @return {object}
*/
router.post('/cart', ensureCart, function(req, res, next) {
    var products = req.body.products;
    var session = req.session;

    if(!_.isEmpty(products)){
        if(_.isArray(products)){
            console.log(products, 'products to add');
            //Get current cart
            var cart = session.cart;
            //Try adding products
            var total = cart.add(products);
            //Return calculations
            res.status(200).json(total);
        }else {
            res.status(400).json({message: 'Invalid products'});
        }
    }else {
        res.status(400).json({message: 'Can not add products to cart'});
    }
});

/**
* Get to the cart endpoint
* Returns current products and totals in cart
*
* @return {object}
*/
router.get('/cart', ensureCart, function(req, res, next) {
    var session = req.session;
    //Return totals
    res.status(200).json(session.cart.getTotals());
});

/**
* Delete product from current cart, recalculate totals
* Returns current products and totals in cart
*
* @return {object}
*/
router.delete('/cart', function(req, res, next) {
    var session = req.session;
    var code = req.body.code;

    session.cart.remove(code);
    //Return totals
    res.status(200).json(session.cart.update());
});

/**
* Get to the products endpoint
* Returns on sale products
*
* @return {array}
*/
router.get('/products', function(req, res, next) {
    res.status(200).json(data.get());
});

module.exports = router;
