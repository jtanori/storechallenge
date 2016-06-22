/**
* Cart literal
*/
var Cart = function(){
    var items = {};
    var total = 0;

    // Since we are using a defined product list we can do this
    // kind of thing, when using a database or other kind of data store
    // We would check if every product we are trying to add to the
    // cart exists in the store
    function getProductCodes(){
        var productCodes = data.filter(function(product){
            return product.code;
        });
    }

    //Find valid products
    function getValidProducts(products){
        var productCodes = getProductCodes();

        return products.filter(function(product){
            if(product.code && productCodes.infexOf(product.code) >= 0){
                return product;
            }
        });
    }

    function getPrice(price, quantity){
        var totalPrice = 0;

        if(product && quantity){
            totalPrice = price * quantity;
        }

        return parseFloat(totalPrice, 10);
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
                });

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
                total = items.map(function(p){
                    if(p && p.discount){
                        return discounts.apply(p, p.quantity);
                    }else{
                        return getPrice(p.price, p.quantity);
                    }
                }).reduce(function(c, n){
                    return c + n;
                }, 0);

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
