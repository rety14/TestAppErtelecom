<template>
	<div class="note" :class="{note_fog: filteredTodos.length > 4}">
		<!-- Note body -->
		<router-link class="note__link" :to="{name: 'Note', params: {id: note.id}}"></router-link>
		<div class="note__head">
			<div class="note__title">{{ note.title }}</div>
			<button class="note__remove btn_ico btn_remove" @click="visibleConfirm = true">
				<SvgIco name="remove"/>
			</button>
		</div>
		<TodoItems :list="filteredTodos" :disabled="disabled"/>
		<!-- End Note body -->

		<!-- Confirm -->
		<ConfirmModal v-model="visibleConfirm">
			<template #title>
				Вы уверены, что хотите удалить заметку: <span>{{ note.title }}</span>?
			</template>
			<template #button>
				<button class="btn btn_color_violet" @click="remove()">Да</button>
			</template>
		</ConfirmModal>
		<!-- End Confirm -->
	</div>
</template>

<script>
import TodoItems from '@/components/todo/TodoItems'
import SvgIco from '@/components/base/SvgIco'
import ConfirmModal from '@/components/base/ConfirmModal'

export default {
	name: 'Note',
	props: {
		note: {
			type: Object,
			required: true
		},
		disabled: Boolean
	},

	data: () => ({
		visibleConfirm: false
	}),

	components: {
		TodoItems,
		SvgIco,
		ConfirmModal
	},

	computed: {
		filteredTodos() {
			return this.note.todoList.slice(0, 5)
		}
	},

	methods: {
		remove() {
			this.$store.dispatch('removeNote', this.note.id)
			this.visibleConfirm = false
		}
	}
}
</script>

<style>
	.note {position:relative;margin-bottom:30px;padding:20px 20px 10px;}
	.note::before {content:'';position:absolute;z-index:-1;top:0;right:0;bottom:0;left:0;transition:transform .3s;background:#fff;border-radius:6px;box-shadow:0 8px 15px rgba(0,0,0,.08);}
	.note:hover::before {transform:scale(1.02, 1.05);}
	.note:hover .note__title {color:#5b33e6;}
	.note_fog::after {content:'';position:absolute;z-index:1;right:0;bottom:0;left:0;height:110px;border-radius:0 0 6px 6px;background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 90%);}
	.note__link {position:absolute;z-index:2;top:0;right:0;bottom:0;left:0;border-radius:6px;}
	.note__head {display:flex;align-items:flex-start;padding-bottom:10px;border-bottom:2px solid #e0e0eb;}
	.note__title {flex:1 1 100%;margin-right:15px;transition:color .2s;font-size:1.6rem;font-weight:500;}
	.note__remove {position:relative;z-index:3;margin:-6px -8px 0 auto;padding:8px 8px 0;}

	@media (max-width:650px) {
		.note {margin-bottom:15px;padding:10px 10px 10px;}
		.note__head {padding-bottom:8px;}
		.note__title {margin-top:1px;line-height:1.2;font-size:1.32rem;}
		.note:hover::before {transform:scale(1.02, 1.02);}
	}
</style>
