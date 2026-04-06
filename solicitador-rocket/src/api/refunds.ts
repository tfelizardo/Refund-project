import { api } from "./axios";

export async function getRefunds(page: number, search: string) {
    const { data } = await api.get("/refunds", {
        params: {
            page,
            q: search,
        },
    });

    return data;
}

// tipagem correta

type CreateRefundDTO = {
    title: string;
    category: string;
    value: number;
    receipt: string;
};

export async function createRefund(data: CreateRefundDTO) {
    const response = await api.post("/refunds", data);
    return response.data;
}

export async function deleteRefund(id: string) {
    const response = await api.delete(`/refunds/${id}`);
    return response.data;
}