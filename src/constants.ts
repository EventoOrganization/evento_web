export const baseURL = "http://65.2.68.95:8747/";

export const imageURL = "http://65.2.68.95:8747/images/";
export const eventImgURL = "http://65.2.68.95:8747/images/events/";
export const profileImageURL = "http://65.2.68.95:8747/images/profile/";
export const videoURl = "http://65.2.68.95:8747/images/videos/";

export const securityKey =
  "U2FsdGVkX19aDKvxj/Nr/Cp6cb70gK7mBnJzVQ0WYNand9iM1LlcvIRe8qzC44RdN4VPefFG5o2/Q031Mxwv7A==";
export const publishKey =
  "U2FsdGVkX1/vYsCHDLw74pt+ZfQPJuOWK2w+l9AMgUfMNVXCXpvz7TDpx6xKd0T1PG8WRFgYy5aaawoo2IDO/g==";

//export const imagePickerSources = ImagePickerClass()

//MARK: API - ENUM
export const API = {
  socialLogin: "users/socialLogin",
  signUp: "users/signup",
  getInterestListing: "users/getInterestsListing",
  login: "users/login",
  verifyotp: "users/otpVerify",
  forgotPass: "users/forgotPasswordOTP",
  resendOtp: "users/resendOtp",
  logout: "users/logout",
  delete: "users/deleteAccount",
  changePass: "users/changePassword",
  cms: "users/getcms",
  contactUs: "users/contactUs",
  FAQ: "users/getFAQ",
  getProfile: "users/getProfile",
  editProfile: "users/updateProfile",
  getFollowingDetail: "users/followStatusForAllUsersWithUserId",
  getUnFollowList: "users/followStatusForAllUsersWithUserIdSartaj",
  getuserProfile: "users/getProfileUser",
  follow: "users/follow",
  allAndVirtualEventAndNear: "users/allAndVirtualEventAndNear",
  attendEventConfirm: "users/attendEventConfm",
  eventFavourite: "users/eventFavourite",
  eventDelete: "users/deleteEvent",
  eventDetails: "users/event",
  createEventAndRSVPform: "users/createEventAndRSVPform",
  upcomingEvents: "users/upcomingEvents",
  removeGuest: "users/removeGuestFromEvent",
  rsvpAnswersLog: "users/allRSVPanswerLog",
  rsvpUserAnswers: "users/answerByUser",
  notification: "users/notificationList",
  rsvpFormSubmission: "users/RSVPFormSubmission",
  followStatusForAllUsersThatNotAddAsCoHost:
    "users/followStatusForAllUsersThatNotAddAsCoHost",
  addCoHostAndGuestInExistingEvent: "users/addCoHostAndGuestInExistingEvent",
  getuploadImgVdolisting: "users/getUploadedPhotoVideo",
  uploadPhotoVideo: "users/uploadPhotoVideo",
  allowAllGuestUploadPhotoVideo: "users/allowAllGuestUploadPhotoVideo",
  updateEvent: "users/updateEvent",
  clearNotification: "users/clearNotification",
};

export const dateFormat = {
  fullDate: "MM_dd_yy_HH:mm:ss.SS",
  MonthDayYear: "MMM d, yyyy",
  MonthDay: "MMM dd EEE",
  DateAndTime: "dd/M/yyyy hh:mm a",
  TimeWithAMorPMandMonthDay: "hh:mm a MMM dd EEE",
  TimeWithAMorPMandDate: "hh:mm a MMM d, yyyy",
  dateTimeFormat: "yyyy-MM-dd'T'HH:mm:ssZ",
  yearMonthFormat: "yyyy-MM-dd",
  slashDate: "dd/MM/yyyy",
  timeAmPm: "hh:mm a",
};

// SocketConstant
export enum SocketKeys {
  // MARK: Live
  SocketBaseUrl = "http://65.2.68.95:8747",
  // SocketBaseUrl = "http://192.168.1.210:8747/",
  UserId = "userId",
  SenderId = "senderId",
  ReceiverId = "reciverId",
  Message = "message",
  MessageType = "message_type",
}

export enum SocketEmitters {
  ConnectUser = "connect_user",
  SendMessageEmitter = "send_message",
  ChatListing = "user_constant_list",
  SingleUserAllMsgEmi = "users_chat_list",
  ReadMsgEmitter = "read_unread",
  ReportEmitter = "report_message",
  ReadNotificationEmitter = "read_notification",
  UnreadNotificationCountEmitter = "unread_notification_count",
}

export enum SocketListeners {
  ConnectUserListener = "connect_user_listener",
  SendMessageListener = "send_message_emit",
  ChatListingListener = "user_constant_chat_list",
  SingleUserAllMsgLis = "users_chat_list_listener",
  ReadMsgListener = "read_data_status",
  ReportListener = "report_message_listener",
  ReadNotificationListener = "read_notification",
  UnreadNotificationCountListener = "unread_notification_count",
}
