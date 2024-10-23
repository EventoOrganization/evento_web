export type PwaSubscriptionType = {
  browser: "chrome" | "firefox" | "safari";
  endpoint: string;
  subscription: PushSubscription;
};
