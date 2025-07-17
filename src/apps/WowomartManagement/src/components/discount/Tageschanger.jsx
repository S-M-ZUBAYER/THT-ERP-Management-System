import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import useStore from "../../zustand/inputValueStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
// import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

const formSchema = z.object({
  userId: z.string(),
  tag: z.string().min(1, "Tag is required"),
});

function TagChangeForm() {
  const { inputValue, clearInputValues } = useStore();
  const [tagsList, setTagsList] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: inputValue.map((i) => i.id).join(" "),
      tag: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/coupons-by-tag"
        );

        setTagsList(response.data.result);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const onSubmit = async (data) => {
    setMessage({ type: "", text: "" });

    if (!data.tag.trim() || inputValue.length === 0) {
      form.setError("tag", { message: "Tag is required" });
      form.setError("userId", { message: "No user IDs provided" });
      return;
    }

    try {
      await Promise.all(
        inputValue.map(({ id }) =>
          axios.post(
            "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/update",
            {
              update: 1,
              customerId: Number(id),
              tags: [data.tag],
            },
            { headers: { "Content-Type": "application/json" } }
          )
        )
      );

      if (selectedTag) {
        await Promise.all(
          inputValue.map(({ email, id }) =>
            email
              ? axios.post(
                  "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/couponUserList/create",
                  {
                    title: selectedTag.title,
                    percentage: selectedTag.percentage,
                    segmentQuery: selectedTag.segmentQuery,
                    minimumAmount: selectedTag.minimumAmount,
                    minimumItem: selectedTag.minimumItem,
                    code: selectedTag.code,
                    expireDate:
                      selectedTag.expireDate || "2025-12-31T23:59:59.000Z",
                    segmentId: selectedTag.segmentId || "1",
                    discountId: selectedTag.discountId || "1",
                    tag: selectedTag.tag,
                    email,
                    customerId: id,
                  },
                  { headers: { "Content-Type": "application/json" } }
                )
              : null
          )
        );
      }

      setMessage({ type: "success", text: "✅ Tags updated successfully!" });
      clearInputValues();
      form.reset({ tag: "" });
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please retry.",
      });
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-h-48 overflow-y-auto space-y-1 pl-1 sm:pl-3">
            {inputValue.map(({ email }, index) => (
              <p key={index} className="text-[#90B4C8]">
                {index + 1}. {email}
              </p>
            ))}
          </div>

          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#004368] font-bold">
                  Select Tag
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    const selected = tagsList.find((t) => t.tag === value);
                    setSelectedTag(selected);
                    field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger
                      className="bg-white focus:outline-none"
                      style={{
                        backgroundColor: "transparent",
                        outline: "none",
                      }}
                    >
                      <SelectValue
                        placeholder="Select a tag"
                        className="text-[#004368]"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tagsList.map((tag) => (
                      <SelectItem
                        key={tag.id}
                        value={tag.tag}
                        className="text-[#004368]"
                      >
                        {tag.title} ({tag.percentage}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {message.text && (
            <p
              className={`text-sm mt-1 ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: "#004368", color: "white" }}
          >
            Change Tag
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default TagChangeForm;
