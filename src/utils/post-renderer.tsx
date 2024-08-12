import RichText from "../components/shared/RichText";
import ImageSlider from "../components/ui/ImageSlider";
import Quote from "../components/shared/Quote";
import Media from "../components/ui/Media";
import VideoEmbed from "../components/shared/VideoEmbed";

export function postRenderer(section: any, index: number) {
  switch (section.__component) {
    case "shared.rich-text":
      return <RichText key={index} data={section} />;
    case "shared.slider":
      return <ImageSlider key={index} data={section} />;
    case "shared.quote":
      return <Quote key={index} data={section} />;
    case "shared.media":
      return <Media key={index} data={section} />;
    case "shared.video-embed":
      return <VideoEmbed key={index} data={section} />;
    default:
      return null;
  }
}
