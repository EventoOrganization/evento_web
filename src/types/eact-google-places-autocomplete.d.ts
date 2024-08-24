declare module "react-google-places-autocomplete" {
  import * as React from "react";

  type GooglePlacesAutocompleteProps = {
    apiKey: string;
    selectProps: {
      value: string;
      onChange: (value: any) => void;
      placeholder?: string;
      onSelect: (place: any) => void;
    };
  };

  const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps>;

  export default GooglePlacesAutocomplete;
}
