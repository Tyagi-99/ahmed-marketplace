import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, Input, Select, Text, Textarea, toast } from "@medusajs/ui";
import {
  FileUpload,
  Form,
  RouteFocusModal,
  useRouteModal,
  type FileType,
} from "@mercurjs/dashboard-shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  createEnergyProduct,
  uploadProductImage,
} from "../../../lib/energy-products";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.enum([
    "battery",
    "solar_panel",
    "inverter",
    "ev_charger",
    "accessory",
    "bundle",
  ]),
  brand: z.string().min(1, "Brand is required"),
  vendor: z.string().min(1, "Vendor is required"),
  price_inr: z.string().optional(),
  rating: z.coerce.number().min(0).max(5),
  review_count: z.coerce.number().min(0),
  primary_action: z.enum(["buy_now", "request_quote", "request_installation"]),
  availability: z.enum(["in_stock", "made_to_order", "rfq_only"]),
  use_case: z.string().min(1, "Use case is required"),
  description: z.string().min(10, "Description is required"),
  warranty_years: z.coerce.number().min(0),
  installation_available: z.enum(["yes", "no"]),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const CreateEnergyProductForm = () => {
  const { t } = useTranslation();
  const { handleSuccess } = useRouteModal();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      category: "battery",
      brand: "",
      vendor: "Platform Vendor",
      price_inr: "",
      rating: 4,
      review_count: 0,
      primary_action: "request_quote",
      availability: "rfq_only",
      use_case: "Home backup",
      description: "",
      warranty_years: 1,
      installation_available: "yes",
      image_url: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createEnergyProduct,
    onSuccess: async ({ product }) => {
      await queryClient.invalidateQueries({ queryKey: ["energy-catalog"] });
      toast.success(t("energyCatalog.create.success"));
      handleSuccess(`/energy-catalog/${product.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleImageUpload = async (files: FileType[]) => {
    const [uploaded] = files;

    if (!uploaded) {
      return;
    }

    const result = await uploadProductImage(uploaded.file);
    form.setValue("image_url", result.url);
    setPreviewUrl(result.url);
    toast.success(t("energyCatalog.create.imageUploaded"));
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const buyingModes =
      values.primary_action === "buy_now"
        ? ["direct_checkout", "rfq"]
        : values.primary_action === "request_installation"
          ? ["rfq", "installation_survey"]
          : ["rfq", "installation_survey"];

    await mutateAsync({
      title: values.title,
      category: values.category,
      brand: values.brand,
      vendor: values.vendor,
      price_inr: values.price_inr ? Number(values.price_inr) : null,
      rating: values.rating,
      review_count: values.review_count,
      buying_modes: buyingModes,
      primary_action: values.primary_action,
      availability: values.availability,
      use_case: values.use_case,
      description: values.description,
      warranty_years: values.warranty_years,
      installation_available: values.installation_available === "yes",
      image_url: values.image_url || undefined,
      thumbnail_color: "#334155",
      specs: {
        warranty_years: values.warranty_years,
      },
    });
  });

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={onSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <RouteFocusModal.Title>
            {t("energyCatalog.create.title")}
          </RouteFocusModal.Title>
          <RouteFocusModal.Description>
            {t("energyCatalog.create.description")}
          </RouteFocusModal.Description>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex flex-col gap-y-4 overflow-y-auto p-6">
          <Heading level="h2">{t("energyCatalog.create.sections.basic")}</Heading>

          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>{t("energyCatalog.create.fields.title")}</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />

          <Form.Field
            control={form.control}
            name="category"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>{t("energyCatalog.create.fields.category")}</Form.Label>
                <Form.Control>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="battery">Batteries</Select.Item>
                      <Select.Item value="solar_panel">Solar Panels</Select.Item>
                      <Select.Item value="inverter">Inverters</Select.Item>
                      <Select.Item value="ev_charger">EV Chargers</Select.Item>
                      <Select.Item value="accessory">Accessories</Select.Item>
                      <Select.Item value="bundle">Bundles</Select.Item>
                    </Select.Content>
                  </Select>
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Form.Field
              control={form.control}
              name="brand"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.brand")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.vendor")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>

          <Form.Field
            control={form.control}
            name="description"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>{t("energyCatalog.create.fields.description")}</Form.Label>
                <Form.Control>
                  <Textarea {...field} rows={4} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />

          <Heading level="h2">{t("energyCatalog.create.sections.commerce")}</Heading>

          <div className="grid grid-cols-2 gap-4">
            <Form.Field
              control={form.control}
              name="price_inr"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label optional>
                    {t("energyCatalog.create.fields.price")}
                  </Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder="89999" />
                  </Form.Control>
                  <Form.Hint>{t("energyCatalog.create.hints.price")}</Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="use_case"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.useCase")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Field
              control={form.control}
              name="primary_action"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.primaryAction")}</Form.Label>
                  <Form.Control>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="buy_now">Buy Now</Select.Item>
                        <Select.Item value="request_quote">Request Quote</Select.Item>
                        <Select.Item value="request_installation">
                          Request Installation
                        </Select.Item>
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="availability"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.availability")}</Form.Label>
                  <Form.Control>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="in_stock">In stock</Select.Item>
                        <Select.Item value="made_to_order">Made to order</Select.Item>
                        <Select.Item value="rfq_only">RFQ only</Select.Item>
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Field
              control={form.control}
              name="rating"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.rating")}</Form.Label>
                  <Form.Control>
                    <Input {...field} type="number" step="0.1" />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="review_count"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.reviews")}</Form.Label>
                  <Form.Control>
                    <Input {...field} type="number" />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="warranty_years"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("energyCatalog.create.fields.warranty")}</Form.Label>
                  <Form.Control>
                    <Input {...field} type="number" />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>

          <Form.Field
            control={form.control}
            name="installation_available"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>{t("energyCatalog.create.fields.installation")}</Form.Label>
                <Form.Control>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="yes">Yes</Select.Item>
                      <Select.Item value="no">No</Select.Item>
                    </Select.Content>
                  </Select>
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />

          <Heading level="h2">{t("energyCatalog.create.sections.image")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("energyCatalog.create.hints.image")}
          </Text>

          <FileUpload
            label={t("energyCatalog.create.fields.image")}
            hint={t("energyCatalog.create.hints.imageFormats")}
            formats={["image/jpeg", "image/png", "image/webp"]}
            onUploaded={handleImageUpload}
            uploadedImage={previewUrl ?? form.watch("image_url") ?? null}
          />
        </RouteFocusModal.Body>

        <RouteFocusModal.Footer>
          <RouteFocusModal.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteFocusModal.Close>
          <Button
            size="small"
            variant="primary"
            type="submit"
            isLoading={isPending}
          >
            {t("actions.create")}
          </Button>
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  );
};

const CreateEnergyProductPage = () => (
  <RouteFocusModal>
    <CreateEnergyProductForm />
  </RouteFocusModal>
);

export default CreateEnergyProductPage;