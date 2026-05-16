<script>
	/**
	 * @typedef Coords Cartesian co-ordinates of a point
	 * @prop { number } x The x position of a point
	 * @prop { number } y The y position of a point
	 */

	/**
	 * @typedef GraphCoords The positions of the two cubic bezier control points
	 * @prop { Coords } p1 The coordinate positions of the first point
	 * @prop { Coords } p2 The coordinate position of the second point
	 */

	/**
	 * @typedef Control A control point and it's associated data
	 * @prop { Coords } position The offset position of the button on the graph
	 * @prop { boolean } isReadyToDrag Indicates whether the button is ready to drag on the graph
	 */

	/** @type { HTMLElement | null } */
	let GraphContainer = $state(null);
	/** @type { Control } */
	let P1Control = $state({
		position: {
			x: 0,
			y: 400
		},
		isReadyToDrag: false
	});
	/** @type { Control } */
	let P2Control = $state({
		position: {
			x: 400,
			y: 0
		},
		isReadyToDrag: false
	});
	/** @type { GraphCoords } */
	let graphCoords = $derived.by(() => {
		if (GraphContainer) {
			return {
				p1: {
					x: Number((P1Control.position.x / GraphContainer.clientWidth).toPrecision(2)),
					y: Number((P1Control.position.y / GraphContainer.clientWidth).toPrecision(2))
				},
				p2: {
					x: Number((P2Control.position.x / GraphContainer.clientWidth).toPrecision(2)),
					y: Number((P2Control.position.y / GraphContainer.clientWidth).toPrecision(2))
				}
			};
		}
		return {
			p1: { x: 0, y: 0 },
			p2: { x: 0, y: 0 }
		};
	});

	/**
	 * Handle the movement of P1
	 * @param { MouseEvent } ev The corresponding mouse event
	 */
	function handleP1Movement(ev) {
		if (GraphContainer) {
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

			P1Control.position = {
				x: p1.x,
				y: p1.y
			};
		}
	}

	/**
	 * Handle the movement of P2
	 * @param { MouseEvent } ev The corresponding mouse event
	 */
	function handleP2Movement(ev) {
		if (GraphContainer) {
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

			P2Control.position = {
				x: p2.x,
				y: p2.y
			};
		}
	}

	/**
	 * Handle dragging of controls
	 * @param { MouseEvent } ev The corresponding mouse event
	 */
	function handleDragMovement(ev) {
		if (P1Control.isReadyToDrag) {
			ev.stopPropagation();
			handleP1Movement(ev);
		} else if (P2Control.isReadyToDrag) {
			ev.stopPropagation();
			handleP2Movement(ev);
		} else {
			return;
		}
	}
</script>

<svelte:head>
	<title>Eazier - CSS Cubic Bezier Generator</title>
</svelte:head>

<header>
	<h1 class="h5">Eazier</h1>
	<div class="side end">
		<button class="btn">Guide</button>
		<button class="btn">About</button>
	</div>
</header>

<main>
	<div class="container">
		<div class="pane one">
			<section id="graph" class="graph">
				<h1 class="h5">Graph</h1>
				<div class="graph-container" bind:this={GraphContainer} onmousemove={handleDragMovement}>
					<!-- GRAPH DISPLAY -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 400 400"
						class="graph-svg"
						stroke-linecap="round"
					>
						<g id="grid">
							<g id="vertical">
								<line id="grid-line" x1="0" y1="0" x2="0" y2="400" />
								<line id="grid-line" x1="100" y1="0" x2="100" y2="400" />
								<line id="grid-line" x1="200" y1="0" x2="200" y2="400" />
								<line id="grid-line" x1="300" y1="0" x2="300" y2="400" />
								<line id="grid-line" x1="400" y1="0" x2="400" y2="400" />
							</g>
							<g id="horizontal">
								<line id="grid-line" x1="0" y1="0" x2="400" y2="0" />
								<line id="grid-line" x1="0" y1="100" x2="400" y2="100" />
								<line id="grid-line" x1="0" y1="200" x2="400" y2="200" />
								<line id="grid-line" x1="0" y1="300" x2="400" y2="300" />
								<line id="grid-line" x1="0" y1="400" x2="400" y2="400" />
							</g>
						</g>
						<line id="linear-normal" x1="0" y1="400" x2="400" y2="0" stroke-dasharray="16" />
						<path
							d="M 0,400 C {P1Control.position.x},{P1Control.position.y} {P2Control.position
								.x},{P2Control.position.y} 400,0"
							fill="none"
							stroke="var(--color-neutral-800)"
							stroke-width="8"
						/>
						<g id="control-points">
							<g id="lines">
								<line
									id="p1-line"
									x1="0"
									y1="400"
									x2={P1Control.position.x}
									y2={P1Control.position.y}
									stroke="var(--color-neutral-800)"
									stroke-width="2"
								/>
								<line
									id="p2-line"
									x1="400"
									y1="0"
									x2={P2Control.position.x}
									y2={P2Control.position.y}
									stroke="var(--color-neutral-800)"
									stroke-width="2"
								/>
							</g>
							<g
								id="p1"
								onmousedown={() => {
									P1Control.isReadyToDrag = true;
								}}
								onmouseup={() => {
									P1Control.isReadyToDrag = false;
								}}
							>
								<circle
									cx={P1Control.position.x}
									cy={P1Control.position.y}
									r="15"
									fill="var(--color-neutral-800)"
								/>
								<circle
									cx={P1Control.position.x}
									cy={P1Control.position.y}
									r="7.5"
									fill="var(--color-white)"
								/>
							</g>
							<g
								id="p2"
								onmousedown={() => {
									P2Control.isReadyToDrag = true;
								}}
								onmouseup={() => {
									P2Control.isReadyToDrag = false;
								}}
							>
								<circle
									cx={P2Control.position.x}
									cy={P2Control.position.y}
									r="15"
									fill="var(--color-neutral-800)"
								/>
								<circle
									cx={P2Control.position.x}
									cy={P2Control.position.y}
									r="7.5"
									fill="var(--color-white)"
								/>
							</g>
						</g>
					</svg>
				</div>
				<div class="positions">
					<p>P1: x {P1Control.position.x}, y {P1Control.position.y}</p>
					<p>P2: x {P2Control.position.x}, y {P2Control.position.y}</p>
					<p>
						Graph coords: x1 {graphCoords.p1.x}, y1 {graphCoords.p1.y}, x2 {graphCoords.p2.x}, y2 {graphCoords
							.p2.y}
					</p>
				</div>
			</section>
		</div>
	</div>
</main>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
	}

	main {
		padding: 1.5rem;

		> .container {
			max-width: 1000px;
			margin-inline: auto;
		}

		.graph-container {
			min-width: 400px;
			width: 400px;
			max-width: 400px;
			position: relative;
		}
	}

	section.graph {
		display: grid;
		gap: 12px;
	}

	svg.graph-svg {
		overflow: visible;

		line#grid-line {
			stroke: var(--color-neutral-100);
			stroke-width: 1px;
		}
		line#linear-normal {
			stroke: var(--color-neutral-200);
			stroke-width: 1px;
		}
	}

	g#control-points * {
		transition: none;
	}
	g#control-points > g#p1,
	g#control-points > g#p2 {
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
</style>
