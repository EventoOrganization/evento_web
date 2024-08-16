// import Quote from "../components/shared/Quote";
// import RichText from "../components/shared/RichText";
// import VideoEmbed from "../components/shared/VideoEmbed";
// import ImageSlider from "../components/ui/ImageSlider";
// import Media from "../components/ui/Media";

export function postRenderer(section: any) {
  switch (section.__component) {
    case "shared.rich-text":
    //   return <RichText key={index} data={section} />;
    // case "shared.slider":
    //   return <ImageSlider key={index} data={section} />;
    // case "shared.quote":
    //   return <Quote key={index} data={section} />;
    // case "shared.media":
    //   return <Media key={index} data={section} />;
    // case "shared.video-embed":
    //   return <VideoEmbed key={index} data={section} />;
    default:
      return null;
  }
}
