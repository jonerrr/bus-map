import { env } from '$env/dynamic/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const routes_promise = fetch(`${env.PUBLIC_API_URL}/bus/routes/geojson`).then((res) =>
		res.json()
	);
	const stops_promise = fetch(`${env.PUBLIC_API_URL}/bus/stops/geojson`).then((res) => res.json());

	const [routes, stops] = await Promise.all([routes_promise, stops_promise]);

	return { routes, stops };
};
