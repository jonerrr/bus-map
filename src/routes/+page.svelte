<script lang="ts">
	import { MapLibre, GeolocateControl } from 'svelte-maplibre';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Routes from '$lib/Routes.svelte';
	import Trips from '$lib/Trips.svelte';
	import Stops from '$lib/Stops.svelte';
	import { slide } from 'svelte/transition';

	let map = $state<maplibregl.Map>();

	onMount(() => {
		const interval = setInterval(async () => {
			console.log('updating trips');
			await invalidate('app:trips');
		}, 20000);

		return () => clearInterval(interval);
	});

	// should definitely make something more reusable
	let show_stops = $state(true);
	let show_routes = $state(true);
	let show_trips = $state(true);

	let show_overlapping = $state(true);
	let show_unknown = $state(true);

	let min_val = $state<number>();
	let max_val = $state<number>();

	const trips_filter: maplibregl.ExpressionSpecification | undefined = $derived.by(() => {
		// if (!min_val && !max_val) return undefined;

		const filter: maplibregl.ExpressionSpecification = ['all'];
		// need to coalesce bc some values are null
		if (!show_unknown) filter.push(['!=', ['coalesce', ['get', 'passengers'], -1], -1]);
		if (min_val) filter.push(['>=', ['coalesce', ['get', 'passengers'], 0], min_val]);
		if (max_val) filter.push(['<=', ['coalesce', ['get', 'passengers'], 0], max_val]);

		return filter;
	});

	let filters_open = $state(true);

	// TODO: set line thickness of routes to prevent overlapping
	// maybe use https://stackoverflow.com/questions/72251218/variable-line-offset-in-mapbox line offset to prevent overlapping
</script>

<div class="absolute z-50 top-0 left-0">
	<div class="flex flex-col gap-1 p-2 m-2 rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-md">
		<div class="flex justify-between gap-1 items-center min-w-52">
			<div class="text-lg font-semibold">Filters</div>
			<button
				onclick={() => {
					filters_open = !filters_open;
				}}
				class="underline text-sm text-blue-500 hover:text-blue-700"
				>{filters_open ? 'Hide' : 'Show'}</button
			>
		</div>
		{#if filters_open}
			<div class="flex flex-col gap-1" transition:slide>
				<label class="grid grid-cols-[1fr_auto] items-center gap-2">
					<span>Routes</span>
					<input bind:checked={show_routes} type="checkbox" />
				</label>
				<label class="grid grid-cols-[1fr_auto] items-center gap-2">
					<span>Stops</span>
					<input bind:checked={show_stops} type="checkbox" />
				</label>
				<label class="grid grid-cols-[1fr_auto] items-center gap-2">
					<span>Trips</span>
					<input bind:checked={show_trips} type="checkbox" />
				</label>
				{#if show_trips}
					<div class="flex flex-col gap-1" transition:slide>
						<label class="grid grid-cols-[1fr_auto] items-center gap-2">
							<span>Overlapping</span>
							<input bind:checked={show_overlapping} type="checkbox" />
						</label>
						<label class="grid grid-cols-[1fr_auto] items-center gap-2">
							<span>Unknown passengers</span>
							<input bind:checked={show_unknown} type="checkbox" />
						</label>
						<label class="grid grid-cols-[1fr_auto] items-center gap-2">
							<span>Min passengers</span>
							<input
								bind:value={min_val}
								type="number"
								inputmode="numeric"
								min="0"
								class="w-16 rounded-sm border border-neutral-900 dark:border-neutral-100"
							/>
						</label>
						<label class="grid grid-cols-[1fr_auto] items-center gap-2">
							<span>Max passengers</span>
							<input
								bind:value={max_val}
								type="number"
								inputmode="numeric"
								min="0"
								class="w-16 rounded-sm border border-neutral-900 dark:border-neutral-100"
							/>
						</label>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
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

		// const images = [
		// 	`bus_${$mode !== 'light' ? 'white' : 'black'}_left`,
		// 	// `but_white_right`,
		// 	'bus_full',
		// 	'bus_half_full'
		// ];

		// Promise.all([
		// 	...images.map(async (img) => {
		// 		const image = await map.loadImage(`/${img}.png`);
		// 		map.addImage(img, image.data);
		// 	})
		// ]);
		// generated using https://jobtalle.com/SDFMaker/
		const img_sdf = await map.loadImage('/bus_sdf.png');
		map.addImage('bus_sdf', img_sdf.data, { sdf: true });
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

	{#if show_routes}
		<Routes geojson={$page.data.routes} />
	{/if}
	{#if show_stops}
		<Stops geojson={$page.data.stops} />
	{/if}
	{#if show_trips}
		<Trips geojson={$page.data.trips} map={map!} {show_overlapping} filter={trips_filter} />
	{/if}
</MapLibre>
