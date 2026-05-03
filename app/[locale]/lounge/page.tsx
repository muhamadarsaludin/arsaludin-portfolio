import LoungePage from "@/features/lounge/components/LoungePage";


type LoungeProps = {
  params: Promise<{ locale: string }>;
};

export default function Lounge({params}: LoungeProps) {
  return <LoungePage params={params}/>
}
