<script>
	import { quadOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';

	/**
	 * @typedef Props
	 * @prop { boolean } open
	 * @prop { import('svelte').Snippet } children
	 * @prop { string } [heading]
	 */

	/** @type { Props } */
	let { open = $bindable(false), children, heading = 'Hello world' } = $props();

	/** @type { HTMLDialogElement | undefined} */
	let Modal = $state(undefined);

	$effect(() => {
		if (Modal) {
			if (open) {
				Modal.showModal();
			} else {
				setTimeout(() => {
					Modal.close();
				}, 200);
			}
		}
	});

	/** @type { (ev: KeyboardEvent) => void } */
	function handleKeydown(ev) {
		if (ev.key === 'Escape') {
			ev.preventDefault();
			open = false;
		}
	}
</script>

<dialog bind:this={Modal} onkeydown={handleKeydown}>
	{#if open}
		<div class="container" transition:fade={{ duration: 200, easing: quadOut }}>
			<article
				class="card"
				in:fly={{ duration: 500, easing: quadOut, y: '24px' }}
				out:scale={{ duration: 200, easing: quadOut, start: 0.95 }}
			>
				<div class="header">
					<h3 class="h5 heading">{heading}</h3>
					<button
						class="btn"
						onclick={() => {
							open = false;
						}}>Close <kbd>Esc</kbd></button
					>
				</div>
				<div class="body">
					{@render children()}
				</div>
			</article>
		</div>
	{/if}
</dialog>

<style>
	dialog {
		background-color: transparent;
		border: none;
		overflow: visible;
		isolation: isolate;
		&::backdrop {
			color: transparent;
			background-color: transparent;
		}
	}
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 24px;
		background-color: color-mix(in oklab, var(--color-black), transparent 50%);
		position: fixed;
		inset: 0;
		pointer-events: none;
	}

	article.card {
		width: 100%;
		max-width: 400px;
		max-height: 100%;
		border: 1px solid var(--color-neutral-100);
		background-color: var(--color-white);
		isolation: isolate;
		overflow-y: auto;
		pointer-events: all;

		> .header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 24px;
			padding: 12px;
			border-block-end: 1px solid var(--color-neutral-100);
			background-color: var(--color-white);
			position: sticky;
			top: 0;

			> .heading {
				text-transform: uppercase;
			}
		}
		> .body {
			/*height: 200vh;*/
			padding: 12px;
		}
	}
</style>
