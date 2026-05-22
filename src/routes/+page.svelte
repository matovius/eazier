<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import BezierGraph from '$components/Graph/BezierGraph.svelte';
	import Modal from '$components/overlays/Modal.svelte';
	// import GraphInput from '$components/Graph/GraphInput.svelte';
	import ogImage from '$lib/assets/images/og-image.png';
	import graphScreenie from '$lib/assets/images/graph-screenie.jpg';
	import codeOutputScreenie from '$lib/assets/images/code-output-screenie.jpg';
	import animationPreviewScreenie from '$lib/assets/images/animation-preview-screenie.jpg';
	// Ratchet audio samples
	import ratchetOne from '$lib/assets/audio/ratchet/sample-1.ogg';
	import ratchetTwo from '$lib/assets/audio/ratchet/sample-2.ogg';
	import ratchetThree from '$lib/assets/audio/ratchet/sample-3.ogg';
	import ratchetFour from '$lib/assets/audio/ratchet/sample-4.ogg';
	import ratchetFive from '$lib/assets/audio/ratchet/sample-5.ogg';
	import btnClickFx from '$lib/assets/audio/other/btn-click.ogg';
	import Logo from '$components/icons/Logo.svelte';

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

	function playRatchet() {
		const random = Math.floor(Math.random() * 5);
		// console.log(random);
		/** @type { HTMLAudioElement | null } */
		const ratchetSample = document.querySelector(`audio.ratchet-${random}`);
		// console.log(ratchetSample);

		if (ratchetSample) {
			ratchetSample.volume = 0.4;
			ratchetSample.play();
		}
	}

	function playBtnClick() {
		/** @type { HTMLAudioElement | null } */
		const btnClick = document.querySelector(`audio.btn-click`);
		// console.log(btnClick);

		if (btnClick) {
			// btnClick.volume = 0.2;
			btnClick.play();
		}
	}

	function copyCode() {
		if (browser) {
			if (isCodeCopied) {
				return;
			}
			navigator.clipboard.writeText(
				`cubic-bezier(${bezierCoords.p1.x}, ${bezierCoords.p1.y}, ${bezierCoords.p2.x}, ${bezierCoords.p2.y})`
			);
			isCodeCopied = true;
			playBtnClick();
			setTimeout(() => {
				isCodeCopied = false;
			}, 2000);
		}
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
				isGuideOpen = !isGuideOpen;
				break;
			case 'a':
				ev.preventDefault();
				if (isGuideOpen) {
					isGuideOpen = false;
				}
				isAboutOpen = !isAboutOpen;
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

	function updateCoords() {
		inputCoords = bezierCoords;
		playRatchet();
	}

	onMount(() => {
		inputCoords = bezierCoords;
	});
</script>

<svelte:head>
	<title>Eazier - CSS Cubic Bezier Generator</title>
	<meta
		name="description"
		content="The minimal app for creating custom cubic-bezier easing curves"
	/>
	<!-- Opengraph -->
	<meta property="og:title" content="Eazier" />
	<meta
		property="og:description"
		content="The minimal app for creating custom cubic-bezier easing curves"
	/>
	<meta property="og:image" content={ogImage} />
	<!-- Twitter -->
	<meta property="twitter:title" content="Eazier" />
	<meta
		property="twitter:description"
		content="The minimal app for creating custom cubic-bezier easing curves"
	/>
	<meta property="twitter:image" content={ogImage} />
	<meta property="twitter:card" content="summary_large_image" />
</svelte:head>

<svelte:window onkeydown={handleKeyboardShortcuts} />

<header>
	<div class="side start">
		<div class="logo-container">
			<Logo size="var(--text-lg)" />
			<span class="h6">Eazier</span>
		</div>
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
		<p>
			This app has a minimal interface for constructing custom CSS cubic-beziers. Let's run through
			some parts of it.
		</p>
		{@render InterfaceWalkthrough()}
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
	<audio src={btnClickFx} class="btn-click"></audio>
</main>

<div class="non-desktop-overlay">
	<h2 class="h1 heading">Apologies!</h2>
	<p>This app is currently unavailable on devices with a screen width less than 1034px.</p>
</div>

{#snippet Graph()}
	<section id="graph" class="graph">
		<div class="header">
			<h2 class="heading h5">Graph</h2>
		</div>
		<!-- BEZIER GRAPH -->
		<BezierGraph bind:coords={graphCoords} update={updateCoords} />
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
		<audio src={ratchetOne} class="ratchet-1"></audio>
		<audio src={ratchetTwo} class="ratchet-2"></audio>
		<audio src={ratchetThree} class="ratchet-3"></audio>
		<audio src={ratchetFour} class="ratchet-4"></audio>
		<audio src={ratchetFive} class="ratchet-5"></audio>
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
					playBtnClick();
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

{#snippet InterfaceWalkthrough()}
	<div class="interface-walkthrough">
		<!-- The Graph -->
		<details class="the-graph" open>
			<summary>The graph</summary>
			<div class="screenie">
				<img src={graphScreenie} alt="Screenshot of the graph interface" />
			</div>
			<div class="contents">
				<p>
					On the left side is the graph, a cartesian system with handles that you can move around
					with your pointing device to manipulate the shape of the curve. Underneath that is a group
					of number inputs that can also be used to do more precise geometry.
				</p>
			</div>
		</details>
		<!-- The Code Output -->
		<details class="the-code-output">
			<summary>The code output</summary>
			<div class="screenie">
				<img src={codeOutputScreenie} alt="Screenshot of the code output interface" />
			</div>
			<div class="contents">
				<p>
					On the right is a code output that displays what your easing curve will look like, and a
					copy button to easily take it and add it to your code.
				</p>
			</div>
		</details>
		<!-- The Animation Preview -->
		<details class="the-preview">
			<summary>The preview</summary>
			<div class="screenie">
				<img src={animationPreviewScreenie} alt="Screenshot of the preview interface" />
			</div>
			<div class="contents">
				<p>
					Underneath the code output is the preview section, where you can preview a sample
					animation that uses the values of your constructed curve to show how it would look like in
					select modes and running at certain durations.
				</p>
			</div>
		</details>
	</div>
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

		.side {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 0.75rem;
		}

		.logo-container {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			gap: 8px;

			> span {
				font-weight: 800;
				text-transform: uppercase;
			}
		}
	}

	.interface-walkthrough {
		display: grid;
		border: 1px solid var(--color-neutral-100);
		margin-block: 1em;

		> details {
			background-color: var(--color-white);
			isolation: isolate;

			> summary {
				list-style: none;
				text-transform: uppercase;
				padding: 12px;
				position: relative;
				cursor: pointer;
				outline: 2px solid transparent;

				&:focus-visible {
					outline-color: var(--color-neutral-800);
				}

				&::after {
					content: '+';
					font-size: var(--text-md);
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					inset-block: 0;
					inset-inline-end: 12px;
					margin-block: auto;
				}
			}
			> .screenie {
				border-block: 1px solid var(--color-neutral-100);
			}
			> .contents {
				padding: 12px;
			}

			&:not(:nth-child(1)) {
				border-block-start: 1px solid var(--color-neutral-100);
			}
			&[open] {
				> summary {
					background-color: var(--color-neutral-50);

					&::after {
						content: '-';
					}
				}
			}
		}
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
