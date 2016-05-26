angular.module('toDo')
.config(function($routeProvider) {
	$routeProvider
	  .when('/', {controller: 'TodosCtrl', templateUrl: 'todos.html'})
	  .when('/register', {controller: 'RegisterCtrl', templateUrl: 'register.html'})
	  .when('/login', {controller: 'LoginCtrl', templateUrl: 'login.html'})
})