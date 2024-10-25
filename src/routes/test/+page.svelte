<script lang="ts">
	import { MapLibre, GeolocateControl } from 'svelte-maplibre';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	// import type { PageData } from './$types';

	import StopsCool from '$lib/lite-version/Stops.svelte';
	import TripsCool from '$lib/lite-version/Trips.svelte';
	import RoutesCool from '$lib/lite-version/Routes.svelte';

	// export let data: PageData;

	function getRandomLatLng(bounds: {
		minLat: number;
		maxLat: number;
		minLng: number;
		maxLng: number;
	}): { lat: number; lng: number } {
		const lat = Math.random() * (bounds.maxLat - bounds.minLat) + bounds.minLat;
		const lng = Math.random() * (bounds.maxLng - bounds.minLng) + bounds.minLng;
		return { lat, lng };
	}

	// Example usage:
	const bounds = {
		minLat: 40.477399,
		maxLat: 40.917577,
		minLng: -74.25909,
		maxLng: -73.700272
	};

	const randomLocation = getRandomLatLng(bounds);
	console.log(randomLocation);

	let map: maplibregl.Map;
	let loaded: boolean = false;

	onMount(() => {
		setInterval(async () => {
			console.log('updating trips');
			await invalidate((url) => url.pathname === '/api/bus/trips/geojson');

			const new_loc = getRandomLatLng(bounds);

			map.flyTo({
				center: [new_loc.lng, new_loc.lat],
				zoom: 15,
				speed: 0.5
			});
			// await invalidateAll();
		}, 30000);
	});

	// TODO: set line thickness of routes to prevent overlapping
	// maybe use https://stackoverflow.com/questions/72251218/variable-line-offset-in-mapbox line offset to prevent overlapping
</script>

<MapLibre
	bind:map
	bind:loaded
	on:load={async () => {
		// list layers
		const layers = map.getStyle().layers;
		console.log(layers.map((l) => l.id));
		layers.forEach((layer) => {
			// if (layer.id === 'background') {
			// 	map.moveLayer(layer.id, 'waterway-label');
			// }
			if (layer.id !== 'background') {
				map.setLayoutProperty(layer.id, 'visibility', 'none');
			}
		});
		// disable background
		// map.setLayoutProperty('background', 'visibility', 'none');
		// map.setLayoutProperty('background', 'visibility', 'none');
		// map.setLayoutProperty('waterway', 'visibility', 'none');
		// map.setLayoutProperty('water_shadow', 'visibility', 'none');
		// map.setLayoutProperty('background', 'visibility', 'none');
		// map.setLayoutProperty('background', 'visibility', 'none');

		const bus_right = await map.loadImage(
			$mode !== 'light' ? '/bus_white_right.png' : '/bus_black_right.png'
		);
		map.addImage('bus_right', bus_right.data);

		const bus_left = await map.loadImage(
			$mode !== 'light' ? '/bus_white_left.png' : '/bus_black_left.png'
		);
		map.addImage('bus_left', bus_left.data);

		const stop = await map.loadImage($mode !== 'light' ? '/bus_stop.png' : '/bus_stop.png');
		map.addImage('bus_stop', stop.data);
	}}
	center={[-74.006, 40.7128]}
	maxBounds={[
		[-74.25909, 40.477399],
		[-73.700272, 40.917577]
	]}
	bounds={[
		[-74.25909, 40.477399],
		[-73.700272, 40.917577]
	]}
	zoom={15}
	minZoom={15}
	maxZoom={15}
	diffStyleUpdates
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
	<RoutesCool geojson={$page.data.routes} />
	<!-- <StopsCool geojson={$page.data.stops} /> -->
	<TripsCool geojson={$page.data.trips} />

	<!-- <Routes geojson={$page.data.routes} />
	<Stops geojson={$page.data.stops} />
	<Trips geojson={$page.data.trips} /> -->
</MapLibre>

<style>
	:global(.maplibregl-popup-content) {
		background-color: var(--color-bg);
		color: var(--color-text);
		padding: 0px;
	}
</style>
