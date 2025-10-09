import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export function KPICard (
    {
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: string;
}
) {
  return (
    <Card className="shadow-sm border border-gray-200 rounded-2xl">
      <CardContent className="p-4 text-center">
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className={`text-2xl font-bold ${accent ?? ""}`}>{value}</p>
      </CardContent>
    </Card>
  )
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="shadow-sm border border-gray-200 rounded-2xl">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

