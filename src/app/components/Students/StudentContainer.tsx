import { useEffect, useState } from "react";
import { useStudentStore } from "../../store/useStudentStore";
import NavBar from "../NavBar/NavBar";
import StudentBookingsCard from "./StudentBookingCard";
import StudentUpcomingBookings from "./StudentUpcomingBookings";

interface StudentContainerProps {
  studentId: number;
}

const StudentContainer: React.FC<StudentContainerProps> = ({ studentId }) => {
  const setSelectedStudentId = useStudentStore(
    (state) => state.setSelectedStudentById
  );
  const selectedStudent = useStudentStore((state) => state.selectedStudent);
  const isLoading = useStudentStore((state) => state.isLoading);
  const students = useStudentStore((state) => state.students);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    if (studentId && students.length > 0) {
      setSelectedStudentId(studentId);
    }
  }, [studentId, setSelectedStudentId, students.length]);

  const refreshBookings = () => {
    setRefreshTrigger((prev) => !prev);
  };

  if (isLoading || students.length === 0) {
    return <div>Loading</div>;
  }

  return (
    <div className="min-h-screen">
      <NavBar navBarView="STUDENT" />
      <div className="p-8">
        <h1 className="text-xl font-bold">Welcome {selectedStudent?.name}</h1>
        <div className="items-center gap-4 space-y-4">
          <StudentBookingsCard onBookingComplete={refreshBookings} />
          <StudentUpcomingBookings refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default StudentContainer;
