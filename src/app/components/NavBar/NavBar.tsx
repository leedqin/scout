import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "../../../components/ui/switch";
import CoachAvatar from "./CoachAvatar";
import CoachNavSelect from "./CoachNavSelect";
import StudentAvatar from "./StudentAvatar";
import StudentNavSelect from "./StudentNavSelect";

export type NavBarView = "STUDENT" | "COACH";

interface NavBarProps {
  navBarView: NavBarView;
}

const NavBar: React.FC<NavBarProps> = ({ navBarView }) => {
  const router = useRouter();
  const [isCoachView, setIsCoachView] = useState(navBarView === "COACH");

  const handleToggle = () => {
    if (isCoachView) {
      router.push("/selectStudents");
    } else {
      router.push("/selectCoaches");
    }
    setIsCoachView(!isCoachView);
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b border-gray-200">
      {navBarView === "STUDENT" && (
        <div className="flex items-center space-x-4">
          <StudentAvatar />
          <StudentNavSelect />
        </div>
      )}
      {navBarView === "COACH" && (
        <div className="flex items-center space-x-4">
          <CoachAvatar />
          <CoachNavSelect />
        </div>
      )}
      <div className="flex space-x-6 text-sm"></div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-bold">
          {isCoachView ? "Coach View" : "Student View"}
        </span>
        <Switch checked={isCoachView} onCheckedChange={handleToggle} />
      </div>
    </div>
  );
};

export default NavBar;
