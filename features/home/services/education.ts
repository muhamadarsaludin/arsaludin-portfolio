import { EducationItem } from "../types";

export async function getEducations(): Promise<EducationItem[]> {
  return [
    {
      "name": "STMIK Tasikmalaya",
      "logo": "/education/stmik-tasikmalaya.webp",
      "degree": "Bachelor's degree",
      "field": "Computer Science",
      "gpa": 3.86,
      "description": "Best Graduate, STMIK Tasikmalaya – 35th Graduation",
      "images": [
        "education-1.png",
        "education-2.png"
      ]
    }
  ]
}