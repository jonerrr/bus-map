<script lang="ts">
	import { GeoJSON, Popup, LineLayer } from 'svelte-maplibre';

	export let geojson;

	interface Route {
		id: string;
		long_name: string;
		short_name: string;
		color: string;
		shuttle: boolean;
	}

	let clicked_feature: Route | null = null;
</script>

<!-- data={geojson} -->
<GeoJSON id="routes" data={geojson}>
	<!-- TODO: make sure direction is correct -->
	<LineLayer
		on:click={(e) => (clicked_feature = e.detail.features[0].properties)}
		hoverCursor="pointer"
		layout={{ 'line-cap': 'round', 'line-join': 'round' }}
		paint={{
			'line-width': [
				'interpolate',
				['linear'],
				['zoom'],
				// if zoom is less than 15, line width is 10
				15,
				2,
				// if zoom is greater than 17, line width is 20
				17,
				10
			],

			'line-color': ['get', 'color'],
			'line-opacity': 1.0
			// 'line-offset': 5
		}}
	>
		<Popup>
			<div class={`bg-slate-800 p-2 max-w-[70vw]`}>
				<h1 class="font-bold text-lg" style={`color: ${clicked_feature?.color}`}>
					{clicked_feature?.short_name} | {clicked_feature?.long_name}
				</h1>
				<p>
					<!-- TODO: stuff -->
				</p>
			</div>
		</Popup>
	</LineLayer>
</GeoJSON>
