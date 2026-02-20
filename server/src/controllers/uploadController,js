import crypto from "crypto";

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function signCloudinaryParams(params, apiSecret) {
  const keys = Object.keys(params)
    .filter(
      (k) => params[k] !== undefined && params[k] !== null && params[k] !== ""
    )
    .sort();

  const toSign = keys.map((k) => `${k}=${params[k]}`).join("&");
  return sha1(toSign + apiSecret);
}

function getCloudinaryConfigFromEnv() {
  const fromTriplet = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };

  if (fromTriplet.cloudName && fromTriplet.apiKey && fromTriplet.apiSecret) {
    return fromTriplet;
  }

  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) return null;

  // CLOUDINARY_URL format: cloudinary://<api_key>:<api_secret>@<cloud_name>
  try {
    const u = new URL(cloudinaryUrl);
    if (u.protocol !== "cloudinary:") return null;
    const cloudName = (u.hostname || "").trim();
    const apiKey = decodeURIComponent(u.username || "").trim();
    const apiSecret = decodeURIComponent(u.password || "").trim();
    if (!cloudName || !apiKey || !apiSecret) return null;
    return { cloudName, apiKey, apiSecret };
  } catch {
    return null;
  }
}

export const getCloudinarySignature = async (req, res) => {
  try {
    const cfg = getCloudinaryConfigFromEnv();
    if (!cfg) {
      return res.status(500).json({
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET (or CLOUDINARY_URL)",
      });
    }

    const { cloudName, apiKey, apiSecret } = cfg;

    const folder = String(req.query.folder || "tours").trim();
    const timestamp = Math.floor(Date.now() / 1000);

    // NOTE: Only sign parameters you will send to Cloudinary.
    const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);

    res.json({ cloudName, apiKey, timestamp, folder, signature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicCloudinarySignature = async (req, res) => {
  try {
    const cfg = getCloudinaryConfigFromEnv();
    if (!cfg) {
      return res.status(500).json({
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET (or CLOUDINARY_URL)",
      });
    }

    const { cloudName, apiKey, apiSecret } = cfg;

    // Hard restrict to profiles folder (prevents arbitrary folder signing).
    const folder = "profiles";
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);

    res.json({ cloudName, apiKey, timestamp, folder, signature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
