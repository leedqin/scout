import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useCoachStore } from "../../store/useCoachStore";

const CoachNavSelect: React.FC = () => {
  const coaches = useCoachStore((state) => state.coaches);
  const selectedCoach = useCoachStore((state) => state.selectedCoach);

  const setSelectedCoachById = useCoachStore(
    (state) => state.setSelectedCoachById
  );
  const handleSelectChange = (value: string) => {
    const coachId = parseInt(value, 10);
    setSelectedCoachById(coachId);
  };
  return (
    <Select
      onValueChange={handleSelectChange}
      value={selectedCoach?.id.toString()}
    >
      <SelectTrigger className="w-[250px] border rounded-lg px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-bold">Coach</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {coaches.map((coach) => (
          <SelectItem key={coach.id} value={String(coach.id)}>
            {coach.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CoachNavSelect;
