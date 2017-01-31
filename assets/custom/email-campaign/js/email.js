var app = angular.module('myModule', [])
		app.controller("validateCtrl", function($scope, $http) {
			$scope.submitForm = function(){
				
				var url = SurveyView.base_url
				+ "email-campaign/authenticate/";
				$http({
					method: 'GET',
					url: url
				}).then(function(response){
					
					alert('Valid');
					//vm.students = response.data.students;
					//$log.info(response);
				},function(reason){
					//alert('Invalid');
					//$log.info(reason);
				});	
			}
    });
