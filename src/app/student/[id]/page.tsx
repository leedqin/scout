"use client";
import StudentContainer from "../../components/Students/StudentContainer";

export default function StudentPage({ params }: { params: { id: string } }) {
  return <StudentContainer studentId={parseInt(params.id, 10)} />;
}
