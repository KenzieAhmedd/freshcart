import HeroSlider from "@/components/home/HeroSlider";
import Newsletter from "@/components/home/Newsletter";
import { AppPromo, BrandsStrip, CategoryGrid, FeaturedProducts, FeaturesStrip, PromoBanners } from "@/components/home/Sections";
import { categoriesService } from "@/services/categories.service";
import { brandsService } from "@/services/brands.service";
import { productsService } from "@/services/products.service";
import { ErrorState } from "@/components/ui/EmptyState";

export default async function HomePage() {
  const [cats, brands, products] = await Promise.allSettled([
    categoriesService.list(),
    brandsService.list(),
    productsService.list({ limit: 10, sort: "-ratingsQuantity" }),
  ]);

  const allFailed = cats.status === "rejected" && brands.status === "rejected" && products.status === "rejected";

  return (
    <>
      <HeroSlider />
      <FeaturesStrip />
      {allFailed ? (
        <div className="container-fc mt-14"><ErrorState message="We couldn't reach the store right now. Please refresh in a moment." /></div>
      ) : (
        <>
          <CategoryGrid categories={cats.status === "fulfilled" ? cats.value : []} />
          <PromoBanners />
          <FeaturedProducts products={products.status === "fulfilled" ? products.value.data : []} />
          <BrandsStrip brands={brands.status === "fulfilled" ? brands.value : []} />
        </>
      )}
      <Newsletter />
      <AppPromo />
    </>
  );
}
