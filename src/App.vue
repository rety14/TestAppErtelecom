<template>
	<div id="app" :class="{routing: routing}">
		<transition :name="transitionName">
			<router-view class="main"/>
		</transition>
		<footer>Марданов Михаил, тестовое задание для ЭР-Телеком Холдинг</footer>
	</div>
</template>

<script>
import '@/assets/css/general.css'

export default {
	data: () => ({
		transitionName: null,
		routing: false
	}),

	beforeCreate() {
		this.$store.dispatch('getNotes')
	},

	watch: {
		$route(to, from) {
			if (from.name) this.transitionName = to.path === '/' ? 'slide-right' : 'slide-left'
			this.routing = true
			setTimeout(() => {
				this.routing = false
			}, 500)
		}
	}
}
</script>

<style>
	#app {position:relative;display:flex;flex-direction:column;min-height:100vh;}
	#app.routing::before {content:'';position:absolute;z-index:-1;top:0;right:0;left:0;height:110px;background:#fff;}
	.main {flex:1 0 auto;}
	footer {position:relative;z-index:-2;flex:0 0 auto;padding:20px;color:#9696ac;font-size:.8rem;text-align:center;}

	.slide-right-enter-active.main,
	.slide-left-enter-active.main,
	.slide-right-leave-active.main,
	.slide-left-leave-active.main {position:absolute;top:0;right:0;left:0;transform-origin:0 0;transition:transform .4s, opacity .4s;}
	.slide-left-enter, .slide-right-leave-active {opacity:0;transform:translateX(10%);}
	.slide-left-leave-active, .slide-right-enter {opacity:0;transform:translateX(-10%);}

	@media (max-width:650px) {
		#app.routing::before {height:80px;}
	}
</style>
