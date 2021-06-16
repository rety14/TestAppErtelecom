import Vue from 'vue'
import Vuex from 'vuex'
import DemoDate from '@/demo-data.js'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,
	state: {
		noteList: []
	},

	mutations: {
		updateNoteList(state, data) {
			if (Array.isArray(data)) {
				state.noteList = data
			} else {
				state.noteList.unshift(data)
			}
		},

		removeNote(state, noteInd) {
			state.noteList.splice(noteInd, 1)
		},

		updateTodo(state, data) {
			state.noteList.find(note => note.id === data.noteId).todoList.find(todo => todo.id === data.todoId)[data.prop] = data.val
		},

		addTodo(state, data) {
			const newTodo = {
				id: data.id,
				title: data.title,
				done: false
			}
			state.noteList.find(note => note.id === data.noteId).todoList.unshift(newTodo)
		},

		removeTodo(state, data) {
			const note = state.noteList.find(note => note.id === data.noteId)
			const todoInd = note.todoList.findIndex(todo => todo.id === data.todoId)
			note.todoList.splice(todoInd, 1)
		}
	},

	actions: {
		getNotes({ commit }) {
			const noteStorage = localStorage.getItem('note')
			const data = noteStorage ? JSON.parse(noteStorage) : DemoDate
			commit('updateNoteList', data)
		},

		createNote({ commit, state, dispatch }, newNote) {
			return new Promise(resolve => {
				let maxId = 0
				state.noteList.forEach(item => {
					if (item.id > maxId) {
						maxId = item.id
					}
				})
				commit('updateNoteList', {
					id: maxId += 1,
					title: newNote,
					todoList: []
				})
				dispatch('save')
				resolve(maxId)
			})
		},

		removeNote({ commit, state, dispatch }, noteId) {
			const noteInd = state.noteList.findIndex(item => item.id === noteId)
			if (noteInd >= 0) {
				commit('removeNote', noteInd)
				dispatch('save')
			}
		},

		addTodo({ commit, state }, data) {
			let maxId = 0
			const note = state.noteList.find(note => note.id === data.noteId)

			if (note) {
				state.noteList.find(note => note.id === data.noteId).todoList.forEach(item => {
					if (item.id > maxId) {
						maxId = item.id
					}
				})
				commit('addTodo', {
					noteId: data.noteId,
					id: maxId + 1,
					title: data.title
				})
			}
		},

		save({ state }) {
			localStorage.setItem('note', JSON.stringify(state.noteList))
		}
	}
})
