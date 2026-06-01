import { getDefaultConfig } from "expo/metro-config";
import path from "path";

const projectRoot = process.cwd();
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Watch all files within the repository root to allow sharing logic from /src
config.watchFolders = [workspaceRoot];

// Ensure Metro resolves modules from the mobile node_modules first, then root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

export default config;
