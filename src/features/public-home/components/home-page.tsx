import { CapabilitySection } from "@/features/public-home/components/capability-section";
import { CareersTeaserSection } from "@/features/public-home/components/careers-teaser-section";
import { CustomersLogoStrip } from "@/features/public-home/components/customers-logo-strip";
import { FaqSection } from "@/features/public-home/components/faq-section";
import { HeroCarousel } from "@/features/public-home/components/hero-carousel";
import { InquireCtaBanner } from "@/features/public-home/components/inquire-cta-banner";
import { JointVenturesSection } from "@/features/public-home/components/joint-ventures-section";
import { MissionVideoSection } from "@/features/public-home/components/mission-video-section";
import { ProductsSection } from "@/features/public-home/components/products-section";
import { TestimonialsCarousel } from "@/features/public-home/components/testimonials-carousel";
import { homeContentEn } from "@/features/public-home/content/home.en";

type HomePageProps = {
  locale: string;
};

export function HomePage({ locale }: HomePageProps) {
  const content = homeContentEn;

  return (
    <>
      <HeroCarousel locale={locale} content={content.hero} />
      <CapabilitySection content={content.capability} />
      <ProductsSection locale={locale} content={content.products} />
      <MissionVideoSection
        content={content.mission}
        videoSrc={content.hero.videoSrc}
        videoPoster={content.hero.videoPoster}
      />
      <InquireCtaBanner locale={locale} content={content.ctaBanner} />
      <TestimonialsCarousel content={content.testimonials} />
      <CustomersLogoStrip content={content.customers} />
      <JointVenturesSection content={content.jointVentures} />
      <CareersTeaserSection locale={locale} content={content.careers} />
      <FaqSection content={content.faq} />
    </>
  );
}
