// import FeaturesCg from "../components/shared/FeatureColumnsGroup";
// import Features from "../components/shared/Features";
// import Pricing from "../components/shared/Pricing";
// import RichText from "../components/shared/RichText";
// import Testimonials from "../components/shared/Testimonials";
// import Hero from "../components/ui/Hero";

export function sectionRenderer(section: any) {
  switch (section.__component) {
    case "sections.hero":
    //   return <Hero key={index} data={section} />;
    // case "sections.features":
    //   return <Features key={index} data={section} />;
    // case "sections.testimonials-group":
    //   return <Testimonials key={index} data={section} />;
    // case "sections.pricing":
    //   return <Pricing key={index} data={section} />;
    // case "sections.lead-form":
    //   return <Email key={index} data={section} />;
    // case "sections.feature-columns-group":
    //   return <FeaturesCg key={index} data={section} />;
    // case "sections.rich-text":
    //   return <RichText key={index} data={section} />;
    //   case "sections.feature-rows-group":
    //     return <Features key={index} data={section} />;
    default:
      return null;
  }
}
