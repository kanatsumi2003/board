import { ILocation } from "@/interfaces";
import { useAddressesQuery } from "@/services/addressService";
import { useLazyGeolocationQuery } from "@/services/geolocationService";
import store, { AppState } from "@/stores";
import { updateInputs } from "@/stores/global.store";
import { checkLocation } from "@/utils/utils";
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
  const [location, setLocation] = useState<ILocation | undefined>(
    orderRequest?.deliveryAddress
  );
  const { data: provinces } = useAddressesQuery();
  const { data: districts } = useAddressesQuery(
    {
      parentCode: location?.provinceCode,
    },
    {
      skip: !location?.provinceCode,
    }
  );
  const { data: wards } = useAddressesQuery(
    {
      parentCode: location?.districtCode,
    },
    {
      skip: !location?.districtCode,
    }
  );
  const [getGeolocation, { data, isSuccess, isFetching }] =
    useLazyGeolocationQuery();

  useEffect(() => {
    onChange(location as ILocation);
    if (location && checkLocation(location)) {
      //QUERY LAT LONG
      const queryLocation = [
        location.province,
        location.district,
        location.ward,
      ]
        .filter((item) => item)
        .join(", ");

      getGeolocation({ q: queryLocation });
    }
  }, [location]);

  useEffect(() => {
    if (
      data &&
      isSuccess &&
      !isFetching &&
      data.features?.[0]?.geometry &&
      location &&
      checkLocation(location)
    ) {
      onChange({
        ...location,
        latitude: data.features?.[0]?.geometry.coordinates?.[1],
        longitude: data.features?.[0]?.geometry.coordinates?.[0],
      } as ILocation);
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
          onChange={({ label, value }) => {
            setLocation({
              provinceCode: value,
              province: label,
            });
            store.dispatch(
              updateInputs({
                district: "",
                ward: "",
              })
            );
          }}
          value={location?.provinceCode}
          onClear={() => {
            setLocation({});
          }}
        ></Select>
        <Select
          data={
            location?.provinceCode
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
          onChange={({ label, value }) => {
            setLocation((prev) => ({
              ...prev,
              district: label,
              districtCode: value,
              ward: undefined,
              wardCode: undefined,
            }));
            store.dispatch(
              updateInputs({
                ward: "",
              })
            );
          }}
          value={location?.districtCode}
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
            location?.districtCode
              ? wards?.map((ward) => ({
                  label: ward.name,
                  value: ward.code,
                  key: ward.code,
                })) ?? []
              : []
          }
          value={location?.wardCode}
          label="Chọn Phường/Xã"
          placeholder="Chọn Phường/Xã"
          name="ward"
          onChange={({ label, value }) =>
            setLocation((prev) => ({ ...prev, ward: label, wardCode: value }))
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
