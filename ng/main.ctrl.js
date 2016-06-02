angular.module('toDo')

.controller('MainCtrl', ['$scope', function($scope){
	$scope.$on('login', function(event, data) {
		$scope.currentUser = data
	}) 
	$scope.$on('logOut', function(){
		$scope.currentUser = ''
	})
}])