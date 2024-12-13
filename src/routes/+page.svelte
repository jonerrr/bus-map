<script lang="ts">
	import { MapLibre, GeolocateControl } from 'svelte-maplibre';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Routes from '$lib/Routes.svelte';
	import Trips from '$lib/Trips.svelte';
	import Stops from '$lib/Stops.svelte';

	// import StopsCool from '$lib/light-version/Stops.svelte';
	// import TripsCool from '$lib/light-version/Trips.svelte';
	// import RoutesCool from '$lib/light-version/Routes.svelte';

	// let map: maplibregl.Map | undefined = $state();
	// let loaded: boolean = $state(false);
	let map = $state<maplibregl.Map>();

	onMount(() => {
		const interval = setInterval(async () => {
			console.log('updating trips');
			await invalidate('app:trips');
		}, 20000);

		return () => clearInterval(interval);
	});

	// TODO: set line thickness of routes to prevent overlapping
	// maybe use https://stackoverflow.com/questions/72251218/variable-line-offset-in-mapbox line offset to prevent overlapping
</script>

<!-- diffStyleUpdates -->
<MapLibre
	bind:map
	onload={async (map) => {
		// list layers
		// const layers = map.getStyle().layers;
		// console.log(layers.map((l) => l.id));
		// layers.forEach((layer) => {
		// 	// if (layer.id === 'background') {
		// 	// 	map.moveLayer(layer.id, 'waterway-label');
		// 	// }
		// 	map.setLayoutProperty(layer.id, 'visibility', 'none');
		// });
		// disable background
		// map.setLayoutProperty('background', 'visibility', 'none');
		// map.setLayoutProperty('background', 'visibility', 'none');
		// map.setLayoutProperty('waterway', 'visibility', 'none');
		// map.setLayoutProperty('water_shadow', 'visibility', 'none');
		// map.setLayoutProperty('background', 'visibility', 'none');
		// map.setLayoutProperty('background', 'visibility', 'none');

		// const bus_up = await map.loadImage($mode !== 'light' ? '/bus-up-white.png' : '/bus-up.png');
		// map.addImage('bus_up', bus_up.data);

		const images = [
			`bus_${$mode !== 'light' ? 'white' : 'black'}_left`,
			// `but_white_right`,
			'bus_full',
			'bus_half_full'
		];

		for (const img of images) {
			const image = await map.loadImage(`/${img}.png`);
			map.addImage(img, image.data);
		}

		// const bus_right = await map.loadImage(
		// 	$mode !== 'light' ? '/bus_white_right.png' : '/bus_black_right.png'
		// );
		// map.addImage('bus_right', bus_right.data);

		// const bus_left = await map.loadImage(
		// 	$mode !== 'light' ? '/bus_white_left.png' : '/bus_black_left.png'
		// );
		// map.addImage('bus_left', bus_left.data);

		// const stop = await map.loadImage($mode !== 'light' ? '/bus_stop.png' : '/bus_stop.png');
		// map.addImage('bus_stop', stop.data);
	}}
	center={[-74.006, 40.7128]}
	maxBounds={[
		[-74.45909, 40.277399],
		[-73.000272, 41.017577]
	]}
	zoom={12}
	maxZoom={17}
	class="w-[100dvw] h-[100dvh]"
	standardControls={false}
	attributionControl={false}
	style={$mode !== 'light'
		? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
		: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'}
>
	<GeolocateControl
		position="bottom-left"
		trackUserLocation
		showAccuracyCircle
		showUserLocation
		fitBoundsOptions={{ maxZoom: 15 }}
	/>

	<Routes geojson={$page.data.routes} />
	<Stops geojson={$page.data.stops} />
	<Trips geojson={$page.data.trips} {map} />
</MapLibre>

<!-- <style>
	:global(.maplibregl-popup-content) {
		background-color: var(--color-bg);
		color: var(--color-text);
		padding: 0px;
	}
</style> -->
