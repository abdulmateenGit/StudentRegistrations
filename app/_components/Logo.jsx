import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <div className="p-2 rounded-xl">
        <Image
          src="/Trinity.png"
          alt="Trinity School Lahore logo"
          width={120}
          height={120}
        />
      </div>
    </Link>
  );
}
