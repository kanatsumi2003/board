import { ILocation } from "@/interfaces";
import { useAddressesQuery } from "@/services/addressService";
import { useLazyGeolocationQuery } from "@/services/geolocationService";
import store, { AppState } from "@/stores";
import { updateInputs } from "@/stores/global.store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "../core/Select";

interface Props {
  defaultValue?: Partial<ILocation>;
  onChange: (location: ILocation) => void;
  onClear: () => void;
}

function LocationPicker({ onChange, defaultValue, onClear }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const [location, setLocation] = useState<Partial<ILocation>>(
    {
      district: orderRequest?.deliveryAddress?.districtCode,
      ward: orderRequest?.deliveryAddress?.wardCode,
      province: orderRequest?.deliveryAddress?.provinceCode,
    } ?? {}
  );
  const { data: provinces } = useAddressesQuery();
  const { data: districts } = useAddressesQuery(
    {
      parentCode: location.province,
    },
    {
      skip: !location.province,
    }
  );
  const { data: wards } = useAddressesQuery(
    {
      parentCode: location.district,
    },
    {
      skip: !location.district,
    }
  );
  const [getGeolocation, { data, isSuccess, isFetching }] =
    useLazyGeolocationQuery();

  useEffect(() => {
    if (location.district && location.province && location.ward) {
      onChange({
        district: location.district,
        province: location.province,
        ward: location.ward,
      });

      //QUERY LAT LONG
      const provinceName = provinces?.find(
        (p) => p.code === location.province
      )?.name;
      const districtName = districts?.find(
        (d) => d.code === location.district
      )?.name;
      const wardName = wards?.find((w) => w.code === location.ward)?.name;

      const queryLocation = [provinceName, districtName, wardName]
        .filter((item) => item)
        .join(", ");

      getGeolocation({ q: queryLocation });
    } else {
      onClear();
    }
  }, [location]);

  useEffect(() => {
    if (
      data &&
      isSuccess &&
      !isFetching &&
      data.features?.[0]?.geometry &&
      location.district &&
      location.province &&
      location.ward
    ) {
      onChange({
        district: location.district,
        province: location.province,
        ward: location.ward,
        latitude: data.features?.[0]?.geometry?.coordinates[1] || undefined,
        longitude: data.features?.[0]?.geometry?.coordinates[0] || undefined,
      });
    }
  }, [isSuccess, data, isFetching]);

  return (
    <>
      <div className="col-span-1 grid grid-cols-1 gap-8 w-full">
        <Select
          label="Chọn Tỉnh/Thành phố"
          data={
            provinces?.map((province) => ({
              label: province.name,
              value: province.code,
              key: province.code,
            })) ?? []
          }
          name="province"
          placeholder="Chọn Tỉnh/Thành phố"
          onChange={(value) => {
            setLocation((prev) => ({
              ...prev,
              province: value,
              district: undefined,
              ward: undefined,
            }));
            store.dispatch(
              updateInputs({
                district: "",
                ward: "",
              })
            );
          }}
          value={location.province}
          onClear={() => {
            setLocation({});
          }}
        ></Select>
        <Select
          data={
            location.province
              ? districts?.map((district) => ({
                  label: district.name,
                  value: district.code,
                  key: district.code,
                })) ?? []
              : []
          }
          name="district"
          label="Chọn Quận/Huyện"
          placeholder="Chọn Quận/Huyện"
          onChange={(value) => {
            setLocation((prev) => ({
              ...prev,
              district: value,
              ward: undefined,
            }));
            store.dispatch(
              updateInputs({
                ward: "",
              })
            );
          }}
          value={location.district}
          onClear={() =>
            setLocation((prev) => ({
              ...prev,
              district: undefined,
              ward: undefined,
            }))
          }
        ></Select>
        <Select
          data={
            location.district
              ? wards?.map((ward) => ({
                  label: ward.name,
                  value: ward.code,
                  key: ward.code,
                })) ?? []
              : []
          }
          value={location.ward}
          label="Chọn Phường/Xã"
          placeholder="Chọn Phường/Xã"
          name="ward"
          onChange={(value) =>
            setLocation((prev) => ({ ...prev, ward: value }))
          }
          onClear={() => {
            setLocation((prev) => ({ ...prev, ward: undefined }));
            store.dispatch(
              updateInputs({
                ward: "",
              })
            );
          }}
        ></Select>
      </div>
    </>
  );
}

export default LocationPicker;
