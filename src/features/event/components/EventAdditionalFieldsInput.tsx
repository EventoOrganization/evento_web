import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { useFieldArray, useFormContext } from "react-hook-form";

const EventAdditionalFieldsInput = () => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalField",
  });
  const setEventField = useCreateEventStore((state) => state.setEventField);
  const additionalField = watch("additionalField");

  const updateStore = () => {
    setEventField("additionalField", additionalField);
  };

  const addField = () => {
    append({ label: "", value: "" });
    updateStore();
  };

  const removeField = (index: number) => {
    remove(index);
    updateStore();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Fields</h3>
      {fields.map((item, index) => (
        <div key={item.id} className="space-y-2 p-4 border rounded-lg">
          <FormField
            name={`additionalField[${index}].label`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Label</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Field label"
                    className="rounded-xl bg-muted sm:bg-background"
                    onChange={(e) => {
                      field.onChange(e);
                      updateStore();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`additionalField[${index}].value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Value</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Field value"
                    className="rounded-xl bg-muted sm:bg-background"
                    onChange={(e) => {
                      field.onChange(e);
                      updateStore();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="bg-red-500 text-white rounded-full"
            onClick={() => {
              removeField(index);
              updateStore();
            }}
          >
            Remove Field
          </Button>
        </div>
      ))}
      <Button
        type="button"
        className="bg-blue-500 text-white rounded-full"
        onClick={() => {
          addField();
          updateStore();
        }}
      >
        Add Field
      </Button>
    </div>
  );
};

export default EventAdditionalFieldsInput;
