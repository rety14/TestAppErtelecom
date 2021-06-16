<template>
	<transition name="confirm" duration="600">
		<div class="confirm" v-if="value" @click.self="close()">
			<div class="confirm__win">
				<button class="confirm__close" @click="close()">
					<svg-ico name="close"/>
				</button>

				<div class="confirm__ico">!</div>

				<div class="confirm__title" v-if="$slots.title">
					<slot name="title"/>
				</div>

				<div class="confirm__btns" ref="btns">
					<slot name="button"/>
					<button class="btn btn_color_gray" @click="close()">Отмена</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import SvgIco from '@/components/base/SvgIco'

export default {
	name: 'ConfirmModal',
	components: {
		SvgIco
	},

	props: {
		value: {
			type: Boolean,
			default: false
		}
	},

	watch: {
		value() {
			if (this.value) {
				this.bodyScrollToggle(true)
				setTimeout(() => {
					this.$refs.btns.querySelector('button').focus()
				})
				document.addEventListener('keydown', this.keyEscClose)
			} else {
				setTimeout(() => this.bodyScrollToggle(false), 300)
				document.removeEventListener('keydown', this.keyEscClose)
			}
		}
	},

	methods: {
		close() {
			this.$emit('input', false)
		},

		keyEscClose(e) {
			if (e.keyCode === 27) this.close()
		},

		bodyScrollToggle(action) {
			const topBlock = document.querySelector('.top-block__body')
			if (action) {
				const paddingRight = this.getScrollbarWidth() + 'px'
				document.body.classList.add('hidden')
				if (topBlock) topBlock.style.right = paddingRight
				document.body.style.paddingRight = paddingRight
			} else {
				document.body.classList.remove('hidden')
				if (topBlock) topBlock.style.right = 0
				document.body.style.padding = ''
			}
		},

		getScrollbarWidth() {
			let scrollbarWidth = 0
			const outer = document.createElement('div')
			outer.style.visibility = 'hidden'
			outer.style.overflow = 'scroll'
			document.body.appendChild(outer)

			const inner = document.createElement('div')
			outer.appendChild(inner)

			scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)
			outer.parentNode.removeChild(outer)

			return scrollbarWidth
		}
	}
}
</script>

<style>
	/* Anim overlay */
	.confirm-enter-active {transition:opacity .2s;}
	.confirm-leave-active {transition:opacity .2s .15s;}
	.confirm-enter,
	.confirm-leave-to {opacity:0;}
	.confirm-enter-to,
	.confirm-leave {opacity:1;}

	/* Anim window */
	.confirm-enter-active .confirm__win {transition:transform .2s .2s, opacity .2s .2s;}
	.confirm-leave-active .confirm__win {transition:transform .2s, opacity .2s;}
	.confirm-enter .confirm__win,
	.confirm-leave-to .confirm__win {opacity:0;transform:scale(.85);}
	.confirm-enter-to .confirm__win,
	.confirm-leave .confirm__win {opacity:1;transform:scale(1);}

	/* General */
	.confirm {display:flex;align-items:center;justify-content:center;position:fixed;z-index:99;top:0;right:0;bottom:0;left:0;overflow:auto;padding:10px;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);-webkit-overflow-scrolling:touch;}
	.confirm__win {position:relative;margin:auto;padding:30px;width:340px;background:#fff;border-radius:6px;}
	.confirm__close {position:absolute;z-index:2;top:12px;right:12px;}
	.confirm__close svg {width:16px;height:16px;transition:fill .2s;fill:#ababbd;}
	.confirm__close:hover svg {fill:#7f7f98;}

	/* Content */
	.confirm__ico {display:flex;align-items:center;justify-content:center;margin:0 auto 15px;width:64px;height:64px;color:#fff;font-size:2.7rem;background:#d6d6e3;border-radius:50%;}
	.confirm__title {margin-bottom:20px;font-size:1.2rem;font-weight:500;text-align:center;}
	.confirm__title span {color:#7f7f98;}
	.confirm__btns {display:flex;justify-content:space-between;}
	.confirm__btns button {flex:1 1 45%;}
	.confirm__btns button + button {margin-left:10px;}

	/* Media queries */
	@media (max-width:450px) {
		.confirm__win {padding:18px;width:100%;}
		.confirm__title {margin-bottom:15px;font-size:1.12rem;}
		.confirm__btns {flex-wrap:wrap;}
		.confirm__btns button {flex:1 1 100%;}
		.confirm__btns button + button {margin:8px 0 0;}
	}
</style>
