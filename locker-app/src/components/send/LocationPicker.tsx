import { ILocation } from "@/interfaces";
import { useAddressesQuery } from "@/services/addressService";
import { useEffect, useState } from "react";
import Select from "../core/Select";
import store from "@/stores";
import { updateInputs } from "@/stores/global.store";

function LocationPicker({
  onChange,
}: {
  onChange: (location: ILocation) => void;
}) {
  const [location, setLocation] = useState<Partial<ILocation>>({});
  const { data: provinces } = useAddressesQuery();
  const { data: districts, refetch: refetchDistrict } = useAddressesQuery(
    {
      parentCode: location.province,
    },
    {
      skip: !location.province,
    }
  );
  const { data: wards, refetch: refetchWard } = useAddressesQuery(
    {
      parentCode: location.district,
    },
    {
      skip: !location.district,
    }
  );

  useEffect(() => {
    if (location.district && location.province && location.ward) {
      onChange({
        district: location.district,
        province: location.province,
        ward: location.ward,
      });
    }
  }, [location]);

  return (
    <>
      <div className="col-span-1 grid grid-cols-3 gap-4 w-full">
        <Select
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
