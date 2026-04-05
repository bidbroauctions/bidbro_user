import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { Location } from "@/types"; // Make sure your Location interface is correctly imported

interface AddressAutocompleteProps {
  onSelectAddress: (location: Location) => void; // Callback function to return the selected address data
  label?: string;
  error?: string;
  parentClassName?: string;
  labelClassName?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelectAddress,
  label,
  error,
  parentClassName,
  labelClassName,
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed (e.g., location, radius) */
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const geocodeResults = await getGeocode({ address });
      const { lat, lng } = await getLatLng(geocodeResults[0]);
      const placeId = geocodeResults[0].place_id;

      // Extract necessary data from geocode results
      const fullAddress = geocodeResults[0].formatted_address;
      const addressComponents = geocodeResults[0].address_components;

      // Extract state and country
      let state = "";
      let country = "";

      addressComponents.forEach((component) => {
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (component.types.includes("country")) {
          country = component.long_name;
        }
      });

      // Return selected location data to the parent component
      const locationData: Location = {
        placeId,
        fullAddress,
        state,
        country,
        coordinates: { lat, lng },
      };
      onSelectAddress(locationData);
    } catch (error) {
      console.error("Error selecting address:", error);
    }
  };

  return (
    <div className={`input-wrapper space-y-2 flex flex-col ${parentClassName}`}>
      {label && <label className={labelClassName || ""}>{label}</label>}
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Enter your address"
          className={`bg-[#EAECF0] placeholder:text-[#667085] border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-4 text-sm leading-5 focus:outline-none focus:border focus:ring-0 w-full`}
        />
        <ComboboxPopover>
          {status === "OK" && (
            <ComboboxList>
              {data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
            </ComboboxList>
          )}
        </ComboboxPopover>
      </Combobox>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default AddressAutocomplete;
