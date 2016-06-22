/**
* Obviously this can be constructed in a better way when having a database
* you can do it multiple ways:
* e.g.
*   Setup predefined deals as records in the db and linking products to it
*   Configure coupons to apply to any product(s)
*   Configure global deals that don't need to be linked to a product(s)
*   in order to work
*   ...
*/
var data = [
    {
        code: 'PANTS',
        name: 'Pants',
        price: 5,
        discount: {
            min: 2,
            module: 2,
            giveWay: 1//Give one away when buying 2 or more
        }
    },
    {
        code: 'TSHIRT',
        name: 'T-Shirt',
        price: 20,
        discount: {
            min: 3,
            fixedTo: 19//Fix price to
        }
    },
    {
        code: 'HAT',
        name: 'Hat',
        price: 7.5
    },
];

module.exports = {
    get: function(code){
        if(code){
            var product = data.find(function(p){
                console.log(p.code, code);
                return p.code === code;
            });

            console.log('product found', product);

            return product;
        }

        return data;
    },
    indexAllByCode: function(){
        var o = {};

        data.forEach(function(p){
            o[p.code] = p;
        });

        return o;
    }
};
