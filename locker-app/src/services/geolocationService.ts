import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQueryGeolocation from "@/configs/axiosBaseQueryGeolocation";
import endpoints from "@/constants/endpoints";
import {
  IGeolocationItem
} from "@/interfaces/address";

export const geolocationApi = createApi({
  reducerPath: "geolocationApi",
  baseQuery: axiosBaseQueryGeolocation(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Geolocation"],
  endpoints: (build) => ({
    geolocation: build.query<IGeolocationItem, { q: string }>({
      query: (params) => ({
        url: endpoints.getAddressEndpoints(params.q).geolocation,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGeolocationQuery } = geolocationApi;
