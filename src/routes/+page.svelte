<script lang="ts">
	import {
		MapLibre,
		GeolocateControl,
		LineLayer,
		CircleLayer,
		SymbolLayer,
		VectorTileSource,
		ImageLoader,
		FeatureState,
		Popup
	} from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';
	import { mode } from 'mode-watcher';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	// TODO: figure out why this updates everytime trips are updated
	// const headsigns_by_route_direction = $derived.by(() => {
	// 	// if (!page.data.stops) return {};
	// 	// console.log('update');
	// 	const headsigns: Record<string, Record<number, string>> = {};

	// 	for (const stop_feature of page.data.stops.features) {
	// 		for (const route of stop_feature.properties.routes) {
	// 			if (headsigns[route.id] && headsigns[route.id][0] && headsigns[route.id][1]) {
	// 				continue;
	// 			}

	// 			if (!headsigns[route.id]) {
	// 				headsigns[route.id] = {};
	// 			}
	// 			headsigns[route.id][route.direction] = route.headsign;
	// 		}
	// 	}
	// 	return headsigns;
	// });
	// $inspect(headsigns_by_route_direction);

	let trip_tiles = $state.raw([`${page.url.origin}/m/latest_vehicle_position/{z}/{x}/{y}`]);

	// TODO: prevent flash on update
	onMount(() => {
		setInterval(() => {
			// console.log('updating trip tiles url');
			// cache bust by adding timestamp
			trip_tiles = [`${page.url.origin}/m/latest_vehicle_position/{z}/{x}/{y}`];
		}, 5000);
	});

	$inspect(trip_tiles);

	let hovered_stop: maplibregl.MapGeoJSONFeature | undefined = $state.raw();
	// there can be multiple routes on one line
	let hovered_routes: maplibregl.MapGeoJSONFeature[] | undefined = $state.raw();
	let hovered_trip: maplibregl.MapGeoJSONFeature | undefined = $state.raw();

	let clicked_stop: maplibregl.MapGeoJSONFeature | undefined = $state.raw();
	// there can be multiple routes on one line
	let clicked_routes: maplibregl.MapGeoJSONFeature[] | undefined = $state.raw();
	let clicked_trip: maplibregl.MapGeoJSONFeature | undefined = $state.raw();
	let lnglat: maplibregl.LngLat | undefined = $state.raw(new maplibregl.LngLat(0, 0));

	let cursor: 'default' | 'pointer' | undefined = $state();

	// should definitely make something more reusable
	let show_stops = $state(true);
	let show_routes = $state(true);
	let show_trips = $state(true);

	let show_overlapping = $state(true);
	let show_unknown = $state(true);

	let min_val = $state<number>();
	let max_val = $state<number>();

	const trips_filter: maplibregl.ExpressionSpecification = $derived.by(() => {
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
	$inspect(clicked_routes, clicked_stop, clicked_trip, lnglat);
</script>

<div class="absolute z-50 top-0 left-0">
	<div class="flex flex-col gap-1 p-2 m-2 rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-md">
		<!-- <div class="text-lg font-bold">Realtime Bus Map</div> -->

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
		<div class="text-xs mt-2">
			Data from <a
				href="https://trainstat.us"
				target="_blank"
				rel="noopener noreferrer"
				class="underline text-blue-500 hover:text-blue-700">Train Status</a
			>
		</div>
	</div>
</div>
<!-- diffStyleUpdates -->
<MapLibre
	attributionControl={false}
	style={mode.current !== 'light'
		? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
		: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'}
	center={[-74.006, 40.7128]}
	maxBounds={[
		[-74.45909, 40.277399],
		[-73.000272, 41.017577]
	]}
	zoom={12}
	maxZoom={17}
	{cursor}
	class="w-[100dvw] h-[100dvh]"
>
	<GeolocateControl
		position="bottom-left"
		positionOptions={{ enableHighAccuracy: true }}
		trackUserLocation
		showAccuracyCircle
	/>

	{#if show_routes}
		<VectorTileSource
			promoteId={'id'}
			id="route"
			tiles={[`${page.url.origin}/m/route/{z}/{x}/{y}`]}
		>
			<LineLayer
				id="route-layer"
				sourceLayer="route"
				layout={{ 'line-cap': 'round', 'line-join': 'round' }}
				filter={['==', ['get', 'route_type'], 'bus']}
				paint={{
					'line-width': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						6, // Hovered width
						3 // Normal width
					],
					'line-offset': [
						'step', // Use the 'step' expression
						['zoom'], // Get the current zoom level
						0, // Default value if zoom is less than the first stop (15)
						15, // First stop: zoom level 15
						6 // Value if zoom is 15 or greater
					],
					'line-color': ['get', 'color'],
					'line-opacity': 1.0
				}}
				onmousemove={(e) => {
					cursor = 'pointer';
					hovered_routes = e.features;
				}}
				onmouseleave={() => {
					cursor = 'default';
					hovered_routes = undefined;
				}}
				onclick={(e) => {
					clicked_routes = e.features;
					lnglat = e.lngLat;
					// maybe make other features undefined here
				}}
			/>

			{#if hovered_routes}
				{#each hovered_routes as route}
					<FeatureState sourceLayer="route" id={route.id} state={{ hover: true }} />
				{/each}
			{/if}

			{#if clicked_routes && clicked_routes.length}
				<!-- {#each clicked_routes as route}
					<FeatureState sourceLayer="route" id={route.id} state={{ click: true }} />
				{/each} -->
				<Popup
					{lnglat}
					closeButton={false}
					onclose={() => {
						console.log('closed');
						clicked_routes = undefined;
						// clicked_stop = undefined;
						// clicked_trip = undefined;
						lnglat = undefined;
					}}
				>
					<div class="p-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
						{#each clicked_routes as route}
							<span class="font-bold" style="color: {route.properties.color}">
								{route.properties.short_name}
							</span>
							<span class="text-xs">{route.properties.long_name}</span>
						{/each}
						<!-- {clicked_routes[0].properties.id} -->
					</div>
				</Popup>
			{/if}
		</VectorTileSource>
	{/if}

	{#if show_stops}
		<VectorTileSource id="stop" tiles={[`${page.url.origin}/m/stop/{z}/{x}/{y}`]}>
			<CircleLayer
				id="stop-layer"
				sourceLayer="stop"
				minzoom={13}
				paint={{
					'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 3, 17, 15],
					'circle-color': '#0074D9',
					'circle-opacity': 1,
					'circle-stroke-width': 2,
					'circle-stroke-color': '#FFFFFF'
				}}
				onmousemove={(e) => {
					cursor = 'pointer';
					hovered_stop = e.features?.[0];
				}}
				onmouseleave={() => {
					cursor = 'default';
					hovered_stop = undefined;
				}}
			/>
			{#if hovered_stop}
				<!-- {#each hovered_routes as route} -->
				<FeatureState sourceLayer="stop" id={hovered_stop.id} state={{ hover: true }} />
				<!-- {/each} -->
			{/if}
		</VectorTileSource>
	{/if}

	{#if show_trips}
		<!-- TODO: make id serial in db -->
		<VectorTileSource id="latest_vehicle_position" promoteId="id" tiles={trip_tiles}>
			<ImageLoader
				images={{
					bus: [
						`${page.url.origin}/m/sdf_sprite/sprites.png`,
						{
							sdf: true
						}
					]
				}}
			/>

			<SymbolLayer
				id="latest_vehicle_position-layer"
				sourceLayer="latest_vehicle_position"
				filter={trips_filter}
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
						mode.current !== 'light' ? '#FFFFFF' : '#0a0a0a', // Green for light mode, white for dark
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
					'icon-image': 'bus',
					'icon-size': ['interpolate', ['linear'], ['zoom'], 14, 0.8, 18, 1.2],
					'icon-rotate': ['coalesce', ['get', 'bearing'], 0],
					'icon-allow-overlap': show_overlapping
				}}
				onmousemove={(e) => {
					cursor = 'pointer';
					hovered_trip = e.features?.[0];
				}}
				onmouseleave={() => {
					cursor = 'default';
					hovered_trip = undefined;
				}}
				onclick={(e) => {
					clicked_trip = e.features?.[0];
					lnglat = e.lngLat;
					clicked_routes = undefined;
					clicked_stop = undefined;
					// maybe make other features undefined here
				}}
			/>
			<!-- {#if hovered_trip}
				<FeatureState sourceLayer="stop" id={hovered_trip.id} state={{ hover: true }} />
			{/if} -->

			{#if clicked_trip}
				<Popup
					{lnglat}
					closeButton={false}
					onclose={() => {
						console.log('closed');
						clicked_trip = undefined;
						// clicked_stop = undefined;
						// clicked_routes = undefined;
						lnglat = undefined;
					}}
				>
					<div class="p-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
						<span class="font-bold" style="color: {clicked_trip.properties.route_color}">
							{clicked_trip.properties.route_short_name}
						</span>
						<span class="text-xs"
							>Vehicle {clicked_trip.properties.vehicle_id} | {clicked_trip.properties.status}</span
						>
						<hr />
						<div class="text-sm">
							<span class="font-semibold">Passengers:</span>
							{#if clicked_trip.properties.passengers && clicked_trip.properties.capacity}
								{clicked_trip.properties.passengers} / {clicked_trip.properties.capacity}
							{:else}
								Unknown
							{/if}
						</div>
						<div class="text-sm">
							<span class="font-semibold">Last updated:</span>
							{new Date(clicked_trip.properties.recorded_at).toLocaleTimeString()}
						</div>
						<!-- {clicked_trip.properties.id} -->
					</div>
				</Popup>
			{/if}
		</VectorTileSource>
	{/if}
	<!-- TODO: fix headsigns -->
	<!-- {#if show_trips}
		<Trips
			geojson={page.data.trips}
			map={map!}
			{show_overlapping}
			filter={trips_filter}
			headsigns_by_route_direction={{}}
		/>
	{/if} -->
</MapLibre>

<style>
	:global(.maplibregl-popup-content) {
		padding: 0px 0px !important;
		background: white !important;
	}

	:global(.dark .maplibregl-popup-content) {
		background: black !important;
	}
</style>
