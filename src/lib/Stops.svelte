<script lang="ts">
	import { GeoJSON, Popup, SymbolLayer, CircleLayer } from 'svelte-maplibre';
	import { env } from '$env/dynamic/public';

	const { geojson }: { geojson: string } = $props();

	interface Stop {
		id: number;
		name: string;
		routes: RouteStop[];
		data: RouteData;
	}

	interface RouteStop {
		direction: number;
		id: string;
		headsign: string;
	}

	interface RouteData {
		direction: string;
	}

	let clicked_feature: Stop | undefined = $state(undefined);

	// $inspect(clicked_feature);
</script>

<GeoJSON id="stops" data={geojson}>
	<CircleLayer
		on:click={(e) => {
			const properties = e.detail.features[0].properties!;
			properties.routes = JSON.parse(properties.routes);
			properties.data = JSON.parse(properties.data);
			clicked_feature = properties as Stop;
		}}
		hoverCursor="pointer"
		paint={{
			'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 3, 17, 15],
			'circle-color': '#0074D9',
			'circle-opacity': 1
		}}
		minzoom={14}
	>
		<Popup>
			{#if clicked_feature}
				<div class={`bg-slate-800 p-2 max-w-[70vw] rounded-xl flex flex-col gap-1`}>
					<h1 class="font-bold text-lg">
						{clicked_feature.name}
					</h1>
					<div class="flex gap-1">
						<div class="font-bold">Direction:</div>
						{clicked_feature.data.direction}
					</div>

					<div class="font-bold">Routes:</div>

					<div class="flex flex-col gap-1">
						{#each clicked_feature.routes as route}
							<div class="flex gap-1">
								<strong>{route.id} -</strong>
								{route.headsign}
							</div>
						{/each}
					</div>
					<p>
						<a
							href={`${env.PUBLIC_FRONTEND_URL}/?d=${clicked_feature.id}`}
							target="_blank"
							rel="noopener"
							class="font-semibold text-md text-blue-400"
						>
							Live bus arrivals
						</a>
					</p>
				</div>
			{/if}
		</Popup>
	</CircleLayer>
</GeoJSON>
