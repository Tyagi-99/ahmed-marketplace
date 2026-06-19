import { Trash } from "@medusajs/icons"
import { Container, Heading, StatusBadge, Text, toast, usePrompt } from "@medusajs/ui"
import {
  ActionMenu,
  NoRecords,
  Query,
  SectionRow,
  SingleColumnPage,
} from "@mercurjs/dashboard-shared"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { client } from "../../../lib/client"
import { deleteEnergyProduct } from "../../../lib/energy-products"

type SampleProduct = {
  id: string
  title: string
  slug: string
  category_label: string
  brand: string
  vendor: string
  price_inr: number | null
  rating: number
  review_count: number
  primary_action: string
  availability: string
  use_case: string
  description: string
  specs: Record<string, string | number>
  installation_available: boolean
  warranty_years: number
  buying_modes: string[]
  image_url?: string
}

type CatalogResponse = {
  catalog: {
    products: SampleProduct[]
  }
}

const availabilityColor = {
  in_stock: "green",
  made_to_order: "orange",
  rfq_only: "blue",
} as const

const formatPrice = (price: number | null) => {
  if (price === null) {
    return "Price on quote"
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

const EnergyCatalogDetailPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const prompt = usePrompt()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["energy-catalog", "products"],
    queryFn: () => client.admin.custom.query() as Promise<CatalogResponse>,
  })

  const product = data?.catalog.products.find(
    (item) => item.id === id || item.slug === id
  )

  const { mutateAsync: removeProduct, isPending: isDeleting } = useMutation({
    mutationFn: deleteEnergyProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["energy-catalog"] })
      toast.success(t("energyCatalog.detail.deleteSuccess"))
      navigate("/energy-catalog")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleDelete = async () => {
    if (!product) {
      return
    }

    const confirmed = await prompt({
      title: t("energyCatalog.detail.deleteTitle"),
      description: t("energyCatalog.detail.deleteDescription", {
        title: product.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirmed) {
      return
    }

    await removeProduct(product.id)
  }

  if (isLoading) {
    return <Query />
  }

  if (isError || !product) {
    return (
      <SingleColumnPage>
        <NoRecords
          title={t("energyCatalog.detail.error.title")}
          message={
            error instanceof Error
              ? error.message
              : t("energyCatalog.detail.error.message")
          }
        />
      </SingleColumnPage>
    )
  }

  const availabilityKey = product.availability as keyof typeof availabilityColor

  return (
    <SingleColumnPage data={product}>
      <Container className="divide-y p-0">
        <div className="flex items-start justify-between px-6 py-4">
          <div>
            <Heading level="h1">{product.title}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {product.brand} · {product.vendor}
            </Text>
          </div>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                    disabled: isDeleting,
                  },
                ],
              },
            ]}
          />
        </div>

        {product.image_url && (
          <div className="px-6 pb-4">
            <img
              src={`http://localhost:8000${product.image_url}`}
              alt={product.title}
              className="max-h-64 rounded-lg border object-cover"
            />
          </div>
        )}

        <SectionRow
          title={t("energyCatalog.detail.category")}
          value={product.category_label}
        />
        <SectionRow
          title={t("energyCatalog.detail.price")}
          value={formatPrice(product.price_inr)}
        />
        <SectionRow
          title={t("energyCatalog.detail.rating")}
          value={`${product.rating.toFixed(1)} (${product.review_count})`}
        />
        <SectionRow
          title={t("energyCatalog.detail.availability")}
          value={
            <StatusBadge color={availabilityColor[availabilityKey] ?? "grey"}>
              {product.availability.replaceAll("_", " ")}
            </StatusBadge>
          }
        />
        <SectionRow
          title={t("energyCatalog.detail.useCase")}
          value={product.use_case}
        />
        <SectionRow
          title={t("energyCatalog.detail.primaryAction")}
          value={product.primary_action.replaceAll("_", " ")}
        />
        <SectionRow
          title={t("energyCatalog.detail.buyingModes")}
          value={product.buying_modes.join(", ")}
        />
        <SectionRow
          title={t("energyCatalog.detail.installation")}
          value={product.installation_available ? "Yes" : "No"}
        />
        <SectionRow
          title={t("energyCatalog.detail.warranty")}
          value={`${product.warranty_years} years`}
        />
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">{t("energyCatalog.detail.description")}</Heading>
          <Text className="text-ui-fg-subtle">{product.description}</Text>
        </div>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">{t("energyCatalog.detail.specs")}</Heading>
        </div>
        {Object.entries(product.specs).map(([key, value]) => (
          <SectionRow
            key={key}
            title={key.replaceAll("_", " ")}
            value={String(value)}
          />
        ))}
      </Container>
    </SingleColumnPage>
  )
}

export default EnergyCatalogDetailPage