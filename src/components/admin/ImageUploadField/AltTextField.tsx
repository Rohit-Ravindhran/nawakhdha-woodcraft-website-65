
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

interface AltTextFieldProps {
  name: string;
  control: any;
}

const AltTextField = ({ name, control }: AltTextFieldProps) => {
  return (
    <FormItem>
      <FormLabel>Alt Text</FormLabel>
      <FormControl>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input placeholder="Image description for SEO" {...field} />
          )}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default AltTextField;
