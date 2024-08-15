<script lang="ts">
	import { MapLibre, GeolocateControl } from 'svelte-maplibre';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	// import type { PageData } from './$types';
	import Routes from '$lib/Routes.svelte';
	import Trips from '$lib/Trips.svelte';
	import Stops from '$lib/Stops.svelte';

	// export let data: PageData;

	let map: maplibregl.Map;
	let loaded: boolean = false;

	onMount(() => {
		setInterval(async () => {
			console.log('updating trips');
			await invalidate('/api/bus/trips/geojson');
		}, 10000);
	});

	// TODO: set line thickness of routes to prevent overlapping
	// maybe use https://stackoverflow.com/questions/72251218/variable-line-offset-in-mapbox line offset to prevent overlapping
</script>

<MapLibre
	bind:map
	bind:loaded
	on:load={async () => {
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
	zoom={12}
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

	<Routes geojson={$page.data.routes} />

	<Stops />

	<Trips geojson={$page.data.trips} />
</MapLibre>

<style>
	:global(.maplibregl-popup-content) {
		background-color: var(--color-bg);
		color: var(--color-text);
		padding: 0px;
	}
</style>
