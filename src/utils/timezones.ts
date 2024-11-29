export const timeZonesMap = [
  { offset: "-12:00", label: "(UTC−12:00) Baker Island (USA)" },
  { offset: "-11:00", label: "(UTC−11:00) Niue, Samoa (Pacific)" },
  { offset: "-10:00", label: "(UTC−10:00) Hawaii (USA)" },
  {
    offset: "-09:30",
    label: "(UTC−09:30) Marquesas Islands (French Polynesia)",
  },
  { offset: "-09:00", label: "(UTC−09:00) Alaska (USA)" },
  { offset: "-08:00", label: "(UTC−08:00) Los Angeles (Pacific Time, USA)" },
  { offset: "-07:00", label: "(UTC−07:00) Denver (Mountain Time, USA)" },
  { offset: "-06:00", label: "(UTC−06:00) Chicago (Central Time, USA)" },
  { offset: "-05:00", label: "(UTC−05:00) New York (Eastern Time, USA)" },
  { offset: "-04:00", label: "(UTC−04:00) Santiago (Chile)" },
  { offset: "-03:30", label: "(UTC−03:30) St. John's (Canada)" },
  { offset: "-03:00", label: "(UTC−03:00) Buenos Aires (Argentina)" },
  { offset: "-02:00", label: "(UTC−02:00) South Georgia / Sandwich Islands" },
  { offset: "-01:00", label: "(UTC−01:00) Azores (Portugal)" },
  { offset: "+00:00", label: "(UTC±00:00) London (Greenwich Mean Time)" },
  { offset: "+01:00", label: "(UTC+01:00) Paris (Central European Time)" },
  { offset: "+02:00", label: "(UTC+02:00) Athens (Eastern European Time)" },
  { offset: "+03:00", label: "(UTC+03:00) Moscow (Russia)" },
  { offset: "+03:30", label: "(UTC+03:30) Tehran (Iran)" },
  { offset: "+04:00", label: "(UTC+04:00) Dubai (United Arab Emirates)" },
  { offset: "+04:30", label: "(UTC+04:30) Kabul (Afghanistan)" },
  { offset: "+05:00", label: "(UTC+05:00) Karachi (Pakistan)" },
  { offset: "+05:30", label: "(UTC+05:30) New Delhi (India)" },
  { offset: "+05:45", label: "(UTC+05:45) Kathmandu (Nepal)" },
  { offset: "+06:00", label: "(UTC+06:00) Dhaka (Bangladesh)" },
  { offset: "+06:30", label: "(UTC+06:30) Yangon (Myanmar)" },
  {
    offset: "+07:00",
    label: "(UTC+07:00) Bangkok / HCMC (Thailand / Vietnam)",
  },
  { offset: "+08:00", label: "(UTC+08:00) Beijing (China)" },
  { offset: "+08:45", label: "(UTC+08:45) Eucla (Australia)" },
  { offset: "+09:00", label: "(UTC+09:00) Tokyo (Japan)" },
  { offset: "+09:30", label: "(UTC+09:30) Adelaide (Australia)" },
  { offset: "+10:00", label: "(UTC+10:00) Sydney (Australia)" },
  { offset: "+10:30", label: "(UTC+10:30) Lord Howe Island (Australia)" },
  { offset: "+11:00", label: "(UTC+11:00) Nouméa (New Caledonia)" },
  { offset: "+12:00", label: "(UTC+12:00) Auckland (New Zealand)" },
  { offset: "+12:45", label: "(UTC+12:45) Chatham Islands (New Zealand)" },
  { offset: "+13:00", label: "(UTC+13:00) Tonga" },
  { offset: "+14:00", label: "(UTC+14:00) Kiritimati Island (Kiribati)" },
];

export const getUTCOffset = () => {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  return `${offset >= 0 ? "+" : "-"}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
