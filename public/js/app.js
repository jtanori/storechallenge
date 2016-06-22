angular
    .module('app', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        //Default
        $urlRouterProvider.otherwise("index");

        console.log($stateProvider);
        //States
        $stateProvider
            .state('index', {
                url: "",
                views: {
                    "cart": {
                        templateUrl: "templates/cart.html",
                        controller: 'CartCtrl'
                    },
                    "menu": {
                        templateUrl: "templates/menu.html",
                        controller: 'ProductsCtrl'
                    }
                }
            });
    })
    .run(function($rootScope){
        console.log('run');
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            console.log('change start', arguments);
        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
            console.log('state not found', arguments);
        });
    })
    .controller('ProductsCtrl', function(){
        console.log('products controller');
    })
    .controller('CartCtrl', function(){
        console.log('main controller');
    })
