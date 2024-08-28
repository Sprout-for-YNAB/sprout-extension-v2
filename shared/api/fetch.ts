import { ErrorResponse } from "../types/app";
import env from "../utils/env";
import { YnabError } from "../types/ynab";

export const getFromYnab = async (path: string, params?: URLSearchParams) => {
  const response = await fetch(
    `${env.WORKER_URL}/${path}${params ? `?${params.toString()}` : ""}`,
    {
      method: "GET"
    }
  );
  if (!response.ok) {
    const { error_description } = (await response.json()) as ErrorResponse;
    throw {
      status: response.status,
      statusText: response.statusText,
      message: error_description
    };
  }
  return response.json();
};

export const postToYnab = async (path: string, body: string) => {
  const response = await fetch(`${env.WORKER_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });
  if (!response.ok) {
    const resBody = (await response.json()) as YnabError;
    throw resBody;
  }
  return true;
};
