import { Carousel } from "@/components/cells"
import { ProductCard } from "../ProductCard/ProductCard"
import { Product } from "@/types/product"

export const HomeProductsCarousel = async ({
  locale,
  sellerProducts,
  home,
}: {
  locale: string
  sellerProducts: Product[]
  home: boolean
}) => {
  let products: any[] = []
  
  try {
    const res = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/products?country_code=in&limit=12&region_id=reg_01KW17GX8032DQPFZJ0JJDFJ2C&fields=*variants.calculated_price,*variants`,
      {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        cache: "no-store",
      }
    )
    const data = await res.json()
    products = data?.products || []
  } catch (e) {
    console.error("Product fetch error:", e)
  }

  if (!products.length && !sellerProducts.length) return null
  
  return (
    <div className="flex justify-center w-full">
      <Carousel
        align="start"
        items={(sellerProducts.length ? sellerProducts : products).map(
          (product: any) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )
        )}
      />
    </div>
  )
}
