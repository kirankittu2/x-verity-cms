import clsx from "clsx";
import Image from "next/image";
import arrow from "@/public/arrow.svg";

export default function Card({
  name,
  count,
  growth,
  growthPercentage,
  status,
}) {
  return (
    <div className="bg-white p-5 custom-border">
      <h3 className="text-18-black mb-10">{name}</h3>
      <div className="flex items-center">
        <p className="text-28-black mr-5">{count}</p>
        <div
          className={clsx(
            "bg-[#FFABAB] w-[25px] h-[25px] rounded-full flex justify-center items-center",
            {
              "-scale-y-100": growth === "increase",
            }
          )}>
          <Image
            className="w-auto h-auto"
            src={arrow}
            width={10}
            height={12}
            alt={growth}
          />
        </div>
        <p className="ml-2">{growthPercentage}</p>
      </div>
      <p className="text-14-grey">{status}</p>
    </div>
  );
}
