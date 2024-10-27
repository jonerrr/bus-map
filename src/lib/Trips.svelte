<script lang="ts">
	import { GeoJSON, Popup, SymbolLayer } from 'svelte-maplibre';
	import { env } from '$env/dynamic/public';

	const { geojson, map }: { geojson: string; map: maplibregl.Map } = $props();

	interface Trip {
		id: string;
		capacity?: number;
		passengers?: number;
		deviation?: number;
		direction: 0 | 1;
		route_id: string;
		stop_id?: number;
		status: 'None' | 'Layover';
		bearing: number;
		vehicle_id: string;
	}

	let clicked_feature: Trip | undefined = $state(undefined);

	// $effect(() => {
	// 	console.log(map.getStyle().layers);
	// });

	// move the popup and user if the trip moves and the popup is open
	// $effect(() => {
	// 	if (clicked_feature && geojson) {
	// 		const features = map.queryRenderedFeatures(undefined, {
	// 			layers: ['trips'],
	// 			filter: ['==', 'id', clicked_feature.id]
	// 		});
	// 		console.log(features);
	// 		if (features.length) {
	// 			// const feature = features[0];
	// 			// const coordinates = feature.geometry.coordinates[0];
	// 			// map.flyTo({ center: coordinates, zoom: 17 });
	// 		}
	// 		// const feature = map.querySourceFeatures('trips', {
	// 		// 	sourceLayer: 'trips',
	// 		// 	filter: ['==', 'id', clicked_feature.id]
	// 		// })[0];
	// 		// console.log(feature);
	// 		// if (feature) {
	// 		// 	// const coordinates = feature.geometry.coordinates[0];
	// 		// 	// map.flyTo({ center: coordinates, zoom: 17 });
	// 		// }
	// 		// 			const features = map.queryRenderedFeatures([
	// 		//   [point.x - width / 2, point.y - height / 2],
	// 		//   [point.x + width / 2, point.y + height / 2]
	// 		// ], { layers: ['my-layer-name'] });
	// 	}
	// });

	// $inspect(clicked_feature);
</script>

<GeoJSON id="trips" data={geojson}>
	<!-- TODO: make sure direction is correct -->
	<SymbolLayer
		id="trips"
		on:click={(e) => (clicked_feature = e.detail.features[0].properties as Trip)}
		hoverCursor="pointer"
		layout={{
			// 'icon-image': ['match', ['get', 'direction'], 0, 'bus_right', 1, 'bus_left', 'bus_left'],
			'icon-image': 'bus_left',
			'icon-size': ['interpolate', ['exponential', 0.5], ['zoom'], 8, 0.05, 17, 0.1],
			'icon-rotate': ['coalesce', ['get', 'bearing'], 0]
		}}
	>
		<Popup>
			{#if clicked_feature}
				<div class={`max-w-[70vw] flex flex-col gap-1 text-black`}>
					<div class="flex items-center justify-between gap-1">
						<h1 class="font-bold text-lg">{clicked_feature.route_id}</h1>
						<h3>#{clicked_feature.vehicle_id}</h3>
					</div>
					<!-- {clicked_feature.bearing} -->
					{#if clicked_feature.passengers && clicked_feature.capacity}
						<div class="flex gap-1">
							<span class="font-bold">passengers</span>: {clicked_feature.passengers} / {clicked_feature.capacity}
						</div>
					{:else}
						<div class="flex gap-1">
							<span class="font-bold">passengers</span>: unknown
						</div>
					{/if}
					<div>
						<a
							href={`${env.PUBLIC_FRONTEND_URL}/?d=${clicked_feature.id}`}
							target="_blank"
							rel="noopener"
							class="font-semibold underline text-md text-indigo-700"
						>
							Live Trip Updates
						</a>
					</div>
				</div>
			{/if}
		</Popup>
	</SymbolLayer>
</GeoJSON>
