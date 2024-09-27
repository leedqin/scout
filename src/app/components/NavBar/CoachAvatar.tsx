import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { useCoachStore } from "../../store/useCoachStore";

const CoachAvatar: React.FC = () => {
  const selectedStudent = useCoachStore((state) => state.selectedCoach);
  return (
    <Avatar>
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt="Coach"
        className="h-10 rounded-full"
      />
      <AvatarFallback>{selectedStudent?.name?.charAt(0) || "A"}</AvatarFallback>
    </Avatar>
  );
};

export default CoachAvatar;
