var host = window.location.host;
var locationProtocol = window.location.protocol;
var pathName = window.location.pathname;

var projectName = pathName.split("/")[1];
console.log(window.location);

let api = "",
  socket = "";

const mode = import.meta.env.MODE || "production";

if (mode === "development") {
  api = "/api/gxpark";
  // socket = `/gxpark`;
} else {
  api = `${locationProtocol}//${host}/${projectName}`;
  // socket = `${
  //   locationProtocol === "https:" ? "wss" : "ws"
  // }://${host}/${projectName}`;
}

export { host, api, socket };
