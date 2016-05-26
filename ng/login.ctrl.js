angular.module('toDo')

.controller('LoginCtrl', ['$scope', function($scope){

	$scope.loginUser = function(data) {
		console.log(data.username)
	}

}])