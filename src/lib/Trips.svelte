<script lang="ts">
	import { GeoJSON, Popup, SymbolLayer } from 'svelte-maplibre';
	import { mode } from 'mode-watcher';
	import { env } from '$env/dynamic/public';

	interface Props {
		geojson: string;
		map: maplibregl.Map;
		filter?: maplibregl.ExpressionSpecification;
		show_overlapping: boolean;
	}

	const { geojson, map, filter, show_overlapping }: Props = $props();
	// TODO: use GeoJSON type
	interface Trip {
		id: string;
		capacity?: number;
		passengers?: number;
		deviation?: number;
		direction: 0 | 1;
		route_id: string;
		stop_id?: number;
		// status: 'None' | 'Layover';
		status: string;
		bearing: number;
		vehicle_id: string;
	}

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
		hoverCursor="pointer"
		{filter}
		paint={{
			'icon-color': [
				'interpolate',
				['linear'],
				// Calculate passengers / capacity ratio. Coalesce to handle nulls and prevent division by zero.
				[
					'/',
					['coalesce', ['get', 'passengers'], 0],
					['coalesce', ['get', 'capacity'], 1, 0.00001]
				], // Added a small epsilon to capacity to avoid division by zero if capacity is 0
				// Define color stops for the gradient based on the ratio
				0, // Ratio 0 (0% full)
				$mode !== 'light' ? '#FFFFFF' : '#0a0a0a', // Green for light mode, white for dark
				0.3, // Ratio 0.3 (30% full)
				'#facc15', // Yellow
				0.5, // Ratio 0.5 (50% full)
				'#FFA500', // Orange
				1, // Ratio 1 (100% full or more)
				'#b91c1c' // Red
			]
			// 'icon-color': $mode !== 'light' ? '#FFFFFF' : '#000000'
		}}
		layout={{
			// 'icon-image': ['match', ['get', 'direction'], 0, 'bus_right', 1, 'bus_left', 'bus_left'],
			// 'icon-image': [
			// 	'case',
			// 	// Calculate passengers / capacity with coalesce to handle nulls
			// 	[
			// 		'>',
			// 		['/', ['coalesce', ['get', 'passengers'], 0], ['coalesce', ['get', 'capacity'], 1]],
			// 		0.5
			// 	],
			// 	'bus_full',

			// 	[
			// 		'>',
			// 		['/', ['coalesce', ['get', 'passengers'], 0], ['coalesce', ['get', 'capacity'], 1]],
			// 		0.3
			// 	],
			// 	'bus_half_full',
			// 	// Default icon if none of the above conditions are met
			// 	'bus_white_left'
			// ],

			'icon-image': 'bus_sdf',
			// 'icon-size': ['interpolate', ['exponential', 0.5], ['zoom'], 8, 0.05, 17, 0.1],
			'icon-size': 0.15,
			'icon-rotate': ['coalesce', ['get', 'bearing'], 0],
			'icon-allow-overlap': show_overlapping
		}}
	>
		<Popup popupClass="popup-transparent">
			{#snippet children({ data }: { data: GeoJSON.Feature<GeoJSON.Geometry, Trip> | undefined })}
				{#if data}
					{@const clicked_feature = data.properties}
					<div
						class={`max-w-[70vw] flex flex-col gap-1 rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-md p-2`}
					>
						<div class="flex items-center justify-between gap-1">
							<h1 class="font-bold text-lg">{clicked_feature.route_id}</h1>
							<h3>#{clicked_feature.vehicle_id}</h3>
						</div>
						{#if clicked_feature.bearing}
							<div class="flex gap-1">
								<span class="font-bold">bearing</span>: {clicked_feature.bearing}
							</div>
						{/if}
						{#if clicked_feature.deviation}
							<div class="flex gap-1">
								<span class="font-bold">deviation</span>: {clicked_feature.deviation}
							</div>
						{/if}
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

						<div class="flex gap-1">
							<span class="font-bold">status</span>: {clicked_feature.status}
						</div>

						<div>
							<a
								href={`${env.PUBLIC_FRONTEND_URL}/?t=${clicked_feature.id}`}
								target="_blank"
								rel="noopener"
								class="font-semibold underline text-md text-indigo-700"
							>
								Live Trip Updates
							</a>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popup>
	</SymbolLayer>
</GeoJSON>
