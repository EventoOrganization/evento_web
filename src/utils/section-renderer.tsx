import Hero from "../components/ui/Hero";
import Features from "../components/shared/Features";
import Testimonials from "../components/shared/Testimonials";
import Pricing from "../components/shared/Pricing";
import Email from "../components/forms/Email";
import FeaturesCg from "../components/shared/FeatureColumnsGroup";
import RichText from "../components/shared/RichText";

export function sectionRenderer(section: any, index: number) {
  switch (section.__component) {
    case "sections.hero":
      return <Hero key={index} data={section} />;
    case "sections.features":
      return <Features key={index} data={section} />;
    case "sections.testimonials-group":
      return <Testimonials key={index} data={section} />;
    case "sections.pricing":
      return <Pricing key={index} data={section} />;
    case "sections.lead-form":
      return <Email key={index} data={section} />;
    case "sections.feature-columns-group":
      return <FeaturesCg key={index} data={section} />;
    case "sections.rich-text":
      return <RichText key={index} data={section} />;
    //   case "sections.feature-rows-group":
    //     return <Features key={index} data={section} />;
    default:
      return null;
  }
}
