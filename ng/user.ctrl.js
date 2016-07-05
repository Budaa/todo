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

	$scope.$on('logOut', function() {
		userSrvc.logout()
		$location.path('/login')
	})


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
	$scope.deleteUser = function(data) {
		
	}

//USER STATS
	$scope.userStats = {}
	var stats = $scope.userStats 
	stats.getTodos = function(){
		userSrvc.getStats($scope.currentUser.email)
			.then(function(res){
				stats.todos = res.data
				return res.data
			}, function(err) {
				//Add error handling
				console.log(err)
			})
	}
	if($location.$$path == '/stats'){
		stats.getTodos()
	}


}])