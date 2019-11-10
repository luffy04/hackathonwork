

var socket =io.connect();
var app = angular.module('mainapp', ['ngAnimate','ui.router']);


var myimage=$('#work');

var colors=["white","red","green","yellow","pink","indigo"]
var i=0;
socket.on('data',function (username,email) {
    // $rootScope.account=localStorage.getItem("account");
    // $rootScope.not_account="inline-block";
    // $rootScope.email=email;
    localStorage.setItem('account','none');
    localStorage.setItem('loggedIn','inline-block')
    // $rootScope.user=username;
    localStorage.setItem('user',username);
    localStorage.setItem('email',email);
    // $location.path('/home');
})
app.controller('error',['$scope','$http','$location',function ($scope,$http,$location) {
    $scope.account=localStorage.getItem('account') || 'inline-block';
    $scope.not_account=localStorage.getItem('loggedIn') || 'none';
    $scope.user=localStorage.getItem('user') || "";
    $scope.email=localStorage.getItem('email') || "";

    $scope.name="Anuj";
    $scope.Email="aryanjha82.aj55@gmail.com";
    $scope.regpassword="Anuj";
    $scope.confirmpassword="Anuj";
    $scope.username1="Anuj";
    $scope.Email1="aryanjha82.aj55@gmail.com";

    $scope.color="white";
    $scope.myVar1=true;
    $scope.login=true;
    $scope.register=false;
    $scope.myVar2=false;
    $scope.login=true;
    $scope.register=false;
    $scope.font1='5vw';
    $scope.font2='3.5vw';
    $scope.opacity1='1';
    $scope.opacity2='0.7';
    $scope.username='Anuj';
    $scope.password="Anuj";
    $scope.login1=function(){
        $scope.login=true;
        $scope.register=false;
        $scope.font1='5vw';
        $scope.font2='3.5vw';
        $scope.opacity1='1';
        $scope.opacity2='0.7';
    }
    $scope.click=function(el){
        $(el).css('background','red');
    }
    $scope.register1=function(){
        $scope.login=false;
        $scope.register=true;
        $scope.font1='3.5vw';
        $scope.font2='5vw';
        $scope.opacity1='0.7';
        $scope.opacity2='1';
    }
    $scope.redirectTo = function (path) {
        $location.path(path);
    }

    $scope.change=function(){
        i=(i+1)%colors.length;
        $scope.color=colors[i];
    }

    $scope.changing=function(files,el) {
        var reader=new FileReader();
        reader.onload =function(evt){
           // console.log(evt.target.result);
            $('#work').html(`<img src="${evt.target.result}" style="width: 40px;height: 40px">`)
        }
        reader.readAsDataURL(files[0])
    }
    $scope.registersecure = function () {
        var req = {
            url: '/register',
            method: 'POST',
            data: { user: $scope.name, mail: $scope.Email, pass: $scope.regpassword }
        };
        if($scope.regpassword!=$scope.confirmpassword){
            Snackbar.show({
                text:"Password Does not Match",
                pos:'top-center'
            })
        }else
        {
            $http(req).then(function (response) {
                console.log(response);
            })
        }
    }

    $scope.sending=function(){
        var req={
            url:'/send',
            method:'POST',
            data:{user:localStorage.getItem('user'),text:$('#work').html(),pin:false,reminder:false,color:$scope.color,title:$('#title').html()}
        }
        console.log(req.data)
        if(localStorage.getItem('user')==null || localStorage.getItem('user')=="" || localStorage.getItem('user')=="undefined"){
            Snackbar.show({
                text:"You Should Log In First.",
                pos:"top-center"
            })
        }else{
            $http(req).then(function (response) {
                console.log(response);
            })
        }
    }

    $scope.forget=function(){
        $scope.myVar2=true;
        $scope.myVar1=false;
    }

    $scope.recovery=function(){
        var req={
            url:'/recovery',
            method:'POST',
            data:{username:$scope.username1,email:$scope.Email1}
        }
        $http(req).then(function (response) {
            if(response.data=="success"){
                var req={
                    url:'/update',
                    method:"POST",
                    data:{username:$scope.username1,pass:IDGenerator()}
                }
                $http(req).then(function (response) {
                    console.log(response);
                })
            }else{
                Snackbar.show({
                    text:"Enter Valid Username And E-Mail",
                    pos:"top-center"
                })
            }
        })
    }

    function IDGenerator() {
        this.length = 8;
        this.timestamp = +new Date;
         return trap();

        function _getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function trap() {
            var ts = this.timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "a";

            for (var i = 0; i < this.length; ++i) {
                var index = _getRandomInt(0, parts.length - 1);
                id += parts[index];
            }
            specs = id;
            return id;
        }
    }

    $scope.loginsecure = function () {
        var req = {
            url: '/login',
            method: 'POST',
            data: { username: $scope.email, password: $scope.password }
        }
        $http(req).then(function (response) {
            if(response.data!='failure'){
                $rootScope.account="none";
                $rootScope.not_account="inline-block";
                $rootScope.email=response.data.email;
                localStorage.setItem('account','none');
                localStorage.setItem('loggedIn','inline-block')
                $rootScope.user=response.data.username;
                localStorage.setItem('user',response.data.username);
                localStorage.setItem('email',response.data.email);
                $location.path('/home');
                // $location.path('/clientArea');
            }
            else{
                Snackbar.show({
                    text:'Wrong Username And Password',
                    pos:'top-center',
                })
            }
        },function(response){

        })
    }
}]);

app.config(['$stateProvider','$locationProvider',function($stateProvider,$locationProvider){
    $stateProvider
        .state('home',{
            url:'/',
            templateUrl:'home.html'
        })
        .state('success',{
            url:'/work',
            templateUrl:'home.html'
        })
        .state('code',{
            url:'/code',
            templateUrl:'http.html',
            controller:'app1'
        })
        .state('project',{
            url:'/project',
            templateUrl:'project.html'
        })
        .state('login',{
            url:'/login',
            templateUrl:'client.html'
        })
        .state('language',{
            url:'/language',
            templateUrl:'code.html'
        })
        .state('queries',{
            url:'/queries',
            templateUrl:'queries.html'
        })
        .state('clientArea',{
            url:'/clientArea',
            templateUrl:'clientarea.html'
        })
    $locationProvider.html5Mode(true);
}])
