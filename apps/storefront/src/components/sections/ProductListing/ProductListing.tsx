import {
  ProductListingActiveFilters,
  ProductListingHeader,
  ProductSidebar,
  ProductsList,
  ProductsPagination,
} from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"

export const ProductListing = async ({
  category_id,
  collection_id,
  seller_id,
  showSidebar = false,
  locale = "in",
}: {
  category_id?: string
  collection_id?: string
  seller_id?: string
  showSidebar?: boolean
  locale?: string
}) => {
  let products: any[] = []
  let count = 0

  try {
    const res = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/products?country_code=in&limit=${PRODUCT_LIMIT}&region_id=reg_01KW17GX8032DQPFZJ0JJDFJ2C&fields=*variants.calculated_price,*variants`,
      {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        cache: "no-store",
      }
    )
    const data = await res.json()
    products = data?.products || []
    count = data?.count || 0
  } catch (e) {
    console.error("ProductListing fetch error:", e)
  }

  const pages = Math.ceil(count / PRODUCT_LIMIT) || 1

  return (
    <div className="py-4" data-testid="product-listing-container">
      <ProductListingHeader total={count} />
      <div className="hidden md:block">
        <ProductListingActiveFilters />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-4">
        {showSidebar && <ProductSidebar />}
        <section className={showSidebar ? "col-span-3" : "col-span-4"} data-testid="product-listing-section">
          <div className="flex flex-wrap gap-4" data-testid="product-list">
            <ProductsList products={products} />
          </div>
          <ProductsPagination pages={pages} />
        </section>
      </div>
    </div>
  )
}
