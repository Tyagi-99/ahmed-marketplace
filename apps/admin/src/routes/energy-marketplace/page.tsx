import { Bolt } from "@medusajs/icons"
import { Container, Heading, Table, Text } from "@medusajs/ui"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"
import {
  NoRecords,
  Query,
  SectionRow,
  SingleColumnPage,
} from "@mercurjs/dashboard-shared"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { client } from "../../lib/client"

type EnergyCategory = {
  handle: string
  name: string
  buying_modes: string[]
  required_specs: string[]
}

type MarketplaceOverview = {
  marketplace: {
    name: string
    model: string
    launch_region: {
      country_code: string
      currency_code: string
      region_name: string
      launch_market: string
      operating_city: string
      payment_provider: string
    }
    fulfillment_owner: string
    payment_provider: string
  }
  vendor_onboarding: {
    mode: string
    required_documents: string[]
  }
  operations: {
    rfq_lifecycle: string[]
    service_lifecycle: string[]
    fulfillment_statuses: string[]
    admin_controls: string[]
  }
  catalog: {
    categories: EnergyCategory[]
    filters: string[]
  }
}

export const config: RouteConfig = {
  label: "Energy Marketplace",
  icon: Bolt,
  translationNs: "energyMarketplace",
  rank: 5,
}

const formatList = (items: string[]) => items.join(", ")

const EnergyMarketplacePage = () => {
  const { t } = useTranslation()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["energy-marketplace", "overview"],
    queryFn: () => client.admin.custom.query() as Promise<MarketplaceOverview>,
  })

  if (isLoading) {
    return <Query />
  }

  if (isError || !data) {
    return (
      <SingleColumnPage>
        <NoRecords
          title={t("energyMarketplace.error.title")}
          message={
            error instanceof Error
              ? error.message
              : t("energyMarketplace.error.message")
          }
        />
      </SingleColumnPage>
    )
  }

  const { marketplace, vendor_onboarding, operations, catalog } = data
  const region = marketplace.launch_region

  return (
    <SingleColumnPage data={data}>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">{marketplace.name}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {t("energyMarketplace.subtitle")}
            </Text>
          </div>
        </div>

        <SectionRow
          title={t("energyMarketplace.overview.model")}
          value={marketplace.model}
        />
        <SectionRow
          title={t("energyMarketplace.overview.fulfillment")}
          value={marketplace.fulfillment_owner}
        />
        <SectionRow
          title={t("energyMarketplace.overview.payment")}
          value={marketplace.payment_provider}
        />
        <SectionRow
          title={t("energyMarketplace.overview.region")}
          value={`${region.operating_city}, ${region.launch_market}, ${region.region_name}`}
        />
        <SectionRow
          title={t("energyMarketplace.overview.currency")}
          value={region.currency_code.toUpperCase()}
        />
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">{t("energyMarketplace.catalog.title")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("energyMarketplace.catalog.description")}
          </Text>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t("energyMarketplace.catalog.columns.category")}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t("energyMarketplace.catalog.columns.buyingModes")}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t("energyMarketplace.catalog.columns.specs")}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {catalog.categories.map((category) => (
              <Table.Row key={category.handle}>
                <Table.Cell>{category.name}</Table.Cell>
                <Table.Cell>{formatList(category.buying_modes)}</Table.Cell>
                <Table.Cell>{category.required_specs.length}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <SectionRow
          title={t("energyMarketplace.catalog.filters")}
          value={formatList(catalog.filters)}
        />
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">{t("energyMarketplace.operations.title")}</Heading>
        </div>

        <SectionRow
          title={t("energyMarketplace.operations.rfqLifecycle")}
          value={formatList(operations.rfq_lifecycle)}
        />
        <SectionRow
          title={t("energyMarketplace.operations.serviceLifecycle")}
          value={formatList(operations.service_lifecycle)}
        />
        <SectionRow
          title={t("energyMarketplace.operations.fulfillmentStatuses")}
          value={formatList(operations.fulfillment_statuses)}
        />
        <SectionRow
          title={t("energyMarketplace.operations.adminControls")}
          value={formatList(operations.admin_controls)}
        />
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">
            {t("energyMarketplace.vendorOnboarding.title")}
          </Heading>
        </div>

        <SectionRow
          title={t("energyMarketplace.vendorOnboarding.mode")}
          value={vendor_onboarding.mode}
        />
        <SectionRow
          title={t("energyMarketplace.vendorOnboarding.documents")}
          value={formatList(vendor_onboarding.required_documents)}
        />
      </Container>
    </SingleColumnPage>
  )
}

export default EnergyMarketplacePage