import SmartImage from "@/components/SmartImage";

const EventInvitation = ({ event, user, eventLink }: any) => {
  return (
    <div
      style={{
        color: "#333",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        lineHeight: 1.4,
        backgroundColor: "red",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "20px",
      }}
    >
      <div className="flex flex-col items-center md:flex-row gap-4">
        <span className="bg-evento-gradient rounded-full h-40 w-40 flex justify-center items-center">
          <SmartImage
            src={
              "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/logo.png"
            }
            alt="Logo"
            className="translate-y-2 translate-x-1"
          />
        </span>
        <div className="text-center md:text-left">
          <h3>Hi {user?.username || "Guest"} </h3>
          <p>
            You are invited to join the event:
            <strong>by {event?.user?.username}</strong>.
          </p>
          <p>Click the event below to join: {event.title}</p>
        </div>
      </div>
      <a href={eventLink} target="_blank" style={{ textDecoration: "none" }}>
        <div className="p-4 bg-white border rounded m-4 max-w-96">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <SmartImage
                src={user.profileImage}
                alt="User Image"
                className="w-10 h-10 rounded-full"
              />
              <h4>{user.username}</h4>
            </div>
            {event?.details.date}
          </div>
          <SmartImage
            src={event?.initialMedia[0]?.url}
            alt="Event Image"
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
            }}
          />
          <h4 className="my-4">{event.title}</h4>
          <p>{event.details.description}</p>
        </div>
      </a>
    </div>
  );
};

export default EventInvitation;
