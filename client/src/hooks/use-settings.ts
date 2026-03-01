import { useQuery } from "@tanstack/react-query";
import type { Setting } from "@shared/schema";

export function useSettings() {
    const { data: settings, isLoading } = useQuery<Setting>({
        queryKey: ["/api/settings"],
    });

    return {
        settings,
        isLoading,
        currency: settings?.currency || "USD",
        exchangeRate: Number(settings?.exchangeRate || 15000),
    };
}

export function formatPrice(priceString: string, currency: string, exchangeRate: number) {
    // Extract number from a string like "$15" or "15"
    const rawNumberStr = priceString.replace(/(?:AED|EAD|د\.إ|ل\.س|\$)\s*/ig, '').trim();
    const priceValue = parseFloat(rawNumberStr);

    if (isNaN(priceValue)) return priceString; // fallback if it can't be parsed

    if (currency === "USD") {
        return `$${priceValue}`;
    } else {
        // SYP
        const sypValue = priceValue * exchangeRate;
        return `${sypValue.toLocaleString('en-US')} ل.س`;
    }
}
