import Image from "next/image";

export function BrandMark() {
  return (
    <div className="space-y-2">
      <Image
        src="/comtoo_logo.png"
        alt="COMTOO"
        width={190}
        height={44}
        priority
        className="h-[34px] w-auto"
      />
      <div className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
        Survey Visualiser
      </div>
    </div>
  );
}

