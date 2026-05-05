import RoadmapPage from "@/features/roadmap/components/RoadmapPage";


type RoadmapProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function Roadmap({params, searchParams}: RoadmapProps) {
  return <RoadmapPage params={params} searchParams={searchParams}/>
}
