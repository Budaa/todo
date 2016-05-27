/**
 * TODO:
 * Fix user error raporting (multiple displaying, deleting, precise, etc)
 */

angular.module('toDo', [
	'ngRoute'
])
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
		 * Function to trim whitespaces etc from edges of the string
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
			username: 'pbuderaski',
			until: todo.until
		}).success(function(res){
			$scope.todos.push(res)
			$scope.todo.body = ""
		}).error(function(err){
			$scope.todoError.push("There was a problem adding your post to the database and it wasn't saved")
		})
	}


	$scope.getTodos = function() {
		var user = 'pbuderaski'
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

$scope.getTodos()
	
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

.controller('UserCtrl', ['$scope', 'userSrvc', function($scope, userSrvc){
//LOGIN
	$scope.loginUser = function(data) {
		
	}


//REGISTER NEW USER
	//register errprs array
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
	this.exist = function(email) {
		return $http.get('/api/user/register/' + email)
	}

	this.register = function(data) {
		return $http.post('/api/user/register', data)
	}
}])