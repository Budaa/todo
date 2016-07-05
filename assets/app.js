/**
 * TODO:
 * Fix user error raporting (multiple displaying, deleting, precise, etc)
 */

angular.module('toDo', [
	'ngRoute'
])
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
		$scope.todo = {}
		window.localStorage.token = ''
		userSrvc.logout()
		$location.path('/login')
	}
}])
angular.module('toDo')
.config(function($routeProvider) {
	$routeProvider
	  .when('/', {controller: 'TodosCtrl', templateUrl: 'todos.html'})
	  .when('/register', {controller: 'UserCtrl', templateUrl: 'register.html'})
	  .when('/login', {controller: 'UserCtrl', templateUrl: 'login.html'})
	  .when('/stats', {controller: 'UserCtrl', templateUrl: 'stats.html'})
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
		if( todo === undefined || todo.body === "" || todo.body === undefined) {
			$scope.todoError.push("Todo can not be empty!")
			return false
		}
		if (todo) {
			todo.body.trim()
		}


		todo.until = parseInt(todo.until, 10)

		todoSrvc.create({
			body: todo.body,
			username: $scope.currentUser.email,
			until: todo.until
		}).success(function(res){
			$scope.todos.push(res)
			$scope.todo.body = ""
			$scope.sortTodos()
		}).error(function(err){
			$scope.todoError.push("There was a problem adding your post to the database and it wasn't saved")
		})


	}


	/**
	 * Get todos form database and push them into $scope.todos
	 * @return {[null]} [nothing to return]
	 */
	$scope.getTodos = function() {
		var user = $scope.currentUser.email
		todoSrvc.fetch(user)
			.success(function(data) {
				$scope.todos = data 
				$scope.sortTodos()
			}).error(function(err) {
				$scope.todoError.push("There was a problem getting your data")				
			})
	}
	
	/**
	 * Returning todo deadline in human friendly format - function for sorting todos
	 * @param  {[int]}   num  [0-3]
	 * @param  {[bool]} done [pass if todo is done]
	 * @return {[string]}        [daydline in human friendly form]
	 */
	$scope.when = function(num, done) {
		if(done) {
			return "Done"
		}
		switch(num) {
			case 0:
				return "Today"
				break
			case 1:
				return "Tomorrow"
				break
			case 2:
				return "This week"
				break
			case 3:
				return "Some day"
				break
			default:
				return "Error occured"
		}
	}
	
	/**
	 * Mark todo as done or unmark it. Sending changes to database and change it in local $scope
	 * @param  {[todo]} id     [todo _id]
	 * @return {[null]}        [nothing to return]
	 */
	$scope.doneTodo = function(id) {
		todoSrvc.done({id: id})
			.success(function(data){
				for (var i=$scope.todos.length-1; i>=0; i--) {
    				if ($scope.todos[i]._id === data._id) {
	        			$scope.todos[i].done = !$scope.todos[i].done
	        			$scope.sortTodos()
	        			break       
        			}
        		}
			}).error(function(err) {
				$scope.todoError.push("There was a problem setting todo as done")	
			})
	}

	/**
	 * Delete todo from local scope and database
	 * @param  {[todo]} id [todo _id]
	 * @return {[null]}    [nothing to return]
	 */
	$scope.deleteTodo = function(id) {
		todoSrvc.delete(id)
			.success(function(data) {
				for (var i=$scope.todos.length-1; i>=0; i--) {
    				if ($scope.todos[i]._id === id) {
	        			$scope.todos.splice(i, 1)
	        			$scope.sortTodos()
	        			break       
        			}
        		}
			}).error(function(err) {
				$scope.todoError.push("There was a problem deleting todo")
			})
	}

	/**
	 * [Sorts Todos object done, until and -date]
	 * invokes setTodos function
	 */
	$scope.sortTodos = function(){
		$scope.todos = $filter('orderBy')($scope.todos, ['done', 'until', '-date'])
		setTodosLabels()
	}
	/**
	 * [
	 * Set todos.label
	 * true for first of a kind
	 * else false
	 * ]
	 */
	var setTodosLabels = function() {
		var isDisplayed = [0,0,0,0,0]
		var day = 0
		for (var i = 0; i <= $scope.todos.length-1 ; i++) {
			day = $scope.todos[i].until
			if($scope.todos[i].done == true){
				if(isDisplayed[4] === 0){
					isDisplayed[4] = 1
					$scope.todos[i].label = true
					continue
				}else{
					$scope.todos[i].label = false
					continue
				}
			}
			if(isDisplayed[day] === 0){
				isDisplayed[day] = 1
				$scope.todos[i].label = true
				continue
			}
			if(isDisplayed[day] === 1) {
				$scope.todos[i].label = false
				continue
			}
		}
	}

	/**
	 * IF user logged in, get todos from database, otherwise display logIn error
	 */
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
angular.module('toDo')

.service('userSrvc', ['$http', function($http){
	var svc = this
	svc.exist = function(email) {
		return $http.get('/api/user/register/' + email)
	}

	svc.login = function(data) {
		return $http.post('/api/user/login', data)
			.then(function(token) {	
				return svc.startSession(token.data)
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

	svc.startSession = function(token, remember = true) {
		$http.defaults.headers.common['X-Auth'] = token
		if(remember){
			window.localStorage.token = token
		}
		return svc.getUser()
			.then(function(data){
				return data
			})
	}

	svc.getStats = function(email){
		return $http.get('/api/user/stat/' + email)
	}
}])