/////////// stop types ///////////
export interface Stop {
    data: StopData;
    id: number;
    name: string;
    route_type: string;
    routes: Route[];
}

export interface StopData {
    direction: string;
}

export interface Route {
    direction: number;
    headsign: string;
    id: string;
    stop_sequence: number;
}

/////////// trip types ///////////
export interface Trip {
    id: string;
    capacity: number | null;
    passengers: number | null;
    deviation: number | null;
    direction: 0 | 1;
    route_id: string;
    stop_id: number | null;
    status: string;
    bearing: number;
    vehicle_id: string;
    created_at: string;
    updated_at: string;
    mta_id: string;
}

/////////// route types ///////////
export interface Route {
    id: string;
    long_name: string;
    short_name: string;
    color: string;
    shuttle: boolean;
    route_type: string;
}