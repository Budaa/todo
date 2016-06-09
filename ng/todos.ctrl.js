
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



	/**
	 * [daySeparator description]
	 * Object created for separating days
	 * @type {Object}
	 */
	$scope.daySeparator = {}
	var daySeparator = $scope.daySeparator
	/**
	 * [Is separator for the day displayed already]
	 * @type {Array}
	 */
	daySeparator.isDisplayed = [0,0,0,0,0]
	/**
	 * [how many times was function invoked
	 * this variable helps to reset array state after re sorting todos array]
	 * @type {Number}
	 */
	daySeparator.howManyTimesInvoked = 0
	/**
	 * daySeparator
	 * Decide when to display day separator
	 * @param  {[int]}   day  [0-3. Until from TODOS model]
	 * @param  {[bool]} done [indicated if it's marked as done]
	 * @return {[bool]}        [true for displaying day separator]
	 */
	daySeparator.shoudDisplay = function(day, done) {
		if(this.howManyTimesInvoked > $scope.todos.length-1){
			this.isDisplayed[0] = false
			this.isDisplayed[1] = false
			this.isDisplayed[2] = false
			this.isDisplayed[3] = false
			this.isDisplayed[4] = false
			this.howManyTimesInvoked = 0
		}
		if(done) {
			if(!this.isDisplayed[4]){
				this.isDisplayed[4] = true
				this.howManyTimesInvoked++
				return true
			}
			this.howManyTimesInvoked++
			return false
		}
		if(!this.isDisplayed[day]) {
			this.isDisplayed[day] = true
			this.howManyTimesInvoked++
			return true
		}
		this.howManyTimesInvoked++
		return false
	}


	if(!$scope.currentUser){
		$scope.todoError.push('Please log in to see this section')
	}else {
		$scope.getTodos()
	}
}])