import { setup }  from "jest-dev-server";

export async function globalSetup() {
    await setup({
        command: "npm run dev",
        launchTimeout: 20000,
        debug: true,
        port: 3001
    });
}