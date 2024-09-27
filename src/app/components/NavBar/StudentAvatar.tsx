import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { useStudentStore } from "../../store/useStudentStore";

const StudentAvatar: React.FC = () => {
  const selectedStudent = useStudentStore((state) => state.selectedStudent);
  return (
    <Avatar>
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt="Student"
        className="h-10 rounded-full"
      />
      <AvatarFallback>{selectedStudent?.name?.charAt(0) || "A"}</AvatarFallback>
    </Avatar>
  );
};

export default StudentAvatar;
