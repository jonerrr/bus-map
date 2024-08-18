import { PUBLIC_API_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const trips_promise = fetch(`${PUBLIC_API_URL}/bus/trips/geojson`).then((res) => res.json());

	const [trips] = await Promise.all([trips_promise]);

	return {
		trips
	};
};
