(function(){"use strict";angular.module("lemonades",["ngCookies","ngResource","ngSanitize","ngRoute","googleplus","ngFacebook","angulartics","ngToast","ngIntercom","lemonades.config","angulartics.google.analytics"]).run(["$rootScope","$location","$http","$cookieStore","$intercom","config",function(a,b,c,d,e,f){return a.baseUrl=f.baseUrl,a.loading=!1,a.title="Lemonades.in : Next Generation of Group Buying",a.image="",a.user={},a.url="http://www.lemonades.in",a.description="Select product -> Create Groups -> Get huge bulk discounts.",a.getUser=function(){var b;return b={method:"GET",url:a.baseUrl+"/api/v1/user",headers:{"Session-Key":d.get("lmnsskey")}},c(b).success(function(b){return b.success?(a.user=b.user,e.boot({email:b.user.email,user_id:b.user.id,created_at:b.user.created_at}),e.hide()):void 0}).error(function(){})},a.goToLogin=function(){return b.path("/login")}}]).config(["$intercomProvider","config",function(a,b){return a.appID(b.intercomAppId),a.asyncLoading(!0)}]).run(["$intercom","$rootScope",function(a,b){}]).factory("myHttpInterceptor",["$q","$window","$rootScope","$location","$cookieStore",function(a,b,c,d,e){return{request:function(a){return a.ignoreLoadingFlag||(c.loading=!0),a},requestError:function(b){return c.loading=!1,canRecover(b)?responseOrNewPromise:a.reject(b)},response:function(a){return c.loading=!1,a},responseError:function(b){var d;return c.loading=!1,d=b.status,401===d&&e.remove("lmnsskey"),a.reject(b)}}}]).config(["ngToastProvider",function(a){return a.configure({animation:"slide"})}]).config(["$httpProvider",function(a){return a.interceptors.push("myHttpInterceptor"),delete a.defaults.headers.common["X-Requested-With"],a.defaults.useXDomain=!0}]).config(["$facebookProvider",function(a){return a.setAppId("1608020712745966").setPermissions(["email"])}]).config(["GooglePlusProvider",function(a){return a.init({clientId:"277507848931-4jccaqqqi3jllpam40n7j1jrq2kup01i.apps.googleusercontent.com",apiKey:"AIzaSyA3F3vE_vglkKVeMq-U6mnSkg4h1vhQHPM"})}]).run(["$rootScope","$window",function(a,b){return function(a,b,c){var d,e;return d=a.getElementsByTagName(b)[0],e=a.createElement(b),e.id=c,e.src="//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1608020712745966&version=v2.3",d.parentNode.insertBefore(e,d)}(document,"script","facebook-jssdk"),a.$on("fb.load",function(){b.dispatchEvent(new Event("fb.load"))})}]).config(["$routeProvider","$locationProvider",function(a,b){return a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/register",{templateUrl:"views/register.html",controller:"RegisterCtrl"}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl"}).when("/register/success",{templateUrl:"views/register/success.html",controller:"RegisterSuccessCtrl"}).when("/group/:id",{templateUrl:"views/group.html",controller:"GroupCtrl"}).when("/my-groups",{templateUrl:"views/my-groups.html",controller:"MyGroupsCtrl"}).when("/user/:auth_key/reset_password",{templateUrl:"views/reset_password.html",controller:"ResetPasswordCtrl"}).when("/user/:auth_key/confirm_email",{templateUrl:"views/confirm_email.html",controller:"ConfirmEmailCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode({enabled:!1,requireBase:!0}).hashPrefix()}])}).call(this),angular.module("lemonades.config",[]).constant("config",{name:"production",baseUrl:"http://lemonades.elasticbeanstalk.com",intercomAppId:"cqvishpk"}),function(){"use strict";angular.module("lemonades").controller("MainCtrl",["$scope","$location","$rootScope","$cookieStore","$http","$intercom",function(a,b,c,d,e,f){return a.sessionKey=d.get("lmnsskey"),a.deals={},a.dashboard=function(){return b.path("/dashboard")},a.init=function(){return function(a,b,c){var d,e;return d=a.getElementsByTagName(b)[0],e=a.createElement(b),e.id=c,e.src="//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1608020712745966&version=v2.3",d.parentNode.insertBefore(e,d)}(document,"script","facebook-jssdk"),c.title="Lemonades.in : Next Generation of Group Buying",c.image="",c.url="http://www.lemonades.in",c.description="Select product -> Create Groups -> Get huge bulk discounts.",c.getUser(),a.getGroups()},a.goToGroup=function(a){return b.path("/group/"+a)},a.getGroups=function(){var b;return console.log("Getting groups"),b={method:"GET",url:c.baseUrl+"/api/v1/groups",headers:{"Session-Key":a.sessionKey}},e(b).success(function(b){b.success&&(b.groups.length>6&&(a.groups=b.groups.slice(0,6)),b.groups.length<=6&&(a.groups=b.groups))}).error(function(b){return a.groups=[]})},a.login=function(){return b.path("/login")},a.register=function(){return b.path("/register")},a.dashboard=function(){return b.path("/dashboard")}}])}.call(this),function(){"use strict";angular.module("lemonades").controller("LoginCtrl",["$scope","$cookieStore","$http","$rootScope","$location","session","$facebook","ngToast","GooglePlus",function(a,b,c,d,e,f,g,h,i){return a.user={},a.fbUser={},a.fbStatus=null,a.object={},d.title="Lemonades.in : Next Generation of Group Buying",d.image="",d.url="http://www.lemonades.in",d.description="Select product -> Create Groups -> Get huge bulk discounts.",a.landing=function(){return e.path("/")},a.register=function(){return e.path("/register")},a.login=function(){var g;return g=$("#loginButton").button("loading"),c.post(d.baseUrl+"/api/v1/user/login",a.user).success(function(c){return g.button("reset"),c.success?(f.store(c.user),b.put("lmnsskey",c.user.session_key,{expires:1,path:"/"}),void e.path("/dashboard")):a.status={message:c.message,success:!1}}).error(function(b){return g.button("reset"),a.status={message:b.message,success:!1}})},a.loginWithFacebook=function(){return console.log("Logging in with facebook",g.isConnected()),null===g.isConnected()||g.isConnected()===!1?void h.create({className:"danger",content:"There was some error in logging in with facebook !!\nRefresh Page and Try again"}):(a.fbStatus=g.isConnected(),a.fbStatus?(g.api("/me").then(function(i){a.fbUser=i,g.api("/"+i.id+"/picture").then(function(a){var j;return j={email:i.email,name:i.first_name+" "+i.last_name,profile_pic:a.data.url,fb_user_id:i.id,fb_token:g.getAuthResponse().accessToken,is_fb:!0,gender:i.gender},c.post(d.baseUrl+"/api/v1/user/fb_login",j).success(function(a){return a.success?(f.store(a.user),b.put("lmnsskey",a.user.session_key,{expires:1,path:"/"}),e.path("/dashboard")):void 0}).error(function(a){return h.create({className:"danger",content:"There was some error in logging in with Facebook. Please try again"})})})}),function(a){return h.create({className:"danger",content:"There was some error in logging in with Facebook. Please try again"})}):void 0)},a.loginWithGooglePlus=function(){return i.login().then(function(a){i.getUser().then(function(g){var i;i={email:g.email,name:g.name,gender:g.gender,profile_pic:g.picture,gplus_user_id:g.id,gplus_token:a.access_token,is_gplus:!0},c.post(d.baseUrl+"/api/v1/user/gplus_login",i).success(function(a){return a.success?(f.store(a.user),b.put("lmnsskey",a.user.session_key,{expires:1,path:"/"}),e.path("/dashboard")):void 0}).error(function(a){return h.create({className:"danger",content:"There was some error in logging in with Google Plus. Please try again"})})})},function(a){return h.create({className:"danger",content:"There was some error in logging in with Google Plus. Please try again"})})},a.forgotPassword=function(){return a.fg_status={},void 0===a.object.email||""===a.object.email?void(a.fg_status={message:"Please provide a valid email address",success:!1}):c.post(d.baseUrl+"/api/v1/user/forgot_password",a.object).success(function(a){return a.success?($("#forgotPasswordModal").modal("hide"),void h.create({className:"success",content:a.message})):h.create({className:"danger",content:a.message})}).error(function(a){return h.create({className:"danger",content:"There was some error while resetting the password, Please try again !"})})}}])}.call(this),function(){"use strict";angular.module("lemonades").controller("RegisterCtrl",["$scope","$cookieStore","$http","$rootScope","$location","session","$facebook","ngToast","GooglePlus",function(a,b,c,d,e,f,g,h,i){return a.user={},a.landing=function(){return e.path("/")},a.login=function(){return e.path("/login")},a.register=function(){var b;return void 0===a.user.password?void(a.status={message:"Min length of password must be 8 characters",success:!1}):a.user.password!==a.user.confirm_password?void(a.status={message:"Passwords are not matching",success:!1}):(b=$("#signUpButton").button("loading"),console.log("registering"),c.post(d.baseUrl+"/api/v1/user",a.user).success(function(c){return b.button("reset"),a.status={},c.success?void e.path("/register/success"):a.status={message:c.message,success:!1}}).error(function(c){return b.button("reset"),a.status={message:c.message,success:!1}}))},a.loginWithFacebook=function(){return console.log("Logging in with facebook",g.isConnected()),null===g.isConnected()||g.isConnected()===!1?void h.create({className:"danger",content:"There was some error in logging in with facebook !!\nRefresh Page and Try again"}):(a.fbStatus=g.isConnected(),void(a.fbStatus&&g.api("/me").then(function(i){console.log(i),a.fbUser=i,g.api("/"+i.id+"/picture").then(function(a){var j;return j={email:i.email,name:i.first_name+" "+i.last_name,profile_pic:a.data.url,fb_user_id:i.id,fb_token:g.getAuthResponse().accessToken,is_fb:!0,gender:i.gender},console.log("Sending ",j),c.post(d.baseUrl+"/api/v1/user/fb_login",j).success(function(a){return a.success?(f.store(a.user),b.put("lmnsskey",a.user.session_key,{expires:1,path:"/"}),e.path("/dashboard")):void 0}).error(function(a){return h.create({className:"danger",content:"There was some error in logging in with Facebook. Please try again"})})})})))},a.loginWithGooglePlus=function(){return i.login().then(function(a){console.log(a),i.getUser().then(function(g){var i;i={email:g.email,name:g.name,gender:g.gender,profile_pic:g.picture,gplus_user_id:g.id,gplus_token:a.access_token,is_gplus:!0},c.post(d.baseUrl+"/api/v1/user/gplus_login",i).success(function(a){return a.success?(f.store(a.user),b.put("lmnsskey",a.user.session_key,{expires:1,path:"/"}),e.path("/dashboard")):void 0}).error(function(a){return h.create({className:"danger",content:"There was some error in logging in with Google Plus. Please try again"})})})},function(a){return h.create({className:"danger",content:"There was some error in logging in with Google Plus. Please try again"})})}}])}.call(this),function(){"use strict";angular.module("lemonades").controller("DashboardCtrl",["$scope","$cookies","$cookieStore","$http","$rootScope","$location","$intercom",function(a,b,c,d,e,f,g){return a.sessionKey=c.get("lmnsskey"),a.object={},a.pageNo=0,a.groups={},e.title="Lemonades.in : Next Generation of Group Buying",e.image="",e.url="http://www.lemonades.in",e.description="Select product -> Create Groups -> Get huge bulk discounts.",a.init=function(){return e.getUser(),a.getGroups()},a.landing=function(){return f.path("/")},a.myGroups=function(){return f.path("/my-groups")},a.goToGroup=function(a){return f.path("/group/"+a)},a.initHowItWorks=function(){return $("#howItWorks").carousel({interval:5e3}),$("#howItWorks").carousel("cycle"),$("#howItWorks").carousel(0)},a.logout=function(){var b;return b={method:"POST",url:e.baseUrl+"/api/v1/user/logout",headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){b.success&&(g.shutdown(),c.remove("lmnsskey"),a.sessionKey=null)}).error(function(a){})},a.getGroups=function(){var b;return b={method:"GET",url:e.baseUrl+"/api/v1/groups?page="+a.pageNo,headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){if(b.success){if(null===b.groups)return void(a.pageNo=-1);0===a.pageNo?a.groups=b.groups:a.groups=a.groups.concat(b.groups),b.groups.length<9?a.pageNo=-1:a.pageNo+=1}}).error(function(a){})},a.createGroup=function(){var b,c;return b=$("#createGroup").button("loading"),c={method:"POST",url:e.baseUrl+"/api/v1/group",headers:{"Session-Key":a.sessionKey},data:a.object},d(c).success(function(c){return $("#createGroupModal").modal("hide"),b.button("reset"),c.success?void f.path("/group/"+c.group.id):a.status={message:c.message,success:!1}}).error(function(c){return b.button("reset"),a.status={message:c.message,success:!1}})}}])}.call(this),function(){"use strict";angular.module("lemonades").controller("RegisterSuccessCtrl",["$scope","$location",function(a,b){return a.landing=function(){return b.path("/")},a.dashboard=function(){return b.path("/dashboard")}}])}.call(this),function(){"use strict";angular.module("lemonades").factory("session",function(){var a;return a=null,{store:function(a){return this.user=a},get:function(){return a}}})}.call(this),function(){"use strict";angular.module("lemonades").controller("GroupCtrl",["$scope","$cookies","$cookieStore","$http","$rootScope","$routeParams","$location","$intercom",function(a,b,c,d,e,f,g,h){return a.sessionKey=c.get("lmnsskey"),a.groupId=f.id,a.group={},a.shareText="Buy electronic items in group with huge discounts #onlineshopping #lemonades",a.init=function(){return e.getUser(),function(a,b,c){var d,e;return d=a.getElementsByTagName(b)[0],e=a.createElement(b),e.id=c,e.src="//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1608020712745966&version=v2.3",d.parentNode.insertBefore(e,d)}(document,"script","facebook-jssdk")},a.initHowItWorks=function(){return $("#howItWorks").carousel({interval:5e3}),$("#howItWorks").carousel("cycle"),$("#howItWorks").carousel(0)},a.login=function(){return g.path("/login")},a.joinGroup=function(){var b;return b={method:"POST",url:e.baseUrl+"/api/v1/group/"+a.groupId+"/join",headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){b.success&&(a.group=b.group)}).error(function(a){})},a.logout=function(){var b;return b={method:"POST",url:e.baseUrl+"/api/v1/user/logout",headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){b.success&&(h.shutdown(),c.remove("lmnsskey"),a.sessionKey=null)}).error(function(a){})},a.createGroup=function(){var b,c;return b=$("#createGroup").button("loading"),c={method:"POST",url:e.baseUrl+"/api/v1/group",headers:{"Session-Key":a.sessionKey},data:a.object},d(c).success(function(c){return b.button("reset"),$("#createGroupModal").modal("hide"),c.success?void g.path("/group/"+c.group.id):a.status={message:c.message,success:!1}}).error(function(c){return b.button("reset"),a.status={message:c.message,success:!1}})},a.dashboard=function(){return g.path("/dashboard")},a.init=function(){var b;return b={method:"GET",url:e.baseUrl+"/api/v1/group/"+a.groupId,headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){return b.success?(e.title="Buy "+b.group.product.name+" with a group on lemonades.in",e.image=b.group.product.product_image,e.url=g.absUrl(),1===b.group.interested_users_count&&(e.description=b.group.interested_users_count+" person is interested in buying "+b.group.product.name+". Join him on lemonades and get huge discount."),b.group.interested_users_count>1&&(e.description=b.group.interested_users_count+" people are interested in buying "+b.group.product.name+". Join them on lemonades and get huge discount."),a.group=b.group,void(a.shareText="Buy "+b.group.product.name+" with "+b.group.interested_users_count+" on lemonades.in")):a.status={message:b.message,success:!1}}).error(function(b){return a.status={message:b.message,success:!1}})}}])}.call(this),function(){"use strict";angular.module("lemonades").controller("MyGroupsCtrl",["$scope","$cookies","$cookieStore","$http","$rootScope","$location","$intercom",function(a,b,c,d,e,f,g){return a.sessionKey=c.get("lmnsskey"),a.object={},a.pageNo=0,a.joinedGroupPageNo=0,a.createdGroups=[],a.joinedGroups=[],e.title="Lemonades.in : Next Generation of Group Buying",e.image="",e.url="http://www.lemonades.in",e.description="Select product -> Create Groups -> Get huge bulk discounts.",a.init=function(){return e.getUser(),""===a.sessionKey?void f.path("/dashboard"):(a.getCreatedGroups(),a.getJoinedGroups())},a.landing=function(){return f.path("/")},a.allGroups=function(){return f.path("/dashboard")},a.goToGroup=function(a){return f.path("/group/"+a)},a.logout=function(){var b;return b={method:"POST",url:e.baseUrl+"/api/v1/user/logout",headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){b.success&&(g.shutdown(),c.remove("lmnsskey"),f.path("/dashboard"),a.sessionKey=null)}).error(function(a){})},a.getCreatedGroups=function(){var b;return b={method:"GET",url:e.baseUrl+"/api/v1/user/groups/created?page="+a.pageNo,headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){if(b.success){if(null===b.created_groups)return void(a.pageNo=-1);0===a.pageNo?a.createdGroups=b.created_groups:a.createdGroups=a.groups.concat(b.created_groups),b.created_groups.length<9?a.pageNo=-1:a.pageNo+=1}}).error(function(a){})},a.getJoinedGroups=function(){var b;return b={method:"GET",url:e.baseUrl+"/api/v1/user/groups/joined?page="+a.joinedGroupPageNo,headers:{"Session-Key":a.sessionKey}},d(b).success(function(b){if(b.success){if(null===b.joined_groups)return void(a.joinedGroupPageNo=-1);0===a.joinedGroupPageNo?a.joinedGroups=b.joined_groups:a.joinedGroups=a.groups.concat(b.joined_groups),b.joined_groups.length<9?a.joinedGroupPageNo=-1:a.joinedGroupPageNo+=1}}).error(function(a){})},a.createGroup=function(){var b,c;return b=$("#createGroup").button("loading"),c={method:"POST",url:e.baseUrl+"/api/v1/group",headers:{"Session-Key":a.sessionKey},data:a.object},d(c).success(function(c){return $("#createGroupModal").modal("hide"),b.button("reset"),c.success?void f.path("/group/"+c.group.id):a.status={message:c.message,success:!1}}).error(function(c){return b.button("reset"),a.status={message:c.message,success:!1}})}}])}.call(this),function(){"use strict";angular.module("lemonades").controller("ResetPasswordCtrl",["$scope","$http","$rootScope","$routeParams","$location","ngToast",function(a,b,c,d,e,f){var g;return a.user={},a.status={},g=d.auth_key,a.resetPassword=function(){return void 0===a.user.password||""===a.user.password||a.user.password!==a.user.confirm_password||a.user.password.length<8?void(a.status={success:!1,message:"Please provide a valid password"}):b.post(c.baseUrl+"/api/v1/user/"+g+"/update_password",a.user).success(function(a){return a.success?void e.path("/login"):f.create({className:"danger",content:a.message})}).error(function(a){return f.create({className:"danger",content:a.message})})}}])}.call(this),function(){"use strict";angular.module("lemonades").controller("ConfirmEmailCtrl",["$scope","$http","$rootScope","$routeParams","$location","ngToast",function(a,b,c,d,e,f){var g;return g=d.auth_key,c.title="Lemonades.in : Next Generation of Group Buying",c.image="",c.url="http://www.lemonades.in",c.description="Select product -> Create Groups -> Get huge bulk discounts.",a.validate=function(){return b.post(c.baseUrl+"/api/v1/user/"+g+"/confirm_email",null).success(function(a){return a.success?(f.create({className:"success",content:a.message}),void e.path("/login")):f.create({className:"danger",content:a.message})}).error(function(a){return f.create({className:"danger",content:a.message})})}}])}.call(this),function(){"use strict";angular.module("lemonades").directive("group",function(){return{templateUrl:"views/directives/group.html",restrict:"E",controller:["$scope","$location",function(a,b){return a.goToGroup=function(a){return b.path("/group/"+a)}}],link:function(a,b,c){}}})}.call(this),function(){"use strict";angular.module("lemonades").directive("showtab",function(){return{link:function(a,b,c){b.click(function(a){a.preventDefault(),$(b).tab("show")})}}})}.call(this);
//# sourceMappingURL=app.map