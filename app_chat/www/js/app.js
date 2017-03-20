
var app = angular.module('app', ['ionic', 'ngStorage']);

app.constant('API', '')

/* active this line on production..
app.constant('API', 'https://demo.rocket.chat')*/

/*app.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})*/

app.config(function($stateProvider, $urlRouterProvider){


	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'pages/login.html',
		controller: 'LoginCtrl'
	}),
	$stateProvider.state('channel', {
		url: '/channel',
		templateUrl: 'pages/channel.html',
		controller: 'ChannelCtrl'
	})

	$urlRouterProvider.otherwise('/login');
})

app.controller('LoginCtrl', function(API, $scope, $state, $http, $httpParamSerializerJQLike, $localStorage, $ionicHistory) {

	$scope.submit = function(){

		$ionicHistory.nextViewOptions({
			disableBack: true
		});

		var dataObj = {
			user : this.username,
			password : this.password
		}

		$http({
			method: 'POST',
			url: API + '/api/v1/login',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $httpParamSerializerJQLike(dataObj)
		})
		.success(function (data, status) {
			data = data.data;

			window.localStorage.setItem("auth_token", data.authToken);
			window.localStorage.setItem("user_id", data.userId);

			/*console.log(window.localStorage.getItem("auth_token"));
			console.log(window.localStorage.getItem("user_id"));*/

			$state.go('channel', {}, {location: 'replace'});
		})
		.error(function (data, status) {
			console.log(data);
		});  
	}
});

app.controller('ChannelCtrl', function(API, $scope, $state, $http, $localStorage){

	var datas = null;

	$http({
		method: 'GET',
		headers: {
			'X-Auth-Token': window.localStorage.getItem("auth_token"),
			'X-User-Id': window.localStorage.getItem("user_id"),
		},
		url: API + '/api/v1/channels.list'
	
	})
	.success(function (data, status) {
		$scope.datas = data.channels;
	})
	.error(function (data, status) {
		console.log('error ' + data);
	});  

});