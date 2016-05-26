angular.module('toDo')
.config(function($routeProvider) {
	$routeProvider
	  .when('/', {controller: 'TodosCtrl', templateUrl: 'todos.html'})
	  .when('/register', {controller: 'UserCtrl', templateUrl: 'register.html'})
	  .when('/login', {controller: 'UserCtrl', templateUrl: 'login.html'})
	  .otherwise({redirectTo: '/'})
})