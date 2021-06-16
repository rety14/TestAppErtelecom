<template>
	<svg>
		<use :xlink:href="path"/>
	</svg>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true
		}
	},

	computed: {
		path() {
			let icon = require(`@/assets/svg/${this.name}.svg`).default
			if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
				icon = icon.default
			}
			return icon.url
		}
	}
}
</script>
