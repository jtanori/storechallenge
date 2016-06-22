var discounts = {
    /**
    * Apply disconts (if available) to given product
    *
    * @param {object} product
    * @param {number} quantity
    */
    apply: function(product){
        var total, price, m;
        var discount = product.discount;
        var quantity = parseInt(product.quantity, 10);
        var price = parseFloat(product.price, 10);
        /*
        * For the current approach we can write our rules in a single function
        * this of course can be later improved for using a different approach:
        * e.g. coupons, multiple product discount, seasonal deals and more
        */
        if(quantity && price && discount){
            if(quantity >= discount.min){
                if(discount.module){
                    //This is a modular discount (for each x give x away)
                    total = Math.floor((quantity / discount.module)) * product.price;

                    console.log('GIVEAWAY');
                    console.log(total, 'total');
                    m = quantity%discount.module;
                    console.log('module', m, product.price);
                    //Did we pass a
                    if(m){
                        total += product.price;
                    }
                }else if(discount.fixedTo){
                    //This is fixed price discount (fix price to X when buying X or more)
                    total = quantity * discount.fixedTo;
                }

                return total;
            }else{
                throw new Error('Discount applies only when buying ' + product.discount.min + ' or more of ' + product.name);
            }
        }else{
            throw new Error('Can not apply discount');
        }
    }
};

module.exports = discounts;
