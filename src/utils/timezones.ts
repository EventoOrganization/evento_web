export const timeZonesMap = [
  {
    offset: "-12:00",
    label: "(UTC−12:00) Baker Island (USA)",
    iana: "Etc/GMT+12",
  },
  {
    offset: "-11:00",
    label: "(UTC−11:00) Niue, Samoa (Pacific)",
    iana: "Pacific/Niue",
  },
  {
    offset: "-10:00",
    label: "(UTC−10:00) Hawaii (USA)",
    iana: "Pacific/Honolulu",
  },
  {
    offset: "-09:30",
    label: "(UTC−09:30) Marquesas Islands (French Polynesia)",
    iana: "Pacific/Marquesas",
  },
  {
    offset: "-09:00",
    label: "(UTC−09:00) Alaska (USA)",
    iana: "America/Anchorage",
  },
  {
    offset: "-08:00",
    label: "(UTC−08:00) Los Angeles (Pacific Time, USA)",
    iana: "America/Los_Angeles",
  },
  {
    offset: "-07:00",
    label: "(UTC−07:00) Denver (Mountain Time, USA)",
    iana: "America/Denver",
  },
  {
    offset: "-06:00",
    label: "(UTC−06:00) Chicago (Central Time, USA)",
    iana: "America/Chicago",
  },
  {
    offset: "-05:00",
    label: "(UTC−05:00) New York (Eastern Time, USA)",
    iana: "America/New_York",
  },
  {
    offset: "-04:00",
    label: "(UTC−04:00) Santiago (Chile)",
    iana: "America/Santiago",
  },
  {
    offset: "-03:30",
    label: "(UTC−03:30) St. John's (Canada)",
    iana: "America/St_Johns",
  },
  {
    offset: "-03:00",
    label: "(UTC−03:00) Buenos Aires (Argentina)",
    iana: "America/Argentina/Buenos_Aires",
  },
  {
    offset: "-02:00",
    label: "(UTC−02:00) South Georgia / Sandwich Islands",
    iana: "Atlantic/South_Georgia",
  },
  {
    offset: "-01:00",
    label: "(UTC−01:00) Azores (Portugal)",
    iana: "Atlantic/Azores",
  },
  {
    offset: "+00:00",
    label: "(UTC±00:00) London (Greenwich Mean Time)",
    iana: "Europe/London",
  },
  {
    offset: "+01:00",
    label: "(UTC+01:00) Paris (Central European Time)",
    iana: "Europe/Paris",
  },
  {
    offset: "+02:00",
    label: "(UTC+02:00) Athens (Eastern European Time)",
    iana: "Europe/Athens",
  },
  {
    offset: "+03:00",
    label: "(UTC+03:00) Moscow (Russia)",
    iana: "Europe/Moscow",
  },
  { offset: "+03:30", label: "(UTC+03:30) Tehran (Iran)", iana: "Asia/Tehran" },
  {
    offset: "+04:00",
    label: "(UTC+04:00) Dubai (United Arab Emirates)",
    iana: "Asia/Dubai",
  },
  {
    offset: "+04:30",
    label: "(UTC+04:30) Kabul (Afghanistan)",
    iana: "Asia/Kabul",
  },
  {
    offset: "+05:00",
    label: "(UTC+05:00) Karachi (Pakistan)",
    iana: "Asia/Karachi",
  },
  {
    offset: "+05:30",
    label: "(UTC+05:30) New Delhi (India)",
    iana: "Asia/Kolkata",
  },
  {
    offset: "+05:45",
    label: "(UTC+05:45) Kathmandu (Nepal)",
    iana: "Asia/Kathmandu",
  },
  {
    offset: "+06:00",
    label: "(UTC+06:00) Dhaka (Bangladesh)",
    iana: "Asia/Dhaka",
  },
  {
    offset: "+06:30",
    label: "(UTC+06:30) Yangon (Myanmar)",
    iana: "Asia/Yangon",
  },
  {
    offset: "+07:00",
    label: "(UTC+07:00) Bangkok / HCMC (Thailand / Vietnam)",
    iana: "Asia/Bangkok",
  },
  {
    offset: "+08:00",
    label: "(UTC+08:00) Beijing (China)",
    iana: "Asia/Shanghai",
  },
  {
    offset: "+08:45",
    label: "(UTC+08:45) Eucla (Australia)",
    iana: "Australia/Eucla",
  },
  { offset: "+09:00", label: "(UTC+09:00) Tokyo (Japan)", iana: "Asia/Tokyo" },
  {
    offset: "+09:30",
    label: "(UTC+09:30) Adelaide (Australia)",
    iana: "Australia/Adelaide",
  },
  {
    offset: "+10:00",
    label: "(UTC+10:00) Sydney (Australia)",
    iana: "Australia/Sydney",
  },
  {
    offset: "+10:30",
    label: "(UTC+10:30) Lord Howe Island (Australia)",
    iana: "Australia/Lord_Howe",
  },
  {
    offset: "+11:00",
    label: "(UTC+11:00) Nouméa (New Caledonia)",
    iana: "Pacific/Noumea",
  },
  {
    offset: "+12:00",
    label: "(UTC+12:00) Auckland (New Zealand)",
    iana: "Pacific/Auckland",
  },
  {
    offset: "+12:45",
    label: "(UTC+12:45) Chatham Islands (New Zealand)",
    iana: "Pacific/Chatham",
  },
  { offset: "+13:00", label: "(UTC+13:00) Tonga", iana: "Pacific/Tongatapu" },
  {
    offset: "+14:00",
    label: "(UTC+14:00) Kiritimati Island (Kiribati)",
    iana: "Pacific/Kiritimati",
  },
];

export const getUTCOffset = () => {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  return `${offset >= 0 ? "+" : "-"}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
export const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
