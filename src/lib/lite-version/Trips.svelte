<script lang="ts">
	import { GeoJSON, Popup, SymbolLayer, CircleLayer } from 'svelte-maplibre';

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
	<CircleLayer
		on:click={(e) => (clicked_feature = e.detail.features[0].properties)}
		hoverCursor="pointer"
		paint={{
			'circle-radius': 1.0,
			'circle-color': '#FFFFFF',
			'circle-opacity': 1
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
					{:else}
						<p>
							<span class="font-bold">passengers</span>: unknown
						</p>
					{/if}
					<p></p>
					<p>
						<a
							href={`https://trainstat.us/?dt=bus_trip&id=${clicked_feature.id}_${clicked_feature.route_id}`}
							target="_blank"
							rel="noopener"
							class="font-semibold text-md text-blue-400"
						>
							Live bus arrivals
						</a>
					</p>
				</div>
			{/if}
		</Popup>
	</CircleLayer>
</GeoJSON>
