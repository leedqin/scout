import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../shadcn/Button";
import { useStudentStore } from "../store/useStudentStore";

interface StudentSelectionProps {
  showStudents: boolean;
}

const StudentSelection: React.FC<StudentSelectionProps> = ({
  showStudents,
}) => {
  const setStudents = useStudentStore((state) => state.setStudents);
  const students = useStudentStore((state) => state.students);
  const isLoading = useStudentStore((state) => state.isLoading);
  const setIsLoading = useStudentStore((state) => state.setIsLoading);
  const router = useRouter();

  useEffect(() => {
    if (showStudents && students.length === 0) {
      console.log("Fetching students...");
      setIsLoading(true);

      fetch("/api/students")
        .then((res) => res.json())
        .then((data) => {
          setStudents(data);
          console.log("Fetched data from API:", data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    console.log("students");
  }, [showStudents, students.length, setStudents, setIsLoading]);

  if (!showStudents) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold mb-4 text-gray-900">
        Select a Student
      </h2>
      {isLoading ? (
        <div>Loading students...</div>
      ) : (
        students.map((student) => (
          <Button
            key={student.id}
            variant="default"
            className="w-full max-w-sm mx-auto rounded-lg bg-black text-white py-2 px-4 hover:bg-gray-800 border border-gray-300 transition-all duration-150"
            onClick={() => {
              router.push(`/student/${student.id}`);
            }}
          >
            {student.name}
          </Button>
        ))
      )}
    </div>
  );
};

export default StudentSelection;
