import { api } from "./axios";

export async function uploadReceipt(file: File) {
    const formData = new FormData();

    formData.append("receiptFile", file); // 👈 CORRETO

    const { data } = await api.post("/receipts", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data.receipt.id;
}