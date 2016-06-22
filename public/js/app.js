angular
    .module('app', ['ui.router'])
    .constant('API_URL', 'http://localhost:5000/api')
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
                        controller: 'ProductsCtrl',
                        resolve: {
                            products: function(ProductService, $rootScope) {
                                $rootScope.loading = true;

                                return ProductService
                                    .fetch()
                                    .then(function(items){
                                        return items;
                                    }, function(e){
                                        return e;
                                    })
                                    .finally(function(){
                                        $rootScope.loading = false;
                                    });
                            }
                        }
                    }
                }
            });
    })
    .run(function($rootScope, $window){
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            console.log('change start', arguments);
        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
            console.log('state not found', arguments);
        });

        // I could have used an abstract state in the router but for brevity
        // let's set this unique function here
        $rootScope.up = function(){
            $window.scrollTo(0,0);
        }
    })
    .controller('ProductsCtrl', function($scope, $timeout, products){
        $timeout(function(){
            $scope.$apply(function(){
                $scope.items = products;
            });
        });

        $scope.add = function(product){
            console.log('add', product);
        }
    })
    .controller('CartCtrl', function(){
        console.log('main controller');
    })
    .factory('ProductService', function($http, $q, API_URL){
        return {
            fetch: function(){
                var q = $q.defer();

                $http
                    .get(API_URL + '/products')
                    .then(function(response){
                        q.resolve(response.data);
                    }, function(e){
                        q.reject(e);
                    });

                return q.promise;
            }
        }
    });
