import React from 'react'

type TechStackPageProps = {
  params: Promise<{ locale: string }>;
};

export default function TechStackPage({params}: TechStackPageProps) {
  return (
    <div>TechStack</div>
  )
}
