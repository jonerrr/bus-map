import { PUBLIC_API_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const routes_promise = fetch(`${PUBLIC_API_URL}/bus/routes/geojson`).then((res) => res.json());
	const stops_promise = fetch(`${PUBLIC_API_URL}/bus/stops/geojson`).then((res) => res.json());

	const [routes, stops] = await Promise.all([routes_promise, stops_promise]);

	return { routes, stops };
};
