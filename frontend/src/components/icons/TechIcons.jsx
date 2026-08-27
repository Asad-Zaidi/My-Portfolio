import {
  SiDocker,
  SiFigma,
  SiGit,
  SiMongodb,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiVscodium,
} from "react-icons/si";

const techIconMap = {
  react: SiReact,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  mongodb: SiMongodb,
  tailwind: SiTailwindcss,
  docker: SiDocker,
  vscode: SiVscodium,
  figma: SiFigma,
  git: SiGit,
  python: SiPython,
};

const techIconColors = {
  react: "#61DAFB",
  nodejs: "#5FA04E",
  node: "#5FA04E",
  mongodb: "#47A248",
  tailwind: "#06B6D4",
  docker: "#2496ED",
  vscode: "#007ACC",
  figma: "#F24E1E",
  git: "#F05032",
  python: "#3776AB",
};

export function getTechIcon(key) {
  return techIconMap[(key || "").toLowerCase()] || null;
}

export function getTechColor(key) {
  return techIconColors[(key || "").toLowerCase()] || "currentColor";
}

export default techIconMap;
