// src\components\UsersList.tsx
"use client";
import AuthModal from "@/components/system/auth/AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import ApproveGoingUser from "@/features/event/update/ApproveGoingUser";
import { useToast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/useEventsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SmartImage from "./SmartImage";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
const UsersList = ({
  isAdmin = false,
  user,
  fetchUsers,
  removeUserLocally,
  event,
  title,
  isSelectEnable = false,
  setSelectedIds,
  selectedIds,
  setEvent,
}: {
  user?: any;
  fetchUsers?: () => void;
  removeUserLocally?: (userId: string) => void;
  event?: EventType;
  title?: string;
  isAdmin?: boolean;
  isSelectEnable?: boolean;
  selectedIds?: string[];
  setSelectedIds?: (ids: string[]) => void;
  setEvent?: (event: EventType) => void;
}) => {
  const [showMobileReason, setShowMobileReason] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Détecte si on est sur un mobile/tactile
  useEffect(() => {
    setIsTouchDevice(typeof window !== "undefined" && window.innerWidth <= 768);
  }, []);
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { token } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isIFollowingHim, setIsIFollowingHim] = useState<boolean | null>(
    user?.isIFollowingHim,
  );
  const [isTempGuest, setIsTempGuest] = useState<boolean>(false);
  const [isLoggedUser, setIsLoggedUser] = useState<boolean>(false);
  const isFollowingMe = user?.isFollowingMe;
  const session = useSession();
  const { updateUser } = useUsersStore();
  const { updateEvent } = useEventStore();
  useEffect(() => {
    if (session?.user && user) {
      if (session.user._id === user._id) {
        setIsLoggedUser(true);
      }
    }
    if (isIFollowingHim === undefined) {
      setIsTempGuest(true);
    }
  }, [session, user, isIFollowingHim, isFollowingMe]);

  const handleAcceptRequest = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const body = { userId: user._id };
      const response = await fetchData(
        `/events/${eventId}/acceptRequest`,
        HttpMethod.POST,
        body,
        token,
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "User has been added as a guest.",
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
        setEvent?.({
          ...event!,
          requested: event?.requested?.filter((r) => r._id !== user._id),
          guests: event?.guests ? [...event.guests, user] : [user],
        });

        fetchUsers?.();
      } else {
        console.error("Error:", response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ followingId: user?._id }),
        },
      );

      if (response.ok) {
        setIsIFollowingHim((prevIsFollowing) => !prevIsFollowing);
        const updatedStatus = !isIFollowingHim;
        updateUser({ _id: user._id, isIFollowingHim: updatedStatus });
        toast({
          title: "Success",
          description: `You are now ${!isIFollowingHim ? "following" : "unfollowing"} this user`,
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
        if (fetchUsers) fetchUsers();
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnGuest = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);
    const body = {
      userId: user?._id,
      eventId: eventId,
    };
    try {
      const response = await fetchData(
        `/events/unGuestUser`,
        HttpMethod.POST,
        body,
        token,
      );

      if (response.ok) {
        updateEvent(eventId, {
          guests: event?.guests?.filter((guest) => guest._id !== user._id),
        });
        updateUser({
          _id: user._id,
          isIFollowingHim: !isIFollowingHim,
        });
        removeUserLocally?.(user._id);
        toast({
          title: "Success",
          description: `User is no longer a guest.`,
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
      } else {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUngoing = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);

    try {
      const body = {
        eventId: eventId,
        userId: user._id,
      };
      const response = await fetchData(
        "/events/removeUserFromGoing",
        HttpMethod.POST,
        body,
        token,
      );

      if (response.ok) {
        if (setEvent) {
          setEvent({
            ...event!,
            attendees:
              event?.attendees?.filter(
                (attendee) => attendee._id !== user._id,
              ) || [],
            approvedUserIds:
              event?.approvedUserIds?.filter(
                (id) => id.toString() !== user._id,
              ) || [],
          });
        } else {
          console.warn(
            "❌ setEvent is undefined, cannot update event locally.",
          );
        }

        updateEvent(eventId, {
          ...event!,
          attendees:
            event?.attendees?.filter((attendee) => attendee._id !== user._id) ||
            [],
          approvedUserIds:
            event?.approvedUserIds?.filter(
              (id) => id.toString() !== user._id,
            ) || [],
        });
        toast({
          title: "Success",
          description: "User removed from Going list",
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
      } else {
        console.error("Error:", response.error);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.username === "anonymous") return;
  const isSuccessPage = pathname.includes(`/create-event/${eventId}/success`);
  return (
    <div className="flex justify-between w-full items-center">
      {isSelectEnable ? (
        <div className="flex items-center gap-2 ">
          <Checkbox
            id={user._id}
            checked={user?._id ? selectedIds?.includes(user._id) : false}
            onCheckedChange={(checked) => {
              if (setSelectedIds) {
                setSelectedIds(
                  checked
                    ? [...(selectedIds ?? []), user._id]
                    : (selectedIds ?? []).filter((id) => id !== user._id),
                );
              }
            }}
          />
          <Label
            htmlFor={user._id}
            className="flex items-center gap-4 cursor-pointer"
          >
            {user?.profileImage &&
            user?.profileImage.startsWith("http") &&
            user?.profileImage ? (
              <SmartImage
                src={user.profileImage}
                alt="user image"
                width={40}
                height={40}
                className="min-w-10 w-10 h-10 rounded-full"
                forceImg
              />
            ) : (
              <div className="flex flex-col min-w-10 w-10 h-10">
                <Avatar className="min-w-10 w-10 h-10 ">
                  <AvatarImage
                    src="/evento-logo.png"
                    className="rounded-full"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            )}
            <ul>
              <li className="font-bold">
                {user?.username.charAt(0).toUpperCase() +
                  user?.username.slice(1)}
              </li>
              <li className="text-sm">
                {user?.firstName} {user?.lastName}
              </li>
            </ul>
          </Label>
        </div>
      ) : (
        <Link
          href={`/profile/${user?._id}`}
          className="flex items-center gap-4"
        >
          {user?.profileImage &&
          user?.profileImage.startsWith("http") &&
          user?.profileImage ? (
            <SmartImage
              src={user.profileImage}
              alt="user image"
              width={40}
              height={40}
              className="min-w-10 w-10 h-10 rounded-full"
              forceImg
            />
          ) : (
            <div className="flex flex-col min-w-10 w-10 h-10">
              <Avatar className="min-w-10 w-10 h-10 ">
                <AvatarImage src="/evento-logo.png" className="rounded-full" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          )}
          <ul>
            <li className="font-bold">
              {user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}
            </li>
            <li className="text-sm">
              {user?.firstName} {user?.lastName}
            </li>
          </ul>
        </Link>
      )}
      <div className="flex gap-2 overflow-hidden">
        {user.reason && isAdmin ? (
          <>
            {/* Tooltip sur desktop */}
            {!isTouchDevice ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-destructive font-semibold truncate w-full ml-2 cursor-pointer block overflow-hidden whitespace-nowrap">
                    {user.reason}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white px-3 py-1 rounded-md text-sm shadow-lg max-w-[250px]">
                  {user.reason}
                </TooltipContent>
              </Tooltip>
            ) : (
              // Modal sur mobile
              <>
                <span
                  className="text-destructive font-semibold truncate w-full ml-2 cursor-pointer block overflow-hidden whitespace-nowrap"
                  onClick={() => setShowMobileReason(true)}
                >
                  {user.reason}
                </span>

                <Dialog
                  open={showMobileReason}
                  onOpenChange={setShowMobileReason}
                >
                  <DialogContent className="max-w-[95%] rounded">
                    <DialogHeader>
                      <DialogTitle>Reason</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm">{user.reason}</p>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </>
        ) : (
          !isLoggedUser &&
          !isTempGuest &&
          !isSuccessPage && (
            <Button
              variant={"ghost"}
              className={`px-5 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 duration-300 hover:text-white
              ${isIFollowingHim && !isFollowingMe ? "bg-gray-400 hover:bg-gray-500 " : ""}
              ${isFollowingMe && !isIFollowingHim ? "bg-eventoBlue hover:bg-eventoBlue/80 " : ""}
              ${isFollowingMe && isIFollowingHim ? " bg-evento-gradient " : ""}
              ${!isFollowingMe && !isIFollowingHim ? "bg-eventoPurpleDark hover:bg-eventoPurpleDark/80 " : ""}`}
              onClick={handleFollow}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isFollowingMe && !isIFollowingHim
                  ? "Follow Back"
                  : isFollowingMe && isIFollowingHim
                    ? "Friends"
                    : !isFollowingMe && isIFollowingHim
                      ? "Unfollow"
                      : "Follow"}
            </Button>
          )
        )}
        {isAdmin && title === "Going Pending Approval" && (
          <ApproveGoingUser
            event={event as EventType}
            userId={user._id}
            setEvent={setEvent}
          />
        )}
        {isAdmin && title === "Invited" && (
          <Button variant="outline" onClick={handleUnGuest} disabled={loading}>
            {loading ? "Processing..." : <XIcon />}
          </Button>
        )}
        {isAdmin &&
          (title === "Going" || title === "Going Pending Approval") && (
            <Button
              variant="outline"
              onClick={handleUngoing}
              disabled={loading}
            >
              {loading ? "Processing..." : <XIcon />}
            </Button>
          )}

        {title === "Requested to Join" && isAdmin && (
          <Button onClick={handleAcceptRequest} disabled={loading}>
            {loading ? "Processing..." : "Accept"}
          </Button>
        )}
      </div>
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => {
            setIsAuthModalOpen(false);
            fetchUsers?.();
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
