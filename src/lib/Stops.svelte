<script lang="ts">
	import { GeoJSON, Popup, SymbolLayer, CircleLayer } from 'svelte-maplibre';

	export let geojson;

	interface Stop {
		direction: string;
		id: number;
		name: string;
		routes: string;
	}

	let clicked_feature: Stop | null = null;
</script>

<GeoJSON id="stops" data={geojson}>
	<CircleLayer
		on:click={(e) => (clicked_feature = e.detail.features[0].properties)}
		hoverCursor="pointer"
		paint={{
			'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 3, 17, 15],
			'circle-color': '#0074D9',
			'circle-opacity': 1
		}}
		minzoom={14}
	>
		<Popup>
			<div class={`bg-slate-800 p-2 max-w-[70vw]`}>
				<h1 class="font-bold text-lg">
					{clicked_feature?.name}
				</h1>
				<p>
					<span class="font-bold">direction</span>: {clicked_feature?.direction}
				</p>
				<p>
					<span class="font-bold">routes</span>: {clicked_feature?.routes}
				</p>
				<p>
					<a
						href={`https://trainstat.us/?dt=bus_stop&id=${clicked_feature?.id}`}
						target="_blank"
						rel="noopener"
						class="font-semibold text-md text-blue-400"
					>
						Live bus arrivals
					</a>
				</p>
			</div>
		</Popup>
	</CircleLayer>
</GeoJSON>
