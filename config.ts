import Logger from "./util/Logger";

const config = {
  api_base_url: getApiBaseUrl(),
};

function getApiBaseUrl() {
  return "http://192.168.11.20:8080";
}

export const apiBaseUrl = config.api_base_url;

export default config;
