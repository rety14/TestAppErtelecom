<template>
	<div>
		<div v-if="note">
			<!-- Note head -->
			<TopBlock class="full-note__top">
				<button class="full-note__back btn btn_color_light" title="Назад" @click="back()">
					<SvgIco name="arrow"/>
				</button>
				<div class="full-note__title" :class="{reduce_title: note.title.length > 50, hide_title: visibleAddMenu}">{{ note.title }}</div>
				<div class="full-note__actions" :class="{actions_visible: visibleAddMenu}">
					<button class="full-note__undo btn btn_color_light" title="Отменить" @click="undo()" :disabled="disabledUndo">
						<SvgIco name="arrow-undo"/>
					</button>
					<button class="full-note__redo btn btn_color_light" title="Повторить" @click="redo()" :disabled="disabledRedo">
						<SvgIco name="arrow-redo"/>
					</button>
					<button class="full-note__remove btn btn_color_red" title="Удалить" @click="removeConfirm = true">
						<SvgIco name="remove"/>
					</button>
					<button class="full-note__save btn btn_color_green" @click="save(true)" :class="{saved: saved}" :disabled="saved">
						<transition name="fade">
							<p v-if="saved">Готово</p>
						</transition>
						<span>Сохранить</span>
						<SvgIco name="save"/>
					</button>
				</div>
				<button class="full-note__more btn btn_color_light" title="Дополнительно" @click="visibleAddMenu = !visibleAddMenu">
					<SvgIco name="dots"/>
				</button>
			</TopBlock>
			<!-- End Note head -->

			<!-- Todo list -->
			<div class="wrap">
				<div class="todo-list">
					<Create class="todo__create" placeholder="Новая задача" @action="addTodo"/>
					<TodoItems :list="note.todoList" @change="changeTodo" @remove="removeTodo"/>
				</div>
			</div>
			<!-- End Todo list -->

			<!-- Save confirm -->
			<ConfirmModal v-model="saveConfirm">
				<template #title>
					Заметка была изменена, вы уверены что хотите выйти без сохранения?
				</template>
				<template #button>
					<button class="btn btn_color_violet" @click="exitWithSave()">Сохранить и выйти</button>
					<button class="btn btn_color_gray" @click="exitWithoutSave()">Выйти без сохранения</button>
				</template>
			</ConfirmModal>
			<!-- End Save confirm -->

			<!-- Remove confirm -->
			<ConfirmModal v-model="removeConfirm">
				<template #title>
					Вы уверены, что хотите удалить эту заметку?
				</template>
				<template #button>
					<button class="btn btn_color_violet" @click="remove()">Да</button>
				</template>
			</ConfirmModal>
			<!-- End Remove confirm -->
		</div>
	</div>
</template>

<script>
import TopBlock from '@/components/layout/TopBlock'
import Create from '@/components/todo/Create'
import TodoItems from '@/components/todo/TodoItems'
import SvgIco from '@/components/base/SvgIco'
import ConfirmModal from '@/components/base/ConfirmModal'

export default {
	components: {
		TopBlock,
		Create,
		TodoItems,
		SvgIco,
		ConfirmModal
	},

	data: () => ({
		history: [],
		historyStep: 0,
		savedStep: 0,
		saved: false,
		saveConfirm: false,
		removeConfirm: false,
		visibleAddMenu: false
	}),

	created() {
		if (this.$store) {
			this.history.push(JSON.stringify(this.$store.state))
			this.$store.subscribe((mutation, state) => {
				if (mutation.type !== 'removeNote') {
					this.history.splice(this.historyStep + 1)
					this.history.push(JSON.stringify(state))
					++this.historyStep
				}
			})
		}
	},

	beforeRouteLeave(to, from, next) {
		if (this.existHistory && this.savedStep !== this.historyStep) {
			this.saveConfirm = true
			next(false)
		} else {
			next()
		}
	},

	mounted() {
		if (this.$store.state.noteList.length && !this.note) this.$router.replace({name: 'Home'})
	},

	computed: {
		noteId() {
			return +this.$route.params.id
		},

		note() {
			return (Array.isArray(this.$store.state.noteList) && this.$store.state.noteList.find(item => this.noteId === item.id)) || false
		},

		existHistory() {
			return this.history.length > 1
		},

		disabledUndo() {
			return this.historyStep <= 0
		},

		disabledRedo() {
			return this.historyStep >= this.history.length - 1
		}
	},

	methods: {
		back() {
			if (this.existHistory && this.savedStep !== this.historyStep) {
				this.saveConfirm = true
			} else {
				this.goHome()
			}
		},

		remove() {
			this.removeConfirm = false
			setTimeout(() => {
				this.$store.dispatch('removeNote', this.note.id)
				this.goHome()
			}, 350)
		},

		changeTodo(todo) {
			this.$store.commit('updateTodo', {
				noteId: this.note.id,
				todoId: todo.id,
				prop: todo.prop,
				val: todo.val
			})
		},

		addTodo(newTodo) {
			this.$store.dispatch('addTodo', {
				noteId: this.note.id,
				title: newTodo
			})
		},

		undo() {
			--this.historyStep
			this.changeHistory()
		},

		redo() {
			++this.historyStep
			this.changeHistory()
		},

		changeHistory(step = this.historyStep) {
			this.$store.replaceState(JSON.parse(this.history[step]))
		},

		save(withNotification) {
			if (withNotification) {
				this.saved = true
				setTimeout(() => {
					this.saved = false
				}, 2000)
			}
			this.$store.dispatch('save')
			this.savedStep = this.historyStep
			document.dispatchEvent(new CustomEvent('editOff'))
		},

		exitWithSave() {
			this.save()
			this.history = []
			this.saveConfirm = false
			setTimeout(() => {
				this.goHome()
			}, 350)
		},

		exitWithoutSave() {
			this.changeHistory(0)
			this.history = []
			this.saveConfirm = false
			setTimeout(() => {
				this.goHome()
			}, 350)
		},

		removeTodo(todoId) {
			this.$store.commit('removeTodo', {
				noteId: this.note.id,
				todoId: todoId
			})
		},

		goHome() {
			this.$router.push({name: 'Home'})
		}
	}
}
</script>

<style>
	/* Note head */
	.full-note__back {margin-right:15px;}
	.full-note__back svg {margin:0;width:20px;height:14px;}
	.full-note__title {font-size:1.8rem;font-weight:500;transition:font-size .2s;}
	.reduce_title {font-size:1.55rem;}
	.collapse .full-note__title {font-size:1.5rem;}
	.collapse .reduce_title {font-size:1.4rem;}
	.full-note__more {display:none;margin-left:auto;}
	.full-note__more svg {margin:0 2px;width:18px;height:4px;}
	.full-note__actions {display:flex;align-items:center;margin-left:auto;}
	.full-note__actions button {margin-left:12px;}
	.full-note__undo svg,
	.full-note__redo svg {margin:0;width:24px;height:10px;}
	.full-note__remove svg {margin:0;width:20px;height:24px;}
	.full-note__save {position:relative;}
	.full-note__save svg {display:none;margin:0;width:22px;height:22px;}
	.full-note__save.saved {pointer-events:none;}
	.full-note__save.saved span {opacity:0;}
	.full-note__save p {display:flex;align-items:center;justify-content:center;position:absolute;top:0;right:0;bottom:0;left:0;}

	/* Todo list */
	.todo__create {margin-bottom:10px;}
	.todo-list {padding:15px 20px;background:#fff;border-radius:6px;box-shadow:0 8px 15px rgba(0,0,0,.08);}

	/* Animation */
	.fade-enter-active {transition:opacity .5s;}
	.fade-leave-active {transition:opacity .2s;}
	.fade-enter,
	.fade-leave-to {opacity:0;}

	@media (max-width:800px) {
		.full-note__title {font-size:1.5rem;}
		.reduce_title {font-size:1.4rem;}
		.collapse .full-note__title {font-size:1.25rem;}
		.collapse .reduce_title {font-size:1.2rem;}
	}

	@media (max-width:650px) {
		.full-note__actions {justify-content:flex-end;position:absolute;top:0;right:64px;bottom:0;left:48px;opacity:0;transition:opacity .2s;background:#fff;}
		.full-note__actions.actions_visible {opacity:1;}
		.full-note__more {display:block;}
		.full-note__top button {padding:6px;height:34px;}
		.full-note__remove svg {margin:0 2px;}
		.full-note__save {font-size:0;}
		.full-note__save svg {display:block;}
		.hide_title {opacity:0;}
		.full-note__title {line-height:1.3;font-size:1.4rem;}
		.reduce_title {font-size:1.2rem;}
		.collapse .full-note__title {line-height:1.2;font-size:1.2rem;}
		.collapse .reduce_title {font-size:1.1rem;}
		.todo-list {padding:12px 15px;}
	}

	@media (max-width:400px) {
		.full-note__title {line-height:1.2;font-size:1.15rem;}
		.reduce_title {font-size:1.1rem;}
		.collapse .full-note__title {font-size:1.1rem;}
		.collapse .reduce_title {font-size:1.0rem;}
	}
</style>
