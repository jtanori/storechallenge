angular
    .module('app', ['ui.router'])
    .constant('API_URL', '/api')
    .config(function($stateProvider, $urlRouterProvider) {
        //Default
        $urlRouterProvider.otherwise("index");

        //States
        $stateProvider
            .state('index', {
                url: "",
                views: {
                    "main": {
                        templateUrl: "templates/main.html",
                        controller: 'MainCtrl',
                        resolve: {
                            products: function(RequestService, $rootScope) {
                                $rootScope.showLoading();

                                return RequestService
                                    .do('products')
                                    .then(function(items){
                                        return items;
                                    }, function(e){
                                        return e;
                                    });
                            },
                            cart: function(RequestService, $rootScope){
                                $rootScope.showLoading();

                                return RequestService
                                    .do('cart')
                                    .then(function(items){
                                        return items;
                                    }, function(e){
                                        return e;
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
        // let's set this unique two functions here
        $rootScope.up = function(){
            $window.scrollTo(0,0);
        };

        $rootScope.showLoading = function(message){
            $rootScope.loading = true;
            $rootScope.loadingMessage = message || 'Loading...';
        };

        $rootScope.hideLoading = function(){
            $rootScope.loading = false;
            $rootScope.loadingMessage = 'Loading...';
        };
    })
    .controller('MainCtrl', function($scope, $timeout, $rootScope, products, cart, RequestService){
        $timeout(function(){
            $scope.$apply(function(){
                $scope.products = products;
                $scope.cart = cart;
            });
        });

        $scope.add = function(product){
            if($scope.timer)
                $timeout.cancel($scope.timer);

            $timeout(function(){
                $scope.$apply(function(){
                    if($scope.cart.items[product.code]){
                        $scope.cart.items[product.code].quantity += 1;
                    }else{
                        $scope.cart.items[product.code] = {
                            code: product.code,
                            name: product.name,
                            price: product.price,
                            quantity: 1
                        }
                    }

                    $scope.cart.items[product.code].price = $scope.cart.items[product.code].quantity * product.price;

                    //Ask server for data after 1s of inactivity
                    $scope.timer = $timeout(function(){
                        $rootScope.showLoading('Updating Cart...');

                        //Map values
                        var items = Object.keys($scope.cart.items).map(function(p){
                            return {
                                code: $scope.cart.items[p].code,
                                quantity: $scope.cart.items[p].quantity
                            };
                        });

                        //Update server
                        RequestService
                            .do('cart', 'POST', {products: items})
                            .then(function(response){
                                $timeout(function(){
                                    $scope.$apply(function(){
                                        $scope.cart.items = response.items;
                                        $scope.cart.total = response.total;
                                    });
                                });
                            }, function(e){
                                alert(e.message);
                            })
                            .finally(function(){
                                $rootScope.hideLoading();
                            })
                    }, 1000);
                });
            });
        };

        //Hide main loading indicator
        $rootScope.hideLoading();
    })
    .factory('RequestService', function($http, $q, API_URL){
        return {
            //Simple request service
            do: function(endpoint, method, options){
                var q = $q.defer();
                var request;

                switch(method){
                case 'POST': request = $http.post; break;
                case 'DELETE': request = $http.delete; break;
                default: request = $http.get;
                }

                request(API_URL + '/' + endpoint, options)
                    .then(function(response){
                        console.log('response', response);
                        q.resolve(response.data || []);
                    }, function(e){
                        console.log('error', e);
                        q.reject(e);
                    });

                return q.promise;
            }
        }
    });
