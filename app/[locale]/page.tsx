import Image from "next/image";
import { use } from "react";
import { setRequestLocale } from "next-intl/server";

type HomeProps = {
  params: Promise<{locale: string}>;
}

export default function Home({ params }: HomeProps) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return (
    <div>
     
    </div>
  );
}
