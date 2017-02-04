import Vue from 'vue';
import AV from 'leancloud-storage';

var APP_ID = 'i4SRTcD38Ivzjrqv88a6QaGW-gzGzoHsz';
var APP_KEY = 'j9sJO2wnT1pfFyKncqvEJUlx';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var app1 = new Vue({
	el: '#app',
	data:{
		actionType: 'signUp',
		imgSrc: 'demo.jpg',
		username: '',
		password: '',
		currentUser: '',
		launch: false,
		content: '',
		status: false,
		realTime: '',
		infoList: []
	},
	created: function(){
		this.currentUser = this.getCurrentUser();
		this.getInfo();
	},
	methods: {
		addInfo: function(){
			var nowTime = new Date();
			var year = nowTime.getFullYear(),
				month = nowTime.getMonth() + 1,
				date = nowTime.getDate(),
				hours = nowTime.getHours(),
				minutes = nowTime.getMinutes()

			this.realTime = year+'-'+month+'-'+date+' '+hours+':'+minutes;
			this.infoList.push({
				launchTime: this.realTime,
				launchContent: this.content
			});
			//隐藏输入框
			this.launch = false;

			//保存或者更新云端的数据
			this.newOrUpdate();

			this.content = '';
		},
		newInfoList: function(){	
			var dataString = JSON.stringify(this.infoList);	
			// 声明一个 InfoList 类型
			var InfoList = AV.Object.extend('infoList');
			// 新建一个 InfoList 对象
			var infolist = new InfoList();

			// 新建一个 ACL 实例
			var acl = new AV.ACL();
			acl.setReadAccess(AV.User.current(),true);
			acl.setWriteAccess(AV.User.current(),true);

			infolist.set('time', this.realTime);
			infolist.set('content', this.content);

			infolist.setACL(acl);

			infolist.save().then((infolist) => {

				this.infoList.id = infolist.id;
				// console.log('新建成功')
			}, function (error) {
				// 异常处理
				// console.error('Failed to create new object, with error message: ' + error.message);
				console.log('new error');
			});
		},
		updateInfoList: function(){
			var dataString = JSON.stringify(this.infoList);
			// 第一个参数是 className，第二个参数是 objectId
			var infolist = AV.Object.createWithoutData('infoList', this.infoList.id);
			// 修改属性
			
			infolist.set('content', dataString);
			// 保存到云端
			infolist.save();
			// console.log('更新成功')
		},
		newOrUpdate: function(){
			if(this.infoList.id){
				this.updateInfoList();
			}else{
				this.newInfoList();
			}
		},
		getInfo: function(){
			if(this.currentUser){
				this.status = true;
				var query = new AV.Query('infoList');

				query.find().then((infolist) => {
					let alliInfoList = infolist[0];
					let id = alliInfoList.id;
					this.infoList = JSON.parse(alliInfoList.attributes.content);
					this.infoList.id = id;
				}, function (error) {
					console.log('get error')
				});
			}
		},
		signUp: function(){
			// 新建 AVUser 对象实例
			var user = new AV.User();
			// 设置用户名
			user.setUsername(this.username);
			// 设置密码
			user.setPassword(this.password);

			user.signUp().then((loginedUser) => {
				
				this.currentUser = this.getCurrentUser()
				alert('注册成功');

				//显示信息页面
				this.status = true;
			}, (error) => {
				console.log('signUp error')
			});
		},
		login: function(){

			AV.User.logIn(this.username, this.password).then((loginedUser) => {
				this.currentUser = this.getCurrentUser();

				this.getInfo();

				// console.log('登陆成功');

				//显示信息页面
				this.status = true;
			}, (error) => {
				console.log('login error');
			});
		},
		logout: function(){
			AV.User.logOut();
			// 现在的 currentUser 是 null 了
			var currentUser = AV.User.current();
			this.status = false;
			this.launch = false;
			window.location.reload();
		},
		getCurrentUser: function(){
			this.username = '';
			this.password = '';
			var current = AV.User.current();

			if (current) {
				let {id, createdAt, attributes: {username}} = current;
				return {id, username, createdAt};
			} else {
				return null;
			}
		},
		stick: function(){
			console.log(1)
		}
	}
});