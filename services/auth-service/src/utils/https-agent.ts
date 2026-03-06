import https from "https";

export const getHttpsAgent = () => {
  if (process.env.USE_HTTPS === "true") {
    return new https.Agent({
      rejectUnauthorized: false,
    });
  }
  return undefined;
};
