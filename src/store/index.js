import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
    ifLogin: false, //是否已登陆
    name: '',//用户姓名  
    username: '',//用户编号  
    role: '',//用户角色  
    roleId: '',//角色ID  [1:系统管理员 2:任课教师 3:学生]
    genderId: '',//性别ID  [1:男 2:女]
    //如果是学生的话还有以下参数
    grade: '',//年级   
    major: '',//专业 
    l_class: '',//班级 
  },
  mutations: {
    //用户信息初始化设置
    initUserInfo: (state, info) => {
      state.roleId = info.roleId
      //closeDebug console.log('当前角色设为：'+info.roleId)
      state.name = info.name
      state.username = info.username
      state.role = info.role
      state.genderId = info.genderId
      if(info.roleId === 3){
        state.grade = info.grade
        state.major = info.major
        state.l_class = info.l_class
      }else{
        state.grade = null
        state.major = null
        state.l_class = null
      }
    },
    //设置登陆状态「未启用」
    setLoginState: (state, LoginState) => {
      //closeDebug console.log('当前登陆状态设为：',LoginState)
      state.ifLogin = LoginState
    },
  },
  getters: {
    ifLogin: state => state.ifLogin,//是否已登陆
    name: state => state.name,
    username: state => state.username,//用户编号  
    role: state => state.role,//用户角色  
    roleId: state => state.roleId,//角色ID  [1:系统管理员 2:任课教师 3:学生]
    genderId: state => state.genderId,//性别ID  [1:男 2:女]
    //如果是学生的话还有以下参数
    grade: state => state.grade,//年级   
    major: state => state.major,//专业 
    l_class: state => state.l_class,//班级 
  },
  actions: {
    
  },
  modules: {
  }
})

export default store
