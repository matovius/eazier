<script>
	import '@fontsource/dm-mono/400';
	import '@fontsource/dm-mono/500';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	/**
	 * @typedef Props
	 * @prop { import('svelte').Snippet } children
	 */

	/** @type { Props } */
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
