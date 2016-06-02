/**
 * TODO:
 * Fix user error raporting (multiple displaying, deleting, precise, etc)
 */

angular.module('toDo', [
	'ngRoute'
])
angular.module('toDo')

.controller('MainCtrl', ['$scope', function($scope){
	$scope.$on('login', function(event, data) {
		$scope.currentUser = data
	}) 
	$scope.$on('logOut', function(){
		$scope.currentUser = ''
	})
}])
angular.module('toDo')
.config(function($routeProvider) {
	$routeProvider
	  .when('/', {controller: 'TodosCtrl', templateUrl: 'todos.html'})
	  .when('/register', {controller: 'UserCtrl', templateUrl: 'register.html'})
	  .when('/login', {controller: 'UserCtrl', templateUrl: 'login.html'})
	  .otherwise({redirectTo: '/'})
})

angular.module('toDo')
.controller('TodosCtrl', ['$scope', 'todoSrvc', '$filter', function($scope, todoSrvc, $filter) {

	/**
	 * Error loger. Please format messeges for user output
	 * @type {Array}
	 */
	$scope.todoError = []



	/**
	 * Creating new Todo for user
	 * @param  {[json]} todo [body and username]
	 * @return {[type]}      [Error message or seting $scope.body to null and pushing new todo to view]
	 */
	$scope.createTodo = function(todo){
		/**
		 * Function to trim whitespaces  from edges of the string
		 * @return {[string]} [return trimed string]
		 */
		String.prototype.trim = function () {
	    	return this.replace(/^\s*/, "").replace(/\s*$/, "");
		}
		if (todo) {
			todo.body.trim()
		}
		if( todo === undefined || todo.body === "") {
			$scope.todoError.push("Todo can not be empty!")
			return false
		}

		todo.until = parseInt(todo.until, 10)

		todoSrvc.create({
			body: todo.body,
			username: $scope.currentUser.email,
			until: todo.until
		}).success(function(res){
			$scope.todos.push(res)
			$scope.todo.body = ""
		}).error(function(err){
			$scope.todoError.push("There was a problem adding your post to the database and it wasn't saved")
		})
	}


	$scope.getTodos = function() {
		var user = $scope.currentUser.email
		todoSrvc.fetch(user)
			.success(function(data) {
				$scope.todos = data 
			}).error(function(err) {
				$scope.todoError.push("There was a problem getting your data")				
			})
	}
	
	
	$scope.doneTodo = function(id, status) {
		todoSrvc.done({id: id})
			.success(function(data){
				for (var i=$scope.todos.length-1; i>=0; i--) {
    				if ($scope.todos[i]._id === data._id) {
	        			$scope.todos[i].done = !status
	        			break       
        			}
        		}
			}).error(function(err) {
				$scope.todoError.push("There was a problem setting todo as done")	
			})
	}

	$scope.deleteTodo = function(id) {
		todoSrvc.delete(id)
			.success(function(data) {
				for (var i=$scope.todos.length-1; i>=0; i--) {
    				if ($scope.todos[i]._id === id) {
	        			$scope.todos.splice(i, 1)
	        			break       
        			}
        		}
			}).error(function(err) {
				$scope.todoError.push("There was a problem deleting todo")
			})
	}
	

	if(!$scope.currentUser){
		$scope.todoError.push('Please log in to see this section')
	}else {
		$scope.getTodos()
	}
}])
angular.module('toDo')
.service('todoSrvc', ['$http', function($http){
	this.create = function(data) {
		return $http.post('/api/todo', data)
	}

	//TODO
	//change for better user verification 
	this.fetch = function(user) {
		return $http.get('/api/todo/' + user)
	}

	this.done = function(id) {
		return $http.patch('/api/todo',  id)
	}

	this.delete = function(id) {
		return $http.delete('/api/todo/' + id)
	}
}])
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

	$scope.logOut = function() {
		userSrvc.logout()
		$scope.$emit('logOut')
		$location.path('/login')
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
angular.module('toDo')

.service('userSrvc', ['$http', function($http){
	var svc = this
	svc.exist = function(email) {
		return $http.get('/api/user/register/' + email)
	}

	svc.login = function(data) {
		return $http.post('/api/user/login', data)
			.then(function(token) {
				$http.defaults.headers.common['X-Auth'] = token.data
				return svc.getUser()
			})
	}

	svc.logout = function(){
		$http.defaults.headers.common['X-Auth'] = ''
		return true
	}

	svc.getUser = function() {
		return $http.get('/api/user')
	}

	svc.register = function(data) {
		return $http.post('/api/user/register', data)
	}

	svc.startSession = function(token) {
	}
}])