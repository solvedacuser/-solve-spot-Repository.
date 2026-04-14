import Link from "next/link";

export const PlatformInfo = {
  name: "Solve Spot",
  logoSrc: "/waypoints.svg",
};

export function PlatformLogo() {
  return (
    <div className="flex flex-row justify-between items-center px-10">
      <Link
        href={"/"}
        className="flex items-center gap-2 font-bold whitespace-nowrap"
      >
        <img src={PlatformInfo.logoSrc} alt="logo" className="w-12 h-12" />
        <span className="text-2xl">{PlatformInfo.name}</span>
      </Link>
    </div>
  );
}
