import Section from "@/components/Section";
import EducationCard from "./EducationCard";
import { EducationItem } from "../../types";

type EducationSectionProps = {
  items: EducationItem[]
}

export default function EducationSection({items}: EducationSectionProps) {
  return (
    <Section>
       {items.map((item, index) => (
        <EducationCard key={index} {...item} />
      ))}
    </Section>
  )
}
