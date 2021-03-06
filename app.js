(function (angular, undefined) {

  var app = angular.module('coyote', []);

  app.controller('CoyoteController', function ($scope) {

    $scope.formData = {};
    $scope.formData.keys = [];
    $scope.xml = {};
    $scope.objJson = {};
    $scope.formData.result = [];
    $scope.formData.selectedKey = '';
    $scope.formData.uniqResult = false;
    $scope.formData.orderedResult = false;

    function getKeys(obj) {
      angular.forEach(obj, function (item, index) {
        if (angular.isObject(item)) {
          return getKeys(item);
        }
        $scope.formData.keys.push(index);
      });
      $scope.formData.keys = _.uniq($scope.formData.keys);
    }

    function getValuesForKey(obj, key) {
      angular.forEach(obj, function (item, index) {
        if (angular.isObject(item)) {
          return getValuesForKey(item, key);
        }
        if (index == key) {
          $scope.formData.result.push(item);
        }
      });

      if($scope.formData.uniqResult) {
        $scope.formData.result = _.uniq($scope.formData.result);
      }
       if($scope.formData.orderedResult) {
        $scope.formData.result = _.sortBy($scope.formData.result);
       }
      if($scope.formData.trim) {
        var data = [];
        _.forEach($scope.formData.result, function(item) {
          data.push(item.replace(/\s/g,''));
        });
        $scope.formData.result = data;
      }
    }
    
    $scope.filterByString = function () {
      $scope.formData.result = []; 
      var result = [];
      
      getValuesForKey($scope.objJson, $scope.formData.selectedKey); 

      var data = _.filter($scope.formData.result, function(item) {
        if(_.contains(item.toLowerCase(), $scope.formData.filterString.toLowerCase())){
          result.push(item);
        }
      });
      $scope.formData.result = result; 
    };

    $scope.convert = function () {
      $scope.formData.result = [];
      $scope.formData.selectedKey = '';
      $scope.formData.keys = [];
      var x2js = new X2JS();
      $scope.xml = $scope.formData.xml;
      $scope.objJson = x2js.xml_str2json($scope.xml);
      getKeys($scope.objJson);
    };

    $scope.getContent = function () {
      $scope.formData.result = [];
      return getValuesForKey($scope.objJson, $scope.formData.selectedKey);
    };

    $scope.formatArray = function (ary) {

      var formattedText = '';
      angular.forEach(ary, function(item){
        formattedText = formattedText + item + '\n';
      });
      return formattedText;
    }

    $scope.updateToggle = function () {
      $("#copyToggle").off('click');
      $("#copyToggle").on( "click", function() {
        $(".clipboard").toggle();
        $(".divider").toggle();
        $(this).button('toggle')
      });
      return true;
    };

    $scope.getUniqResult = function() {
      $scope.formData.uniqResult = !$scope.formData.uniqResult;
      $scope.getContent();
    };

    $scope.getOrderedResult = function() {
      $scope.formData.orderedResult = !$scope.formData.orderedResult;
      $scope.getContent();
    };
    $scope.getTrimmedResult = function() {
      $scope.formData.trim = !$scope.formData.trim;
      $scope.getContent();
    };
    
    $scope.trim = function(data, index) {
      $scope.formData.result[index] = data.replace(/\s/g,'');
    }

  });

})(angular);


$(document).ready(function() {
  var clipboard = new Clipboard('.clipboard');
  var clipboard = new Clipboard('.clipboardAll');

});
