import Link from "next/link";
import { PlatformInfo, PlatformLogo } from "@/components/platformLogo";

export default function Footer() {
  return (
    <>
      <div className="w-full min-h-32 bg-stone-50 border-t-[1px]">
        <div className="w-full flex flex-row justify-between py-7">
          <PlatformLogo />
          <div className="flex flex-row items-center space-x-5 px-7">
            <Link href={""}>
              <span>Contact</span>
            </Link>
            <Link href={""}>
              <span>Learn more</span>
            </Link>
            <Link href={""}>
              <span>Support</span>
            </Link>
          </div>
        </div>
        <div className="text-center text-sm mt-auto">
          <p>Copyright &copy; 2026 {PlatformInfo.name} All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
