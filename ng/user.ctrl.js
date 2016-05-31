angular.module('toDo')

.controller('UserCtrl', ['$scope', 'userSrvc', function($scope, userSrvc){
//LOGIN
	$scope.loginError = []
	$scope.loginUser = function(data) {
		console.log(data)
		userSrvc.login({
			email: data.email,
			password: data.password
		}).then(function(token) {
			//sett the token
			console.log(token)
		}, function(err){
			//sett err notification
			console.log(err)
		})		
	}


//REGISTER NEW USER
	//register errors array
	$scope.registerError = []
	$scope.registerUser = function(data) {
		if(data.password != data.password2){
			$scope.registerError.push("Passwords don't match. Please try again")
			$scope.register.password = $scope.register.password2 = ""
			return false
		}
		//create new user
		userSrvc.register({
			email: data.email,
			password: data.password
		}).then(function() {
			console.log('user created')
			//login user straight away
		}, function(err) {
			$scope.registerError.push("This email address exist in our database already. Please try another email")
			$scope.register.email = ""
			console.log(err)
		})

	}

//DELETE USER
	$scope.deleteUSer = function(data) {
		
	}

}])