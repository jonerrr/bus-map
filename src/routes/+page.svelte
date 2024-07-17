<script lang="ts">
	import {
		MapLibre,
		GeoJSON,
		LineLayer,
		Popup,
		CircleLayer,
		GeolocateControl
	} from 'svelte-maplibre';
	import { mode } from 'mode-watcher';

	let map: maplibregl.Map;
	let loaded: boolean = false;

	// $: if (map && loaded) {
	// }

	interface Route {
		id: string;
		color: string;
		// blame shapefile for this
		descriptio: string;
		longName: string;
		shortName: string;
	}

	interface Stop {
		id: number;
		direction: string;
		name: string;
		routes: string;
	}

	$: selected_route = null as null | Route;
	$: selected_stop = null as null | Stop;
</script>

<MapLibre
	bind:map
	bind:loaded
	center={[-74.006, 40.7128]}
	maxBounds={[
		[-74.25909, 40.477399],
		[-73.700272, 40.917577]
	]}
	zoom={12}
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

	<GeoJSON id="routes" data="/routes.geojson">
		<LineLayer
			on:click={(e) => (selected_route = e.detail.features?.[0]?.properties)}
			hoverCursor="pointer"
			layout={{ 'line-cap': 'round', 'line-join': 'round' }}
			paint={{
				'line-width': {
					base: 4,
					stops: [
						[11, 5],
						[18, 12]
					]
				},
				'line-color': ['get', 'color'],
				'line-opacity': 0.8
			}}
		>
			<Popup>
				<div class={`bg-slate-800 p-2 max-w-[70vw]`}>
					<h1 class="font-bold text-lg" style={`color: ${selected_route?.color}`}>
						{selected_route?.shortName} | {selected_route?.longName}
					</h1>
					<p>
						{selected_route?.descriptio}
					</p>
				</div>
			</Popup>
		</LineLayer>
	</GeoJSON>

	<GeoJSON id="stops" data="/stops.geojson">
		<CircleLayer
			on:click={(e) => (selected_stop = e.detail.features?.[0]?.properties)}
			hoverCursor="pointer"
			layout={{ visibility: 'visible' }}
			paint={{
				'circle-radius': {
					base: 3,
					stops: [
						[11, 4],
						[20, 180]
					]
				},
				'circle-color': '#39CCCC',
				'circle-opacity': 0.8
			}}
		>
			<Popup>
				<div class={`bg-slate-800 p-2 max-w-[70vw]`}>
					<h1 class="font-bold text-lg">
						{selected_stop?.name}
					</h1>
					<p>
						<span class="font-bold">direction</span>: {selected_stop?.direction}
					</p>
					<p>
						<span class="font-bold">routes</span>: {selected_stop?.routes}
					</p>
				</div>
			</Popup>
		</CircleLayer>
	</GeoJSON>
</MapLibre>

<style>
	:global(.maplibregl-popup-content) {
		background-color: var(--color-bg);
		color: var(--color-text);
		padding: 0px;
	}
</style>
