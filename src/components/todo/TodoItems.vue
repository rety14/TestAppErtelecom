<template>
	<div class="todo">
		<transition-group name="fade" tag="div" v-if="list.length">
			<form class="todo__item" v-for="(item, key) in list" :key="item.id" @submit.prevent="editOff()">
				<label class="todo__label" :class="{disabled: disabled}">
					<input
						type="checkbox"
						class="todo__check"
						:checked="item.done"
						@change="change(item, 'done', !item.done)"
						:disabled="disabled"
					>
					<div class="todo__title" :class="{title_hide: key === edited}">{{ item.title }}</div>
					<input
						class="todo__field field"
						type="text"
						:value="item.title"
						@change="change(item, 'title', $event.target.value)"
						v-if="key === edited"
						:ref="'field' + item.id"
					>
				</label>
				<button type="button" class="todo__edit btn_edit btn_ico" v-if="!disabled" @click="edit(item, key)">
					<SvgIco name="edit"/>
				</button>
				<button type="button" class="btn_remove btn_ico" v-if="!disabled" @click="$emit('remove', item.id)">
					<SvgIco name="remove"/>
				</button>
			</form>
		</transition-group>

		<div class="empty-info" v-else>
			Пока не добавлено ни одной задачи
		</div>
	</div>
</template>

<script>
import SvgIco from '@/components/base/SvgIco'

export default {
	name: 'TodoItems',
	components: {
		SvgIco
	},

	props: {
		list: {
			type: Array,
			required: true
		},
		disabled: Boolean
	},

	data: () => ({
		edited: -1
	}),

	mounted() {
		document.addEventListener('editOff', this.editOff)
	},

	destroyed() {
		document.removeEventListener('editOff', this.editOff)
	},

	methods: {
		change(item, prop, val) {
			this.$emit('change', {
				id: item.id,
				prop: prop,
				val: val
			})
		},

		edit(todo, key) {
			if (this.edited !== key) {
				this.edited = key
				setTimeout(() => this.$refs['field' + todo.id][0].focus())
			} else {
				this.editOff()
			}
		},

		editOff() {
			this.edited = -1
		}
	}
}
</script>

<style>
	.todo__item {display:flex;padding-right:10px;transition:background .2s;border-bottom:2px solid #f2f2f7;}
	.todo__item:hover:not(.disabled) {background:#f8f8fa;}
	.todo__item:first-child {border-radius:6px 6px 0 0;}
	.todo__item:last-child {margin:0;border:none;border-radius:0 0 6px 6px;}

	.todo__label {position:relative;flex:1 1 auto;margin-right:15px;padding:12px 0 12px 10px;min-height:22px;cursor:pointer;}
	.todo__check {display:none;}
	.todo__title {position:relative;padding-left:32px;line-height:1.35;font-size:1.12rem;word-break:break-word;}
	.todo__title.title_hide {opacity:0;}
	.todo__title::before {content:'';position:absolute;top:0;left:0;width:20px;height:20px;transition:background .2s;background:#e2e2e7;border-radius:4px;}
	.todo__title::after {content:'';position:absolute;top:5px;left:4px;width:12px;height:9px;opacity:0;transform:scale(1.5);transition:opacity .2s, transform .2s;background:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 9'%3e%3cpath fill='%23fff' d='M11.7,1.8c0,0-9.6,9.9-6.6,6.8C4.7,9.1,4,9.1,3.5,8.6L0.3,5.3c-0.4-0.5-0.4-1.2,0-1.6c0.4-0.5,1.2-0.5,1.6,0l2.5,2.5l5.8-5.9c0.4-0.4,1.1-0.4,1.5,0C12.1,0.7,12.1,1.4,11.7,1.8z'/%3e%3c/svg%3e") no-repeat;}

	.todo__field {position:absolute;top:50%;left:4px;margin-top:-20px;padding:8px 6px;font-size:1.12rem;border-radius:4px;}
	.todo__check:checked + .todo__title {text-decoration:line-through;}
	.todo__check:checked + .todo__title::before {background:#5b33e6;}
	.todo__check:checked + .todo__title::after {opacity:1;transform:scale(1);}

	.todo__edit {margin:0 20px 0 auto;}

	@media (max-width:650px) {
		.todo__item {padding-right:8px;}
		.todo__title {line-height:1.35;font-size:1.06rem;}
		.todo__field {font-size:1.06rem;}
		.todo__label {padding:8px 0 8px 8px;}
	}
</style>
