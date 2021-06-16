<template>
	<div class="top-block">
		<div class="top-block__body" :class="{collapse: collapse}">
			<div class="wrap">
				<slot/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TopBlock',
	data: () => ({
		collapse: false
	}),

	beforeMount() {
		window.addEventListener('scroll', this.scroll)
	},

	destroyed() {
		window.removeEventListener('scroll', this.scroll)
	},

	methods: {
		scroll() {
			this.collapse = window.scrollY >= 40
		}
	}
}
</script>

<style>
	.top-block {position:relative;margin-bottom:30px;height:110px;}
	.top-block__body {display:flex;align-items:center;position:fixed;z-index:10;top:0;right:0;left:0;height:110px;transition:height .3s;background:#fff;box-shadow:0 30px 30px -30px rgba(0,0,0,.15);}
	.top-block__body.collapse {height:70px;box-shadow:0 30px 30px -15px rgba(0,0,0,.15);}
	.top-block .wrap {display:flex;align-items:center;width:100%;min-height:50px;}

	@media (max-width:650px) {
		.top-block {margin-bottom:15px;height:80px;}
		.top-block__body {height:80px;}
		.top-block__body.collapse {height:64px;}
		.top-block__body.collapse .create__field {padding-top:10px;padding-bottom:10px;}
		.top-block__body.collapse .create__btn {height:35px;}
	}
</style>
