angular.module('toDo')

.controller('UserCtrl', ['$scope', '$location', 'userSrvc', function($scope, $location, userSrvc){
//LOGIN
	//Login Error array
	$scope.loginError = []
	$scope.loginUser = function(data) {
		userSrvc.login({
			email: data.email,
			password: data.password
		}).then(function(res) {
			//logged in!
			$scope.currentUser = res.data.email
			$scope.$emit('login', {
				email: res.data.email
			})
			$location.path('/')
		}, function(err){
			//sett err notification
			console.log(err)
			console.log(err.data.error)
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