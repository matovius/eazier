<script>
	/**
	 * @typedef Props
	 * @prop { string } id
	 * @prop { number } [min]
	 * @prop { number } [max]
	 * @prop { number } [step]
	 * @prop { number } [value]
	 */

	/** @type { Props } */
	let { id, min = 0, max = 1, step = 0.01, value = $bindable(0) } = $props();
</script>

<input type="number" {id} class="graph-input" {min} {max} {step} bind:value />
