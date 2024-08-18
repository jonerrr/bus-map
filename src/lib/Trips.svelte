<script lang="ts">
	import { GeoJSON, Popup, SymbolLayer } from 'svelte-maplibre';

	export let geojson;

	interface Trip {
		id: string;
		capacity: number | null;
		passengers: number | null;
		direction: 0 | 1;
		route_id: string;
		stop_id: number;
	}

	let clicked_feature: Trip | null = null;
</script>

<GeoJSON id="trips" data={geojson}>
	<!-- TODO: make sure direction is correct -->
	<SymbolLayer
		on:click={(e) => (clicked_feature = e.detail.features[0].properties)}
		hoverCursor="pointer"
		layout={{
			'icon-image': ['match', ['get', 'direction'], 0, 'bus_right', 1, 'bus_left', 'bus_left'],
			'icon-size': ['interpolate', ['exponential', 0.5], ['zoom'], 8, 0.05, 17, 0.1]
		}}
	>
		<Popup>
			{#if clicked_feature}
				<div class={`bg-slate-800 p-2 max-w-[70vw]`}>
					<h1 class="font-bold text-lg">{clicked_feature?.route_id}</h1>
					{#if clicked_feature.passengers && clicked_feature.capacity}
						<p>
							<span class="font-bold">passengers</span>: {clicked_feature.passengers} / {clicked_feature.capacity}
						</p>
					{/if}
					<p></p>
				</div>
			{/if}
		</Popup>
	</SymbolLayer>
</GeoJSON>
