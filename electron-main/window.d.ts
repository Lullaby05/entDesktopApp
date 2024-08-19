interface Window {
  versions: {
    ping: () => void,
    start: () => void,
    login: () => void,
    logout: () => void,
    loginQuit: () => void,
    windowMin: () => void,
  };
  main: {
    loginQuit: () => void,
  };
  projectId: string;
  os: "Darwin" | string;
}