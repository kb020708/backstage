import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Main from '@/pages/Main'
const myPush = Router.prototype.push
Router.prototype.push = function (v){
  return myPush.call(this,v).catch(e=>e)
}
Vue.use(Router)

const router  = new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
    {
      path:'/',
      name:'login',
      component:Login
    },
    {
      path:'/main',
      name:'main',
      component:Main,
      children:[
        {
          path:'users',
          name:'users',
          component:()=>import ("../pages/plus/Users")
        },
        {
          path:'roles',
          name:'roles',
          component:()=>import ("../pages/plus/Roles")
        },
        {
          path:'orders',
          name:'orders',
          component:()=>import ("../pages/plus/Orders")
        },
        {
          path:'goods',
          name:'goods',
          component:()=>import ("../pages/plus/Goods")
        },
        {
          path:'params',
          name:'params',
          component:()=>import ("../pages/plus/Params")
        },
        {
          path:'reports',
          name:'reports',
          component:()=>import ("../pages/plus/Reports")
        },
        {
          path:'categories',
          name:'categories',
          component:()=>import ("../pages/plus/Categories")
        },
        {
          path:'rights',
          name:'rights',
          component:()=>import ("../pages/plus/Rights")
        }

      ]
    }
  ]
})
//路由守卫
//全局守卫  登录验证   判断登录
router.beforeEach((to,from,next)=>{
  let token = sessionStorage.token
  if(to.path!=="/"){
      if(token){
        next()
      }else{
        next('/')
      }
  }else{
    next()
  }
  // console.log(to);
  // console.log(from);
  // next()
})


export default router