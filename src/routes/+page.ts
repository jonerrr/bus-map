// import type { PageLoad } from './$types';

// interface Route {
// 	id: string;
// 	long_name: string;
// 	short_name: string;
// 	shuttle: boolean;
// 	geom: Geom[];
// }

// interface Geom {
// 	direction: 0 | 1;
// 	wkt: string;
// }

// // load data here first for SSR benefits (i think)
// export const load: PageLoad = async ({ fetch }) => {
// 	return {
// 		routes: (await (await fetch('/api/bus/routes?geom=true')).json()) as Route[]
// 	};
// };
