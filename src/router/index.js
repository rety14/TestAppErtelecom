import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "main" */ '../views/Home.vue')
	},
	{
		path: '/note:id',
		name: 'Note',
		component: () => import(/* webpackChunkName: "main" */ '../views/NoteFull.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else if (to.hash && !to.hash.includes('hcm=')) {
			return {selector: to.hash}
		} else {
			return {x: 0, y: 0}
		}
	}
})

export default router
