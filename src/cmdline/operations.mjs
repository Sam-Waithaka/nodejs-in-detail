import { input } from "@inquirer/prompts";
const baseUrl = "http://localhost:5000";
export const ops = {
    "Get All": () => sendRequest("GET", "/api/results"),
    "Get Name": async () => {
        const name = await input({ message: "Name?"});
        await sendRequest("GET", `/api/results?name=${name}`);
    },
    "Exit": () => process.exit()
}
const sendRequest = async (method, url, body, contentType) => {
    const response = await fetch(baseUrl + url, {
        method, headers: { "Content-Type": contentType ?? "application/json"},
        body: JSON.stringify(body)
    });
    if (response.status == 200) {
        const data = await response.json();
        (Array.isArray(data) ? data : [data])
            .forEach(elem => console.log(JSON.stringify(elem)));
    } else {
        console.log(response.status + " " + response.statusText);
    }
}
