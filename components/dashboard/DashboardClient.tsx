"use client"

import { InsightResponse } from '@/lib/actions/dashboard';
import { useEffect, useState } from 'react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip,ChartTooltipContent, ChartContainer, ChartConfig, } from '@/components/ui/chart';
import { ChartCard, KPICard } from './KPICard';


const DashboardClient = ({initailData}:{initailData:InsightResponse, initialFrom?: string;
  initialTo?: string;
  initialGranularity?: "day" | "week" | "month";}) => {
   const [data, setData] = useState(initailData)  
  const { kpis, byStatus, timeseries, topProducts, topCustomers, topProductsByCategory } = data;

  useEffect(()=>{
    setData(initailData)
  },[initailData])

  const topProductConfig = {
    product:{
      label:"Product",
      color:"var(--primary)"
    }
  } satisfies ChartConfig

  const OrderStatusConfig ={
    shipped:{
      label:"Shipped",
      color:"var(--primary)"
    },
    deliverd:{
      label:"Deliverd",
      color:"var(--chart-2)"
    },
    pending:{
      label:"Pending",
      color:"var(--chart-3)"
    }
  } satisfies ChartConfig

  const orderRevenueConfig = {
    order:{
      label:"Order",
      color:"var(--primary)"
    },
    revenue:{
      label:"Revenue",
      color:"var(--secondary)"
    }
  } satisfies ChartConfig

  const topCustomersConfig ={
    revenue:{
      label:"Revenue",
      color:"var(--primary)"
    }
  } satisfies ChartConfig

 const productsCategoriesConfig = {
  electronics:{
    label:"ELECTRONICS",
    color:"var(--chart-1)"
  },
    clothing:{
      label:"CLOTHING",
      color:"var(--chart-2)"
    },
    food:{
      label:"FOOD",
      color:"var(--chart-3)"
    },
    books:{label:"BOOKS",color:"var(--chart-4)"},
    furniture:{label:"FURNITURE", color:"var(--chart-5)"},
    other:{label:"OTHER"},

 } satisfies ChartConfig

  return(
    <div className='p-8 space-y-8 text-black'>

       {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard title="Total Orders" value={kpis.totalOrders.toLocaleString()} />
        <KPICard
          title="Total Revenue"
          value={`$${kpis.totalRevenue.toFixed(2)}`}
         
        />
        <KPICard
          title="Avg Order Value"
          value={`$${kpis.averageOrderValue.toFixed(2)}`}
        
        />
        <KPICard title="Customers" value={kpis.totalCustomers.toLocaleString()} />
        <KPICard
          title="Low Stock Products"
          value={kpis.lowStockProducts.toString()}
        
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders & Revenue over Time */}
        <ChartCard title="Revenue & Orders Over Time">
          <ChartContainer config={orderRevenueConfig} className='min-h-60 max-h-100 w-full' >
            <LineChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent/>} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#3B82F6" name="Orders" />
            </LineChart>
          </ChartContainer>
        </ChartCard>

        {/* Orders by Status */}
        <ChartCard title="Orders by Status">
          <ChartContainer config={OrderStatusConfig} className='min-h-60 max-h-100 w-full'>
            <BarChart data={byStatus.map((s) => ({ status: s.status, count: s._count.status }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis dataKey="count" />
              <ChartTooltip content={<ChartTooltipContent/>} />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>

      {/* Top Products */}
      <ChartCard title="Top Products by Quantity Sold">
        <ChartContainer config={topProductConfig} className='min-h-60 max-h-90 w-full'>
          <BarChart
            data={topProducts.map((p) => ({
              name: p.name,
              qty: p.qty,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"  />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent/>} />
            <Bar dataKey="qty" fill="#F59E0B" />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      {/* Top Customers */}
      <ChartCard title="Top Customers by Revenue">
        <ChartContainer config={topCustomersConfig} className='min-h-60 max-h-100 w-full'>
          <BarChart
            data={topCustomers.map((c) => ({
              name: c.name,
              revenue: c.revenue,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"  />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent/>} />
            <Bar dataKey="revenue" fill="#10B981" />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      {/* Top Products by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(topProductsByCategory).map(([cat, products]) => (
          <ChartCard key={cat} title={`Top ${cat} Products`}>
            <ChartContainer config={productsCategoriesConfig} className='min-h-60 max-h-100 w-full'>
              <BarChart
                data={products.map((p) => ({
                  name: p.name,
                  qty: p.qty,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"  />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent/>} />
                <Bar dataKey="qty" fill="#3B82F6" />
              </BarChart>
            </ChartContainer>
          </ChartCard>
        ))}
      </div>
       
    </div>
  )

}

export default DashboardClient