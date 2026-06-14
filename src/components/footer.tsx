import Link from "next/link";
import waypointsImage from "@/images/waypoints.svg";

const PlatformInfo = {
  name: "SOLVE SPOT",
  logoSrc: waypointsImage.src,
};

export function PlatformLogo() {
  return (
    <div className="flex flex-row justify-between items-center pl-3 md:pl-10">
      <Link
        href={"/home"}
        className="flex items-center gap-2 font-bold whitespace-nowrap"
      >
        <img
          src={PlatformInfo.logoSrc}
          alt="logo"
          className="object-contain w-8 h-8 md:w-10 md:h-10"
        />
        <span className="text-sm sm:text-sm md:text-xl">
          {PlatformInfo.name}
        </span>
      </Link>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <div className="w-full min-h-32 bg-stone-50 border-t-[1px]">
        <div className="w-full flex flex-row justify-between py-7">
          <PlatformLogo />
          <div className="flex flex-row items-center space-x-3 md:space-x-5 pr-3 md:pr-10 justify-between">
            {/* <Link href={""}> */}
            <span className="text-xs sm:text-sm md:text-lg">Contact</span>
            {/* </Link> */}
            {/* <Link href={""}> */}
            <span className="text-xs sm:text-sm md:text-lg">Learn more</span>
            {/* </Link>
            <Link href={""}> */}
            <span className="text-xs sm:text-sm md:text-lg">Support</span>
            {/* </Link> */}
          </div>
        </div>
        <div className="text-center text-xs md:text-sm mt-auto">
          <p>Copyright &copy; 2026 {PlatformInfo.name} All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
