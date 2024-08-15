import type { PageLoad } from './$types';

// load data here first for SSR benefits (i think)
export const load: PageLoad = async ({ fetch }) => {
	const trips_promise = fetch('/api/bus/trips/geojson').then((res) => res.json());
	// const routes_promise = fetch('/api/bus/routes/geojson').then((res) => res.json());

	const [trips] = await Promise.all([trips_promise]);

	return {
		trips
	};
};
