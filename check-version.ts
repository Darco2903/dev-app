import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Usage: node check.js <version>");
    process.exit(1);
}

const versionToCheck = args[0];
if (!/^\d+\.\d+\.\d+$/.test(versionToCheck)) {
    console.error("Invalid version format. Expected format: x.y.z (release only)");
    process.exit(1);
}

const packageJsonPath = "package.json";
const cargoTomlPath = "src-tauri/Cargo.toml";
const tauriConfPath = "src-tauri/tauri.conf.json";

const pack = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const cargoToml = fs.readFileSync(cargoTomlPath, "utf-8");
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, "utf-8"));

const packageVersion = pack.version;
const cargoVersionMatch = cargoToml.match(/version\s*=\s*"(.*?)"/);
const cargoVersion = cargoVersionMatch ? cargoVersionMatch[1] : null;
const tauriVersion = tauriConf.version;
const tauriTitle = "0." + tauriConf.app.windows[0].title.match(/\d+\.\d+/); // Only two last parts of the version

// console.log(`package.json version: ${packageVersion}`);
// console.log(`Cargo.toml version: ${cargoVersion}`);
// console.log(`tauri.conf.json version: ${tauriVersion}`);
// console.log(`tauri.conf.json title: ${tauriTitle}`);

if (
    versionToCheck !== packageVersion ||
    versionToCheck !== cargoVersion ||
    versionToCheck !== tauriVersion ||
    versionToCheck !== tauriTitle
) {
    console.error("Version mismatch detected:");
    if (packageVersion !== versionToCheck) {
        console.error(
            `- package.json (${packageVersion}) does not match input version (${versionToCheck})`,
        );
    }

    if (cargoVersion !== versionToCheck) {
        console.error(
            `- Cargo.toml (${cargoVersion}) does not match input version (${versionToCheck})`,
        );
    }

    if (tauriVersion !== versionToCheck) {
        console.error(
            `- tauri.conf.json (${tauriVersion}) does not match input version (${versionToCheck})`,
        );
    }

    if (tauriTitle !== versionToCheck) {
        console.error(
            `- tauri.conf.json title (${tauriTitle}) does not match input version (${versionToCheck})`,
        );
    }

    process.exit(1);
} else {
    console.log("All versions are consistent.");
}
