'use client';

export default function PriceBreakdown({ priceDetails }) {
    if (!priceDetails) return null;

    const { basePrice, distanceCost, timeCost, surcharges, finalPrice } = priceDetails;

    return (
        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#27368c] mb-4">Price Breakdown</h2>
            <ul className="space-y-2">
                <li className="flex justify-between">
                    <span>Base Price</span>
                    <span>€{basePrice.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                    <span>Distance Cost</span>
                    <span>€{distanceCost.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                    <span>Time Cost</span>
                    <span>€{timeCost.toFixed(2)}</span>
                </li>

                {surcharges && surcharges.length > 0 && (
                    <>
                        {surcharges.map((s, idx) => (
                            <li key={idx} className="flex justify-between">
                                <span>{s.label}</span>
                                <span>€{s.amount.toFixed(2)}</span>
                            </li>
                        ))}
                    </>
                )}

                <li className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>€{finalPrice.toFixed(2)}</span>
                </li>
            </ul>
        </div>
    );
}
