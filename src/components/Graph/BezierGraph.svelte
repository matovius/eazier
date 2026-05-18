<script>
	import { onMount } from 'svelte';

	/**
	 * @typedef Props
	 * @prop { GraphCoords } coords
	 * @prop { () => void } update
	 */

	/** @type { Props } */
	let {
		coords = $bindable({
			p1: { x: 0, y: 0 },
			p2: { x: 0, y: 0 }
		}),
		update
	} = $props();

	/** @type { HTMLElement | undefined } */
	let container = $state();
	/** @type { Control } */
	let p1Control = $state({
		position: {
			x: 0,
			y: 400
		},
		isReadyToDrag: false
	});
	/** @type { Control } */
	let p2Control = $state({
		position: {
			x: 400,
			y: 0
		},
		isReadyToDrag: false
	});

	/**
	 * Handle the movement of P1
	 * @param { MouseEvent } ev The corresponding mouse event
	 */
	function handleP1Movement(ev) {
		if (container) {
			/** @type { Coords } */
			let p1 = { x: ev.offsetX, y: ev.offsetY };

			if (p1.x < 0) {
				p1.x = 0;
			} else if (p1.x > 400) {
				p1.x = 400;
			}

			if (p1.y < -100) {
				p1.y = -100;
			} else if (p1.y > 500) {
				p1.y = 500;
			}

			coords.p1 = p1Control.position = p1;
			update();
		}
	}

	/**
	 * Handle the movement of P2
	 * @param { MouseEvent } ev The corresponding mouse event
	 */
	function handleP2Movement(ev) {
		if (container) {
			/** @type { Coords } */
			let p2 = { x: ev.offsetX, y: ev.offsetY };

			if (p2.x < 0) {
				p2.x = 0;
			} else if (p2.x > 400) {
				p2.x = 400;
			}

			if (p2.y < -100) {
				p2.y = -100;
			} else if (p2.y > 500) {
				p2.y = 500;
			}

			coords.p2 = p2Control.position = p2;
			update();
		}
	}

	/**
	 * Handle dragging of controls
	 * @param { MouseEvent } ev The corresponding mouse event
	 */
	function handleDragMovement(ev) {
		if (p1Control.isReadyToDrag) {
			ev.stopPropagation();
			handleP1Movement(ev);
		} else if (p2Control.isReadyToDrag) {
			ev.stopPropagation();
			handleP2Movement(ev);
		} else {
			return;
		}
	}

	onMount(() => {
		if (container) {
			coords = {
				p1: p1Control.position,
				p2: p2Control.position
			};
		}
	});
</script>

<div class="graph-container" bind:this={container} onmousemove={handleDragMovement}>
	<!-- GRAPH DISPLAY -->
	<!-- <svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 1 1"
		class="graph-svg"
		stroke-linecap="round"
	>
		<g id="grid">
			<path
				class="grid-lines vertical"
				d="
				M 0,0 V 1
				M 0.25,0 V 1
				M 0.5,0 V 1
				M 0.75,0 V 1
				M 1,0 V 1"
			/>
			<path
				class="grid-lines horizontal"
				d="
				M 0,0 H 1
				M 0,0.25 H 1
				M 0,0.5 H 1
				M 0,0.75 H 1
				M 0,1 H 1"
			/>
			<line id="linear-normal" x1="0" y1="1" x2="1" y2="0" stroke-dasharray="0.05" />
		</g>
		<path
			d="M 0,1 C {coords.p1.x},{coords.p1.y} {coords.p2.x},{coords.p2.y} 1,0"
			fill="none"
			stroke="var(--color-neutral-800)"
			stroke-width="0.02"
		/>
		<g id="control-points">
			<g id="lines">
				<line
					id="p1-line"
					x1="0"
					y1="1"
					x2={coords.p1.x}
					y2={coords.p1.y}
					stroke="var(--color-neutral-800)"
					stroke-width="0.001"
				/>
				<line
					id="p2-line"
					x1="1"
					y1="0"
					x2={coords.p2.x}
					y2={coords.p2.y}
					stroke="var(--color-neutral-800)"
					stroke-width="0.001"
				/>
			</g>
			<g
				id="p1"
				onmousedown={() => {
					p1Control.isReadyToDrag = true;
				}}
				onmouseup={() => {
					p1Control.isReadyToDrag = false;
				}}
			>
				<circle cx={coords.p1.x} cy={coords.p1.y} r="0.04" fill="var(--color-neutral-800)" />
				<circle cx={coords.p1.x} cy={coords.p1.y} r="0.02" fill="var(--color-white)" />
			</g>
			<g
				id="p2"
				onmousedown={() => {
					p2Control.isReadyToDrag = true;
				}}
				onmouseup={() => {
					p2Control.isReadyToDrag = false;
				}}
			>
				<circle cx={coords.p2.x} cy={coords.p2.y} r="0.04" fill="var(--color-neutral-800)" />
				<circle cx={coords.p2.x} cy={coords.p2.y} r="0.02" fill="var(--color-white)" />
			</g>
		</g>
	</svg> -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 400 400"
		class="graph-svg"
		stroke-linecap="round"
	>
		<g id="grid">
			<path
				stroke-width="1"
				class="grid-lines vertical"
				d="
				M 0,0 V 400
				M 100,0 V 400
				M 200,0 V 400
				M 300,0 V 400
				M 400,0 V 400"
			/>
			<path
				stroke-width="1"
				class="grid-lines horizontal"
				d="
				M 0,0 H 400
				M 0,100 H 400
				M 0,200 H 400
				M 0,300 H 400
				M 0,400 H 400"
			/>
			<line
				id="linear-normal"
				x1="0"
				y1="400"
				x2="400"
				y2="0"
				stroke-width="1"
				stroke-dasharray="15"
			/>
		</g>
		<path
			d="M 0,400 C {coords.p1.x},{coords.p1.y} {coords.p2.x},{coords.p2.y} 400,0"
			fill="none"
			stroke="var(--color-neutral-800)"
			stroke-width="4"
		/>
		<g id="control-points">
			<g id="lines">
				<line
					id="p1-line"
					x1="0"
					y1="400"
					x2={coords.p1.x}
					y2={coords.p1.y}
					stroke="var(--color-neutral-800)"
					stroke-width="2"
				/>
				<line
					id="p2-line"
					x1="400"
					y1="0"
					x2={coords.p2.x}
					y2={coords.p2.y}
					stroke="var(--color-neutral-800)"
					stroke-width="2"
				/>
			</g>
			<g
				id="p1"
				onmousedown={() => {
					p1Control.isReadyToDrag = true;
				}}
				onmouseup={() => {
					p1Control.isReadyToDrag = false;
				}}
			>
				<circle cx={coords.p1.x} cy={coords.p1.y} r="20" fill="var(--color-neutral-800)" />
				<circle cx={coords.p1.x} cy={coords.p1.y} r="10" fill="var(--color-white)" />
			</g>
			<g
				id="p2"
				onmousedown={() => {
					p2Control.isReadyToDrag = true;
				}}
				onmouseup={() => {
					p2Control.isReadyToDrag = false;
				}}
			>
				<circle cx={coords.p2.x} cy={coords.p2.y} r="20" fill="var(--color-neutral-800)" />
				<circle cx={coords.p2.x} cy={coords.p2.y} r="10" fill="var(--color-white)" />
			</g>
		</g>
	</svg>
</div>

<!-- <div class="positioning">
	<p>P1: x {p1Control.position.x}, y {p1Control.position.y}</p>
	<p>P2: x {p2Control.position.x}, y {p2Control.position.y}</p>
</div> -->

<style>
	.graph-container {
		min-width: 400px;
		width: 400px;
		max-width: 400px;
		position: relative;
	}

	svg.graph-svg {
		overflow: visible;

		* {
			transition: none;
		}

		path.grid-lines {
			stroke: var(--color-neutral-100);
			/*stroke-width: 0.005;*/
		}
		line#linear-normal {
			stroke: var(--color-neutral-100);
			/*stroke-width: 0.005;*/
		}
	}
	g#control-points > g#p1,
	g#control-points > g#p2 {
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
</style>
