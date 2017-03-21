
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
	}),
	$stateProvider.state('details', {
		url: '/details/:roomID',
		templateUrl: 'pages/channel_details.html',
		controller: 'ChannelDetailsCtrl'
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

app.controller('ProfilCtrl', function(API, $scope, $state, $http, $localStorage){

	var email = null;

	$http({
		method: 'GET',
		headers: {
			'X-Auth-Token': window.localStorage.getItem("auth_token"),
			'X-User-Id': window.localStorage.getItem("user_id"),
		},
		url: API + '/api/v1/me'

	})
	.success(function (profil_data, status) {
		$scope.profil = profil_data;
	})
	.error(function (data, status) {
		console.log('error ' + data);
	});

    /*$scope.logout = function(){
		window.localStorage.setItem("auth_token", null);
		window.localStorage.setItem("user_id", null);
		$state.go('login', {}, {location: 'replace'});
	}*/
});

app.controller('ChannelCtrl', function(API, $scope, $state, $http, $localStorage){

	var datas = null;

	$http({
		method: 'GET',
		headers: {
			'X-Auth-Token': window.localStorage.getItem("auth_token"),
			'X-User-Id': window.localStorage.getItem("user_id"),
		},
		url: API + '/api/v1/channels.list.joined'

	})
	.success(function (data, status) {
		if(data.count == 0){
			$scope.msg = "Vous n'avez encore rejoin aucun channel";
		}else{
			$scope.datas = data.channels;
			console.log(data);
		}
	})
	.error(function (data, status) {
		console.log('error ' + data);
	});  

});

app.controller('ChannelDetailsCtrl', function(API, $httpParamSerializerJQLike, $scope, $state, $http, $localStorage, $stateParams){

	$scope.roomID = $stateParams.roomID;


	$scope.postMsg = function(msg){


		console.log(msg);

		var dataObj = {
			channel : '#'+this.roomID,
			text : this.msg
		}
		console.log(dataObj);

		$http({
			method: 'POST',
			url: API + '/api/v1/chat.postMessage',
			headers: {
				'X-Auth-Token': window.localStorage.getItem("auth_token"),
				'X-User-Id': window.localStorage.getItem("user_id"),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $httpParamSerializerJQLike(dataObj)
		})
		.success(function (data, status) {
			console.log('success');
			console.log(data);
		})
		.error(function (data, status) {
			console.log('error');
			console.log(data);
		});
	}

});