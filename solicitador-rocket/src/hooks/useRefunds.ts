import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getRefunds } from "../api/refunds";

export function useRefunds(page: number, search: string) {
    return useQuery({
        queryKey: ["refunds", page, search],
        queryFn: () => getRefunds(page, search),
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // mantém em memória (antigo cacheTime)
        placeholderData: keepPreviousData, // evita piscar (antigo keepPreviousData)
    });
}