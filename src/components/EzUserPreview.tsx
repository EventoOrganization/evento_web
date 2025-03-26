import SmartImage from "@/components/SmartImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";

type UserPreviewProps = {
  user: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  label?: string; // ex: "Host", "Sender", etc
  extra?: React.ReactNode; // pour afficher une date, un bouton, etc.
  className?: string;
  avatarSize?: number; // ex: 24 / 32 / 40...
  forceImg?: boolean; // si tu veux utiliser <img> même pour les images
};

export default function EzUserPreview({
  user,
  label,
  extra,
  avatarSize = 6,
  className,
  forceImg = false,
}: UserPreviewProps) {
  if (!user) return null;

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {forceImg ? (
        <SmartImage
          src={user.profileImage || "/evento-logo.png"}
          alt={user.username}
          width={avatarSize}
          height={avatarSize}
          className={`rounded-full w-${avatarSize} h-${avatarSize}`}
          forceImg
        />
      ) : (
        <Avatar className={`w-${avatarSize} h-${avatarSize}`}>
          <AvatarImage src={user.profileImage || ""} />
          <AvatarFallback>
            {user.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col">
        <span className="font-semibold leading-none">{user.username}</span>
        {label && (
          <span className="text-xs text-muted-foreground -mt-0.5">{label}</span>
        )}
      </div>

      {extra && <div className="ml-auto">{extra}</div>}
    </div>
  );
}
