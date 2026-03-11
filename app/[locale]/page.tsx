import Image from "next/image";
import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import Heading from "@/components/Heading";

type HomeProps = {
  params: Promise<{locale: string}>;
}

export default function Home({ params }: HomeProps) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return (
    <div className="max-w-(--m-page-width) mx-auto">
      <Heading id="test" level={1}>
        Ini heading afafa asfsf
      </Heading>
      <p className="mt-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum velit natus ipsa nihil odio praesentium quos quod blanditiis sit beatae harum id architecto error quam, sed tenetur eveniet labore dolorem.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum velit natus ipsa nihil odio praesentium quos quod blanditiis sit beatae harum id architecto error quam, sed tenetur eveniet labore dolorem.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum velit natus ipsa nihil odio praesentium quos quod blanditiis sit beatae harum id architecto error quam, sed tenetur eveniet labore dolorem.
      </p>
      <p className="mt-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum velit natus ipsa nihil odio praesentium quos quod blanditiis sit beatae harum id architecto error quam, sed tenetur eveniet labore dolorem.
      </p>
      <Heading id="test2">
        Ini heading 2
      </Heading>
      <p className="mt-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum velit natus ipsa nihil odio praesentium quos quod blanditiis sit beatae harum id architecto error quam, sed tenetur eveniet labore dolorem.
      </p>
      <p className="mt-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum velit natus ipsa nihil odio praesentium quos quod blanditiis sit beatae harum id architecto error quam, sed tenetur eveniet labore dolorem.
      </p>
      <p className="mt-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum velit natus ipsa nihil odio praesentium quos quod blanditiis sit beatae harum id architecto error quam, sed tenetur eveniet labore dolorem.
      </p>
      <Heading id="test3" level={3}>
        Ini heading 3
      </Heading>
      <Heading id="test4" level={4}>
        Ini heading 4
      </Heading>
      <br />
      <h1>afafas</h1>
      <h2>safasfsa</h2>
    </div>
  );
}
