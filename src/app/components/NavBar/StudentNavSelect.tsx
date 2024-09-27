import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useStudentStore } from "../../store/useStudentStore";

const StudentNavSelect: React.FC = () => {
  const students = useStudentStore((state) => state.students);
  const selectedStudent = useStudentStore((state) => state.selectedStudent);

  const setSelectedStudentById = useStudentStore(
    (state) => state.setSelectedStudentById
  );
  const handleSelectChange = (value: string) => {
    const studentId = parseInt(value, 10);
    setSelectedStudentById(studentId);
  };
  return (
    <Select
      onValueChange={handleSelectChange}
      value={selectedStudent?.id.toString()}
    >
      <SelectTrigger className="w-[250px] border rounded-lg px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-bold">Student</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {students.map((student) => (
          <SelectItem key={student.id} value={String(student.id)}>
            {student.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StudentNavSelect;
