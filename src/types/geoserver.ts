// GeoServer district type
export interface District {
  dist_cod: string;
  dist_e: string;
}

// GeoServer village type
export interface Village {
  id: string;
  village: string;
}

// Layer visibility type
export interface LayerVisibility {
  state?: boolean;
  district?: boolean;
  village?: boolean;
  anganwadi?: boolean;
  schools?: boolean;
  gap?: boolean;
  rail?: boolean;
  river?: boolean;
  road?: boolean;
}
