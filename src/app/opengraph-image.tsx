import { ImageResponse } from "next/og";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
<div tw="flex flex-col w-full h-full bg-[#FFF5EE] text-[#8660cc] font-sans font-bold">
    <div tw="flex items-center m-auto mt-20">
            <img
              src="https://i.imgur.com/I2rEbPF.png"
              alt="Profile"
              tw="w-30 h-30 rounded-lg mr-4"
            />
    </div>
      <div tw="flex text-4xl font-extrabold m-auto text-center"><h3>Create Your First V2 Frame Today!</h3></div>

    </div>
    ),
    {
      ...size,
    }
  );
}
