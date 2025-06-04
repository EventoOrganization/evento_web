export function handleInputChangeFactory(setFormValues: any) {
  return (
    field: string,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormValues((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
}

export function handleValueChangeFactory(setFormValues: any) {
  return (field: string, value: string | number | boolean | null | any[]) => {
    setFormValues((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
}
