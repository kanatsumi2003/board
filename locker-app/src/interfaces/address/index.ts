export interface IAddressItem {
  code: string;
  name: string;
  parentCode: string;
}

export interface IAddressParams {
  parentCode: string;
}

export interface IGeolocationItem {
  type: string;
  geocoding: {
    version: string;
    attribution: string;
    licence: string;
    query: string;
  };
  features: IGeolocationDetailItem[];
}
export interface IGeolocationDetailItem {
  type: string;
  properties: {
    geocoding: {
      place_id: number;
      osm_type: string;
      osm_id: number;
      osm_key: string;
      osm_value: string;
      type: string;
      label: string;
      name: string;
    };
  };
  geometry?: { type: string; coordinates: [number, number] };
}
