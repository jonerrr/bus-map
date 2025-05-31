<script lang="ts">
	import { GeoJSON, Popup, LineLayer } from 'svelte-maplibre';
	import { env } from '$env/dynamic/public';

	const { geojson }: { geojson: string } = $props();

	interface Route {
		id: string;
		long_name: string;
		short_name: string;
		color: string;
		shuttle: boolean;
	}

	// let clicked_feature: Route | undefined = $state();

	// $inspect(clicked_feature);
	// TODO: always have trips above routes, see: https://github.com/mapbox/mapbox-gl-js/issues/7016
</script>

<GeoJSON id="routes" data={geojson}>
	<!-- TODO: make sure direction is correct -->
	<LineLayer
		layout={{ 'line-cap': 'round', 'line-join': 'round' }}
		paint={{
			// 'line-width': [
			// 	'interpolate',
			// 	['linear'],
			// 	['zoom'],
			// 	// if zoom is less than 15, line width is 10
			// 	15,
			// 	2,
			// 	// if zoom is greater than 17, line width is 20
			// 	17,
			// 	10
			// ],
			'line-width': 3,
			// 'line-offset': 6,
			'line-offset': [
				'step', // Use the 'step' expression
				['zoom'], // Get the current zoom level
				0, // Default value if zoom is less than the first stop (15)
				15, // First stop: zoom level 15
				6 // Value if zoom is 15 or greater
			],
			'line-color': ['get', 'color'],
			'line-opacity': 1.0
			// 'line-offset': 5
		}}
	>
		<!-- <Popup>
			{#snippet children({ data }: { data: GeoJSON.Feature<GeoJSON.Geometry, Route> | undefined })}
				{#if data}
					{@const clicked_feature = data.properties}
					<div class={`max-w-[70vw]`}>
						<h1 class="font-bold text-lg" style={`color: ${clicked_feature.color}`}>
							{clicked_feature.short_name} | {clicked_feature.long_name}
						</h1>
						<div>
							<a
								href={`${env.PUBLIC_FRONTEND_URL}/?r=${encodeURIComponent(clicked_feature.id)}`}
								target="_blank"
								rel="noopener"
								class="font-semibold underline text-md text-indigo-700"
							>
								Live bus alerts
							</a>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popup> -->
	</LineLayer>
	<!-- An invisible, wider layer that overlays the top one to make hovering easier. -->
	<LineLayer
		id="popup-catcher"
		hoverCursor="pointer"
		layout={{ 'line-cap': 'round' }}
		paint={{
			'line-opacity': 0.0,
			'line-width': 20
		}}
	>
		<Popup>
			{#snippet children({ data }: { data: GeoJSON.Feature<GeoJSON.Geometry, Route> | undefined })}
				{#if data}
					{@const clicked_feature = data.properties}
					<div class={`max-w-[70vw]`}>
						<h1 class="font-bold text-lg" style={`color: ${clicked_feature.color}`}>
							{clicked_feature.short_name} | {clicked_feature.long_name}
						</h1>
						<div>
							<a
								href={`${env.PUBLIC_FRONTEND_URL}/?r=${encodeURIComponent(clicked_feature.id)}`}
								target="_blank"
								rel="noopener"
								class="font-semibold underline text-md text-indigo-700"
							>
								Live bus alerts
							</a>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popup>
	</LineLayer>
</GeoJSON>
