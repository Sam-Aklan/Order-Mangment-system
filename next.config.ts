import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[{
      protocol:"https",
      hostname:`res.cloudinary.com`,
      pathname:`/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`
    }]
  }
};
// https://res.cloudinary.com/dzohyayml/image/upload/v1756642095/of0daudv2zvo22i5w2ci.png
export default nextConfig;
