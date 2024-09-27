"use client";

import CoachContainer from "../../components/Coach/CoachContainer";

export default function CoachPage({ params }: { params: { id: string } }) {
  return <CoachContainer coachId={parseInt(params.id, 10)} />;
}
