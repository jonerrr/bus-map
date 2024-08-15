import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ fetch }) => {
	return { routes: await (await fetch('/api/bus/routes/geojson')).json() };
};
