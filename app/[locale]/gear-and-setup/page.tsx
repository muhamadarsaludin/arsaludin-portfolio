import GearAndSetupPage from "@/features/gear-and-setup/components/GearAndSetupPage";

type GearAndSetupProps = {
  params: Promise<{ locale: string }>;
};

export default function GearAndSetup({params}: GearAndSetupProps) {
  return <GearAndSetupPage params={params}/>
}
