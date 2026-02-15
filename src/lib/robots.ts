import robotBlue from "@/assets/robots/robot_blue.png";
import robotPurple from "@/assets/robots/robot_purple.png";
import robotRed from "@/assets/robots/robot_red.png";
import robotYellow from "@/assets/robots/robot_yellow.png";

export type RobotId = "blue" | "purple" | "red" | "yellow";

export interface RobotOption {
  id: RobotId;
  color: string;
  image: string;
  nameKey: "robot.blue" | "robot.purple" | "robot.red" | "robot.yellow";
}

export const ROBOT_OPTIONS: RobotOption[] = [
  {
    id: "blue",
    color: "#3B82F6",
    image: robotBlue,
    nameKey: "robot.blue"
  },
  {
    id: "purple",
    color: "#8B5CF6",
    image: robotPurple,
    nameKey: "robot.purple"
  },
  {
    id: "red",
    color: "#EF4444",
    image: robotRed,
    nameKey: "robot.red"
  },
  {
    id: "yellow",
    color: "#F59E0B",
    image: robotYellow,
    nameKey: "robot.yellow"
  }
];

export function getRobotById(id?: string): RobotOption {
  return ROBOT_OPTIONS.find((robot) => robot.id === id) ?? ROBOT_OPTIONS[0]!;
}
