import moment from "moment";

export const formatCallDuration = (seconds: number | null | undefined) => {
  const duration = moment.duration(seconds, "seconds");
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();

  return `${hours > 0 ? `${hours}h ` : ""}${
    minutes > 0 ? `${minutes}m ` : ""
  }${secs}s`;
};
