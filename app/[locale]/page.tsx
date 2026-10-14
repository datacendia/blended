import { HomeContent } from "@/components/pages/Home";
import { localeFrom, type LocaleParams } from "@/lib/params";

export default async function HomePage({ params }: LocaleParams) {
  return <HomeContent locale={await localeFrom(params)} />;
}
