<script lang="ts">
	import { GeoJSON, Popup, SymbolLayer, CircleLayer } from 'svelte-maplibre';
	import { env } from '$env/dynamic/public';

	const { geojson }: { geojson: string } = $props();

	interface Stop {
		id: number;
		name: string;
		routes: string;
		data: string;
		// routes: RouteStop[];
		// data: RouteData;
	}

	interface RouteStop {
		direction: number;
		id: string;
		headsign: string;
	}

	interface RouteData {
		direction: string;
	}

	// let clicked_feature: Stop | undefined = $state(undefined);

	// $inspect(clicked_feature);
</script>

<GeoJSON id="stops" data={geojson}>
	<CircleLayer
		onclick={(e) => {
			// const properties = e.features[0].properties!;
			// properties.routes = JSON.parse(properties.routes);
			// properties.data = JSON.parse(properties.data);
			// clicked_feature = properties as Stop;
		}}
		hoverCursor="pointer"
		paint={{
			// 'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 3, 17, 15],
			'circle-color': '#0074D9',
			'circle-opacity': 1
		}}
		minzoom={14}
	>
		<Popup>
			{#snippet children({ data }: { data: GeoJSON.Feature<GeoJSON.Geometry, Stop> | undefined })}
				{#if data}
					{@const clicked_feature = data.properties}
					{@const routes = JSON.parse(clicked_feature.routes) as RouteStop[]}
					{@const route_data = JSON.parse(clicked_feature.data) as RouteData}
					<div class={`rounded-xl flex flex-col gap-1 text-black`}>
						<h1 class="font-bold text-lg">
							{clicked_feature.name}
						</h1>
						<div class="flex gap-1">
							<div class="font-bold">Direction:</div>
							{route_data.direction}
						</div>

						<div class="font-bold">Routes:</div>

						<div class="flex flex-col gap-1">
							{#each routes as route}
								<div class="flex gap-1">
									<strong>{route.id} -</strong>
									{route.headsign}
								</div>
							{/each}
						</div>
						<p>
							<a
								href={`${env.PUBLIC_FRONTEND_URL}/?s=${clicked_feature.id}`}
								target="_blank"
								rel="noopener"
								class="font-semibold underline text-md text-indigo-700"
							>
								Live bus arrivals
							</a>
						</p>
					</div>
				{/if}
			{/snippet}
		</Popup>
	</CircleLayer>
</GeoJSON>
