<script>
	import { browser } from '$app/environment';
	import BezierGraph from '$components/Graph/BezierGraph.svelte';
	import Modal from '$components/overlays/Modal.svelte';
	// import GraphInput from '$components/Graph/GraphInput.svelte';
	import { onMount } from 'svelte';

	/** @type { GraphCoords } */
	let graphCoords = $state({
		p1: { x: 0, y: 0 },
		p2: { x: 0, y: 0 }
	});
	// $inspect(graphCoords.p1, graphCoords.p2);
	/** @type { GraphCoords } */
	let bezierCoords = $derived({
		p1: {
			x: Number((graphCoords.p1.x / 400).toPrecision(2)),
			y: Number(((400 - graphCoords.p1.y) / 400).toPrecision(2))
		},
		p2: {
			x: Number((graphCoords.p2.x / 400).toPrecision(2)),
			y: Number(((400 - graphCoords.p2.y) / 400).toPrecision(2))
		}
	});
	/** @type { GraphCoords } */
	let inputCoords = $state({
		p1: {
			x: 0,
			y: 0
		},
		p2: {
			x: 0,
			y: 0
		}
	});
	/** @type { boolean } */
	let isCodeCopied = $state(false);
	/** @type { PreviewMode } */
	let previewMode = $state('position');
	/** @type { number } */
	let animationDuration = $state(1000);
	/** @type { boolean } */
	let isAnimationPlaying = $state(false);
	/** @type { boolean } */
	let isGuideOpen = $state(false);
	/** @type { boolean } */
	let isAboutOpen = $state(false);

	function copyCode() {
		if (browser) {
			if (isCodeCopied) {
				return;
			}
			navigator.clipboard.writeText(
				`cubic-bezier(${bezierCoords.p1.x}, ${bezierCoords.p1.y}, ${bezierCoords.p2.x}, ${bezierCoords.p2.y})`
			);
			isCodeCopied = true;
			setTimeout(() => {
				isCodeCopied = false;
			}, 2000);
		}
	}

	function updateCoords() {
		inputCoords = bezierCoords;
	}

	/** @type { () => void } */
	function handleInput() {
		graphCoords = {
			p1: {
				x: inputCoords.p1.x * 400,
				y: (inputCoords.p1.y * 400 - 400) * -1
			},
			p2: {
				x: inputCoords.p2.x * 400,
				y: (inputCoords.p2.y * 400 - 400) * -1
			}
		};
	}

	/** @type { (ev: KeyboardEvent) => void } */
	function handleKeyboardShortcuts(ev) {
		switch (ev.key) {
			case 'g':
				ev.preventDefault();
				if (isAboutOpen) {
					isAboutOpen = false;
				}
				isGuideOpen = true;
				break;
			case 'a':
				ev.preventDefault();
				if (isGuideOpen) {
					isGuideOpen = false;
				}
				isAboutOpen = true;
				break;
			case 'c':
				ev.preventDefault();
				copyCode();
				break;
			case 'p':
				ev.preventDefault();
				isAnimationPlaying = !isAnimationPlaying;
				break;
			default:
				return;
		}
	}

	onMount(() => {
		inputCoords = bezierCoords;
	});
</script>

<svelte:head>
	<title>Eazier - CSS Cubic Bezier Generator</title>
</svelte:head>

<svelte:window onkeydown={handleKeyboardShortcuts} />

<header>
	<div class="side start">
		<h1 class="h5">Eazier</h1>
	</div>
	<div class="side end">
		<button
			class="btn"
			onclick={() => {
				isGuideOpen = true;
			}}>Guide <kbd>G</kbd></button
		>
		<button
			class="btn"
			onclick={() => {
				isAboutOpen = true;
			}}>About <kbd>A</kbd></button
		>
	</div>
	<Modal bind:open={isGuideOpen} heading="Guide">
		<p>This app is a minimal interface for constructing custom CSS cubic-beziers.</p>
		<br />
		<p>
			On the left side is the graph, a cartesian system with hooks that you can move around with
			your pointing device to manipulate the shape of the curve. Underneath that is a group of
			number inputs that can also be used to do more precise geometry.
		</p>
		<br />
		<p>
			On the right is a code output that displays what your easing curve will look like, and a copy
			button to easily take it and add it to your code.
		</p>
		<br />
		<p>
			Underneath the code output is the preview section, where you can preview a sample animation
			that uses the values of your constructed curve to show how it would look like in select modes
			and running at certain durations.
		</p>
		<br />
		<p>
			I'm working to create a library of easings, with a great set of defaults. You will also be
			able to add your own custom-made easings. All saved locally in your browser.
		</p>
		<br />
		<p>
			Everything is hopefully clearly marked, and if you find a problem, you may create an issue on
			<a
				href="https://github.com/matovius/eazier"
				target="_blank"
				rel="noopener noreferrer"
				class="link">GitHub</a
			>.
		</p>
	</Modal>
	<Modal bind:open={isAboutOpen} heading="About">
		<p>
			Eazier (read <em>easy-yay</em>, a combination of <strong>easing</strong> and
			<strong>bezier</strong>, or you can just call it "easier", you do you) is an app for creating
			custom cubic-bezier easing curves.
		</p>
		<br />
		<p>
			It is a project by <a
				href="https://matovius.dev"
				target="_blank"
				rel="noopener noreferrer"
				class="link">@matovius</a
			>
			since the year 2026. Check out the repo on
			<a
				href="https://github.com/matovius/eazier"
				target="_blank"
				rel="noopener noreferrer"
				class="link">GitHub</a
			>.
		</p>
	</Modal>
</header>

<main>
	<div class="container">
		<div class="pane one">
			{@render Graph()}
		</div>
		<div class="pane two">
			{@render Code()}
			{@render Preview()}
			<!-- {@render Library()} -->
		</div>
	</div>
</main>

<div class="non-desktop-overlay">
	<h2 class="h1 heading">Apologies!</h2>
	<p>
		This app is currently unable to be used on non-desktop devices
		<!-- with a screen less than 1034px
		wide. -->
	</p>
</div>

{#snippet Graph()}
	<section id="graph" class="graph">
		<div class="header">
			<h2 class="heading h5">Graph</h2>
		</div>
		<!-- BEZIER GRAPH -->
		<BezierGraph bind:coords={graphCoords} update={updateCoords} />
		<!-- <div class="positions">
					<p>
						Graph coords: x1 {bezierCoords.p1.x}, y1 {bezierCoords.p1.y}, x2 {bezierCoords.p2.x}, y2 {bezierCoords
							.p2.y}
					</p>
				</div> -->
		<div class="input-controls">
			<div class="labels">
				<label for="x1">x1</label>
				<label for="y1">y1</label>
				<label for="x2">x2</label>
				<label for="y2">y2</label>
			</div>
			<div class="inputs">
				<input
					type="number"
					id="x1"
					class="graph-input"
					min="0"
					max="1"
					step="0.01"
					oninput={handleInput}
					bind:value={inputCoords.p1.x}
				/>
				<input
					type="number"
					id="y1"
					class="graph-input"
					min="0"
					max="1"
					step="0.01"
					oninput={handleInput}
					bind:value={inputCoords.p1.y}
				/>
				<input
					type="number"
					id="x2"
					class="graph-input"
					min="0"
					max="1"
					step="0.01"
					oninput={handleInput}
					bind:value={inputCoords.p2.x}
				/>
				<input
					type="number"
					id="y2"
					class="graph-input"
					min="0"
					max="1"
					step="0.01"
					oninput={handleInput}
					bind:value={inputCoords.p2.y}
				/>
			</div>
		</div>
	</section>
{/snippet}

{#snippet Code()}
	<section id="code" class="code">
		<div class="header">
			<h2 class="heading h5">Code</h2>
			<!-- <button class="btn">Info</button> -->
		</div>
		<output class="code-output">
			<span class="start">cubic-bezier(</span>
			<span class="x1">{bezierCoords.p1.x},</span>
			<span class="y1"> {bezierCoords.p1.y},</span>
			<span class="x2"> {bezierCoords.p2.x},</span>
			<span class="y2"> {bezierCoords.p2.y}</span>
			<span class="end">)</span>
		</output>
		<div class="ctas">
			<button class="btn" class:swap={isCodeCopied} onclick={copyCode}>
				<div class="swappable">
					<span class="first">Copy</span>
					<span class="second">Copied</span>
				</div>
				<kbd>C</kbd>
			</button>
			<!-- <button class="btn">Save</button> -->
		</div>
	</section>
{/snippet}

{#snippet Preview()}
	<section id="preview" class="preview">
		<div class="header">
			<h2 class="heading h5">Preview</h2>
			<label for="mode" class="mode-switcher">
				<small>Mode</small>
				<select name="mode" id="mode" bind:value={previewMode}>
					<option value="position">Position</option>
					<option value="rotation">Rotation</option>
					<option value="size">Size</option>
					<option value="opacity">Opacity</option>
				</select>
			</label>
		</div>
		<div class="animation-area">
			<div
				class="animatable-object {previewMode}"
				style="
				--_state: {isAnimationPlaying ? 'running' : 'paused'};
				--_mode: {previewMode};
				--_duration: {animationDuration}ms;
				--_curve: cubic-bezier({bezierCoords.p1.x}, {bezierCoords.p1.y}, {bezierCoords.p2.x}, {bezierCoords
					.p2.y});
				"
			></div>
		</div>
		<div class="footer">
			<button
				class="btn"
				class:swap={isAnimationPlaying}
				onclick={() => {
					isAnimationPlaying = !isAnimationPlaying;
				}}
			>
				<div class="swappable">
					<span class="first">Play</span>
					<span class="second">Pause</span>
				</div>
				<kbd>P</kbd>
			</button>
			<label for="duration">
				<small>Duration (ms)</small>
				<input
					type="number"
					class="duration-input"
					name="duration"
					id="duration"
					min="100"
					max="5000"
					step="50"
					bind:value={animationDuration}
				/>
			</label>
		</div>
	</section>
{/snippet}

{#snippet Library()}
	<section id="library" class="library">
		<div class="header">
			<h2 class="heading h5">Library</h2>
			<div class="library-search">
				<button class="btn">Search</button>
			</div>
		</div>
		<div class="library-container"></div>
	</section>
{/snippet}

<style>
	.non-desktop-overlay {
		display: none;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background-color: var(--color-white);
		position: sticky;
		top: 0;
	}

	main {
		padding: 1.5rem;

		> .container {
			max-width: 1000px;
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 48px;
			margin-inline: auto;
		}
	}

	.pane.two {
		display: flex;
		flex-direction: column;
		gap: 48px;
		/*height: 300vh;*/
	}

	section {
		display: grid;
		gap: 24px;

		> .header {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			> .heading {
				text-transform: uppercase;
			}
		}

		> .footer {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	section.graph {
		max-width: 400px;
		position: sticky;
		top: 80px;
	}

	.input-controls {
		display: grid;
		gap: 4px;
		padding-block-start: 24px;

		> .labels,
		> .inputs {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
		}

		> .labels {
			font-size: var(--text-sm);
			color: var(--color-neutral-500);

			> label {
				padding-inline-start: 12px;
			}
		}

		> .inputs {
			border: 1px solid var(--color-neutral-100);
			isolation: isolate;

			> input {
				padding-block: 4px;
				padding-inline: 12px;
				border: none;
				border-radius: 0;
				outline: 2px solid transparent;

				&:not(:nth-child(1)) {
					border-inline-start: 1px solid var(--color-neutral-100);
				}

				&:focus {
					outline-color: var(--color-neutral-800);
					z-index: 1;
				}
			}
		}
	}

	section.code {
		> .code-output {
			display: inline-flex;
			padding-block: 8px;
			padding-inline: 12px;
			border: 1px solid var(--color-neutral-100);
		}
	}

	section.preview {
		label > small {
			color: var(--color-neutral-500);
		}
		> .animation-area {
			padding: 24px;
			border: 1px solid var(--color-neutral-100);

			> .animatable-object {
				width: 50px;
				height: 50px;
				background-color: var(--color-neutral-800);
				animation-name: var(--_mode);
				animation-duration: var(--_duration);
				animation-timing-function: var(--_curve);
				animation-play-state: var(--_state);
				animation-iteration-count: infinite;
				animation-direction: alternate;

				&.position {
					animation-name: position;
				}
				&.rotation {
					animation-name: rotation;
				}
				&.size {
					animation-name: size;
				}
				&.opacity {
					animation-name: opacity;
				}
			}

			&:has(.opacity, .rotation, .size) {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		input.duration-input {
			width: 6em;
			padding-block: 4px;
			padding-inline: 12px;
			border-radius: 0;
			border: 1px solid var(--color-neutral-100);
			outline: 2px solid transparent;

			&:focus {
				outline-color: var(--color-neutral-800);
			}
		}
	}

	button.btn {
		&:has(.swappable) {
			overflow: clip;
		}
		> .swappable {
			display: inline-grid;

			> span {
				grid-area: 1 / 1 / 2 / 2;

				&.first {
					transform: translateY(0);
					opacity: 1;
				}
				&.second {
					transform: translateY(50%);
					opacity: 0;
				}
			}
		}
		&.swap {
			> .swappable > span {
				transition-timing-function: cubic-bezier(0.12, 0.51, 0.46, 1.1);

				&.first {
					transform: translateY(-50%);
					opacity: 0;
				}
				&.second {
					transform: translateY(0);
					opacity: 1;
				}
			}
		}
	}

	.mode-switcher {
		> select {
			padding-block: 4px;
			padding-inline: 12px;
			border: 1px solid var(--color-neutral-100);
			background-color: transparent;
			cursor: pointer;
			outline: 2px solid transparent;

			&:hover {
				border-color: var(--color-neutral-500);
			}
			&:focus-visible {
				outline-color: var(--color-neutral-800);
			}
		}
	}

	@media screen and (width < 1034px) {
		header {
			display: none;
		}
		main {
			display: none;
		}
		.non-desktop-overlay {
			width: 100vw;
			height: 100dvh;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 24px;
			padding: 24px;

			> .heading {
				color: var(--color-neutral-500);
			}

			> p {
				text-align: center;
				max-width: 600px;
			}
		}
	}

	@keyframes position {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(900%);
		}
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes size {
		0% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(0.5);
		}
	}

	@keyframes opacity {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
