<template>
	<form class="create" @submit.prevent="create()">
		<input
			type="text"
			v-model="value"
			:class="{err: error}"
			@input="error = false"
			class="create__field field"
			:placeholder="placeholder"
			:maxlength="maxlength"
		>
		<button class="create__btn btn btn_color_violet">
			<SvgIco name="plus"/>Добавить
		</button>
	</form>
</template>

<script>
import SvgIco from '@/components/base/SvgIco'

export default {
	name: 'Create',
	components: {
		SvgIco
	},
	props: {
		placeholder: {
			type: String,
			required: true
		},
		maxlength: {
			type: Number,
			default: null
		}
	},

	data: () => ({
		value: '',
		error: false
	}),

	methods: {
		create() {
			if (!this.value.trim()) {
				this.error = true
			} else {
				this.$emit('action', this.value)
				this.value = ''
			}
		}
	}
}
</script>

<style>
	.create {position:relative;width:100%;}
	.create__field {padding-right:130px;}
	.create__btn {position:absolute;top:4px;right:4px;}
	.create__btn svg {width:16px;height:16px;}

	@media (max-width:650px) {
		.create__field {padding-right:52px;font-size:1.1rem;}
		.create__btn {height:40px;font-size:0;}
		.create__btn svg {margin:0 2px;}
	}
</style>
