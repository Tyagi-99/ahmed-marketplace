import { ShoppingBag } from "@medusajs/icons"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"
import {
  NoRecords,
  Query,
  SingleColumnPage,
  _DataTable,
  useDataTable,
} from "@mercurjs/dashboard-shared"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link, Outlet } from "react-router-dom"
import { client } from "../../lib/client"

type SampleProduct = {
  id: string
  title: string
  category_label: string
  brand: string
  vendor: string
  price_inr: number | null
  rating: number
  primary_action: string
  availability: string
}

type CatalogResponse = {
  catalog: {
    products: SampleProduct[]
    product_count: number
  }
}

export const config: RouteConfig = {
  label: "Energy Catalog",
  icon: ShoppingBag,
  translationNs: "energyCatalog",
  rank: 6,
}

const columnHelper = createColumnHelper<SampleProduct>()

const formatPrice = (price: number | null) => {
  if (price === null) {
    return "Quote only"
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

const EnergyCatalogPage = () => {
  const { t } = useTranslation()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["energy-catalog", "products"],
    queryFn: () => client.admin.custom.query() as Promise<CatalogResponse>,
  })

  const products = data?.catalog.products ?? []

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("energyCatalog.columns.product"),
      }),
      columnHelper.accessor("category_label", {
        header: t("energyCatalog.columns.category"),
      }),
      columnHelper.accessor("brand", {
        header: t("energyCatalog.columns.brand"),
      }),
      columnHelper.accessor("vendor", {
        header: t("energyCatalog.columns.vendor"),
      }),
      columnHelper.accessor("price_inr", {
        header: t("energyCatalog.columns.price"),
        cell: ({ getValue }) => formatPrice(getValue()),
      }),
      columnHelper.accessor("rating", {
        header: t("energyCatalog.columns.rating"),
        cell: ({ getValue }) => getValue().toFixed(1),
      }),
      columnHelper.accessor("primary_action", {
        header: t("energyCatalog.columns.action"),
        cell: ({ getValue }) => getValue().replaceAll("_", " "),
      }),
    ],
    [t]
  )

  const { table } = useDataTable({
    data: products,
    columns,
    count: products.length,
    pageSize: 10,
    getRowId: (row) => row.id,
  })

  if (isLoading) {
    return <Query />
  }

  if (isError || !data) {
    return (
      <SingleColumnPage>
        <NoRecords
          title={t("energyCatalog.error.title")}
          message={
            error instanceof Error
              ? error.message
              : t("energyCatalog.error.message")
          }
        />
      </SingleColumnPage>
    )
  }

  return (
    <SingleColumnPage data={data}>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">{t("energyCatalog.title")}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {t("energyCatalog.description", { count: products.length })}
            </Text>
          </div>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("energyCatalog.actions.create")}</Link>
          </Button>
        </div>

        <_DataTable
          table={table}
          columns={columns}
          count={products.length}
          pageSize={10}
          navigateTo={(row) => `/energy-catalog/${row.original.id}`}
          noRecords={{
            title: t("energyCatalog.empty.title"),
            message: t("energyCatalog.empty.message"),
          }}
        />
      </Container>
      <Outlet />
    </SingleColumnPage>
  )
}

export default EnergyCatalogPage