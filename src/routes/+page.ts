// import { env } from '$env/dynamic/public';
// // import type { FeatureCollection, MultiLineString } from 'geojson';
// import type { PageLoad } from './$types';
// // import type { Trip } from '$lib/types';

// export const load: PageLoad = async ({ fetch, depends }) => {
// 	const trips_promise = fetch(`${env.PUBLIC_API_URL}/v1/trips?geojson=true`).then((res) =>
// 		res.json()
// 	);

// 	depends('app:trips');

// 	const [trips] = await Promise.all([trips_promise]);

// 	return {
// 		trips: trips
// 	};
// };
