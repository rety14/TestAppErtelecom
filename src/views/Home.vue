<template>
	<div>
		<!-- Creat note -->
		<TopBlock>
			<Create placeholder="Новая заметка" @action="create" :maxlength="70"/>
		</TopBlock>
		<!-- End Creat note -->

		<!-- Todo list -->
		<div class="wrap">
			<template v-if="noteList.length">
				<Note v-for="(item, key) in noteList" :key="key" :note="item" disabled/>
			</template>
			<div class="empty-info" v-else>Здесь будут ваши заметки, но пока тут пусто</div>
		</div>
		<!-- End Todo list -->
	</div>
</template>

<script>
import TopBlock from '@/components/layout/TopBlock'
import Create from '@/components/todo/Create'
import Note from '@/components/todo/Note'

export default {
	name: 'Home',
	components: {
		TopBlock,
		Create,
		Note
	},

	computed: {
		noteList() {
			return this.$store.state.noteList
		}
	},

	methods: {
		create(newNote) {
			this.$store.dispatch('createNote', newNote).then(noteId => {
				this.$router.push({name: 'Note', params: {id: noteId}})
			})
		}
	}
}
</script>
