angular.module('toDo')

.controller('MainCtrl', ['$scope', 'userSrvc', '$location', function($scope, userSrvc, $location){
	if(!$scope.currentUser && window.localStorage.token) {
		userSrvc.startSession(window.localStorage.token)
		.then(function(data){
			$scope.currentUser = data.data
		})
	}
	$scope.$on('login', function(event, data) {
		$scope.currentUser = data
	}) 

	$scope.logoutUser = function(){
		$scope.currentUser = ''
		window.localStorage.token = ''
		userSrvc.logout()
		$location.path('/login')
	}
}])