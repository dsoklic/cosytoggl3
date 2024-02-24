import axios, { AxiosRequestConfig } from "axios";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function sendGetRequest<T>(url: string, config: AxiosRequestConfig | undefined) {
    while (true) {
        const { data, status } = await axios.get<T>(url, config);

        if (status === 429) {
            await delay(1000);
        } else {
            return {data, status};
        }
    }
}

export async function sendPostRequest<T>(url: string, inputData:any, config: AxiosRequestConfig | undefined) {
    while (true) {
        const { data, status } = await axios.post<T>(url, inputData, config);

        if (status === 429) {
            await delay(1000);
        } else {
            return {data, status};
        }
    }
}

export async function sendPatchRequest<T>(url: string, inputData:any, config: AxiosRequestConfig | undefined) {
    while (true) {
        const { data, status } = await axios.patch<T>(url, inputData, config);

        if (status === 429) {
            await delay(1000);
        } else {
            return {data, status};
        }
    }
}

export async function sendDeleteRequest<T>(url: string, config: AxiosRequestConfig | undefined) {
    while (true) {
        const { data, status } = await axios.delete<T>(url, config);

        if (status === 429) {
            await delay(1000);
        } else {
            return {data, status};
        }
    }
}
