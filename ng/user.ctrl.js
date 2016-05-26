angular.module('toDo')

.controller('UserCtrl', ['$scope', 'userSrvc', function($scope, userSrvc){
//LOGIN
	$scope.loginUser = function(data) {
		
	}


//REGISTER NEW USER
	$scope.registerError = []
	$scope.registerUser = function(data) {
		if(data.password != data.password2){
			$scope.registerError.push("Passwords don't match. Please try again")
			$scope.register.password = $scope.register.password2 = ""
			return false
		}
		userSrvc.exist({
			email: data.email
		}).then(function() {
			userSrvc.register({
				email: data.email,
				password: data.password
			}).then(function() {
				console.log('user created')
			}, function(err) {
				console.log(err)
			})
		}, function(err){
			$scope.registerError.push("This email address exist in our database already. Please try another email")
			$scope.register.email = ""
			return false			
		})


	}

//DELETE USER
	$scope.deleteUSer = function(data) {

	}

}])