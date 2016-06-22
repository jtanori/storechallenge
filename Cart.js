//products data
var data = require('./data/products');
var discounts = require('./discounts');

/**
* Cart literal
*/
var Cart = function(){
    var items = {};
    var total = 0;

    //Find valid products
    function getValidProducts(products){
        var productCodes = data.indexAllByCode();

        return products.filter(function(product){
            if(product.code && productCodes[product.code]){
                product.price = productCodes[product.code].price;
                product.name = productCodes[product.code].name;

                return product;
            }
        });
    }

    //Calculate price for product
    function getPrice(price, quantity){
        var totalPrice = 0;

        if(price && quantity){
            totalPrice = price * quantity;
        }

        return parseFloat(totalPrice, 10);
    }

    //Check and get discount for product
    function hasDiscount(code, quantity){
        var product = data.get(code);

        if(product && product.discount)
            return product.discount;

        return false;
    }

    // Public methods
    return {
        add: function(products){
            products = getValidProducts(products);

            if(products && products.length){
                //Override quantities
                products.forEach(function(p){
                    p.quantity = p.quantity || 1;

                    if(items[p.code]){
                        items[p.code].quantity = p.quantity;
                    }else {
                        items[p.code] = p;
                    }
                    //Check and get current discount setup for given product
                    var productHasDiscount = hasDiscount(p.code, p.quantity);

                    if(productHasDiscount){
                        items[p.code].discount = productHasDiscount;
                    }
                });
                //Return updated cart
                return this.update();
            }else{
                throw new Error('Invalid products');
            }
        },
        remove: function(code){
            if(items && items[code]){
                delete items[code];
                return true;
            }
            // Return false just to know there was no product to remove
            // maybe log the operation for further improvements
            return false;
        },
        update: function(){
            try{
                //Calculate totals
                total = Object.keys(items).map(function(p){
                    var product = items[p];
                    var price = 0;

                    if(product && product.discount){
                        try{
                            price = discounts.apply(product);
                            product.discountApplied = true;
                            product.price = price;

                            return price;
                        }catch(e){
                            console.log(e, 'error');
                            return getPrice(product.price, product.quantity);
                        }
                    }else{
                        console.log('calculate price', product);
                        return getPrice(product.price, product.quantity);
                    }
                });

                console.log('on update', total, items);

                total = total.reduce(function(c, n){
                    console.log(c, n, 'reduce');
                    return c + n;
                }, 0)

                return {total: total, items: items};
            }catch(e){
                return new Error('No items in cart');
            }
        },
        getProducts: function(){
            return items;
        },
        getTotals: function(){
            return {total: total, items: items};
        }
    }
};

module.exports = Cart;
