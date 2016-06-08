[1mdiff --git a/assets/app.js b/assets/app.js[m
[1mindex 1b8529a..5652f05 100644[m
[1m--- a/assets/app.js[m
[1m+++ b/assets/app.js[m
[36m@@ -21,6 +21,7 @@[m [mangular.module('toDo')[m
 [m
 	$scope.logoutUser = function(){[m
 		$scope.currentUser = ''[m
[32m+[m		[32m$scope.todo = {}[m
 		window.localStorage.token = ''[m
 		userSrvc.logout()[m
 		$location.path('/login')[m
[36m@@ -59,13 +60,14 @@[m [mangular.module('toDo')[m
 		String.prototype.trim = function () {[m
 	    	return this.replace(/^\s*/, "").replace(/\s*$/, "");[m
 		}[m
[31m-		if (todo) {[m
[31m-			todo.body.trim()[m
[31m-		}[m
[31m-		if( todo === undefined || todo.body === "") {[m
[32m+[m		[32mif( todo === undefined || todo.body === "" || todo.body === undefined) {[m
 			$scope.todoError.push("Todo can not be empty!")[m
 			return false[m
 		}[m
[32m+[m		[32mif (todo) {[m
[32m+[m			[32mtodo.body.trim()[m
[32m+[m		[32m}[m
[32m+[m
 [m
 		todo.until = parseInt(todo.until, 10)[m
 [m
[36m@@ -92,6 +94,24 @@[m [mangular.module('toDo')[m
 			})[m
 	}[m
 	[m
[32m+[m	[32m$scope.when = function(num) {[m
[32m+[m		[32mswitch(num) {[m
[32m+[m			[32mcase 0:[m
[32m+[m				[32mreturn "Today"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mcase 1:[m
[32m+[m				[32mreturn "Tomorrow"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mcase 2:[m
[32m+[m				[32mreturn "This week"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mcase 3:[m
[32m+[m				[32mreturn "Some day"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mdefault:[m
[32m+[m				[32mreturn "Error occured"[m
[32m+[m		[32m}[m
[32m+[m	[32m}[m
 	[m
 	$scope.doneTodo = function(id, status) {[m
 		todoSrvc.done({id: id})[m
[1mdiff --git a/ng/main.ctrl.js b/ng/main.ctrl.js[m
[1mindex 5ec2cf6..19fda38 100644[m
[1m--- a/ng/main.ctrl.js[m
[1m+++ b/ng/main.ctrl.js[m
[36m@@ -13,6 +13,7 @@[m [mangular.module('toDo')[m
 [m
 	$scope.logoutUser = function(){[m
 		$scope.currentUser = ''[m
[32m+[m		[32m$scope.todo = {}[m
 		window.localStorage.token = ''[m
 		userSrvc.logout()[m
 		$location.path('/login')[m
[1mdiff --git a/ng/todos.ctrl.js b/ng/todos.ctrl.js[m
[1mindex 90c6d84..47e5299 100644[m
[1m--- a/ng/todos.ctrl.js[m
[1m+++ b/ng/todos.ctrl.js[m
[36m@@ -23,13 +23,14 @@[m [mangular.module('toDo')[m
 		String.prototype.trim = function () {[m
 	    	return this.replace(/^\s*/, "").replace(/\s*$/, "");[m
 		}[m
[31m-		if (todo) {[m
[31m-			todo.body.trim()[m
[31m-		}[m
[31m-		if( todo === undefined || todo.body === "") {[m
[32m+[m		[32mif( todo === undefined || todo.body === "" || todo.body === undefined) {[m
 			$scope.todoError.push("Todo can not be empty!")[m
 			return false[m
 		}[m
[32m+[m		[32mif (todo) {[m
[32m+[m			[32mtodo.body.trim()[m
[32m+[m		[32m}[m
[32m+[m
 [m
 		todo.until = parseInt(todo.until, 10)[m
 [m
[36m@@ -56,6 +57,24 @@[m [mangular.module('toDo')[m
 			})[m
 	}[m
 	[m
[32m+[m	[32m$scope.when = function(num) {[m
[32m+[m		[32mswitch(num) {[m
[32m+[m			[32mcase 0:[m
[32m+[m				[32mreturn "Today"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mcase 1:[m
[32m+[m				[32mreturn "Tomorrow"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mcase 2:[m
[32m+[m				[32mreturn "This week"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mcase 3:[m
[32m+[m				[32mreturn "Some day"[m
[32m+[m				[32mbreak[m
[32m+[m			[32mdefault:[m
[32m+[m				[32mreturn "Error occured"[m
[32m+[m		[32m}[m
[32m+[m	[32m}[m
 	[m
 	$scope.doneTodo = function(id, status) {[m
 		todoSrvc.done({id: id})[m
[1mdiff --git a/templates/todos.html b/templates/todos.html[m
[1mindex 44a6132..eed635f 100644[m
[1m--- a/templates/todos.html[m
[1m+++ b/templates/todos.html[m
[36m@@ -32,10 +32,11 @@[m
 	</form>[m
 	<div class="row">[m
 		<div class="col-sm-4 col-sm-offset-4 todo-main">[m
[31m-			<div class="checkbox text-center todo-each" ng-repeat="todos in todos | orderBy : '-done' : '-until': '-date' track by todos._id"ng-click="order(todos)">[m
[32m+[m			[32m<div class="checkbox text-center todo-each" ng-repeat="todos in todos | orderBy:['done', 'until', '-date'] track by todos._id" ng-click="order(todos)">[m
 			<label>[m
 				<input ng-checked="todos.done" type="checkbox" ng-click="doneTodo(todos._id, todos.done)">[m
[31m-				{{todos.body}} [m
[32m+[m				[32m{{todos.body}}<br />[m
[32m+[m				[32m{{when(todos.until)}}[m
 			</label>[m
 			<div class="row">[m
 				<div class="col-sm-4 col-sm-offset-8">[m
