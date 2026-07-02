import {
  HomeProductSection,
  HomeCategories,
} from "@/components/sections"

import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { toHreflang } from "@/lib/helpers/hreflang"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: "VoltQ - Solar & Energy Marketplace",
    description: "India&apos;s leading marketplace for solar panels, batteries, inverters and EV chargers.",
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <main className="flex flex-col gap-0 text-primary">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] bg-gradient-to-br from-[#0a0a0a] via-[#0d1f0d] to-[#0a1628] flex items-center overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        {/* Glow effects */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl" />

        <div className="container mx-auto px-6 lg:px-12 z-10">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">India&apos;s #1 Solar Marketplace</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Power Your World
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                With Clean Energy
              </span>
            </h1>

            <p className="text-gray-400 text-xl mb-10 max-w-2xl leading-relaxed">
              Shop solar panels, batteries, inverters & EV chargers from India&apos;s top vendors. 
              Compare prices, read reviews, go green.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/categories"
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25">
                Shop Now ⚡
              </Link>
              <Link href={process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:7001"}
                className="border border-white/20 hover:border-green-500/50 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-white/5">
                Become a Seller
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-16">
              {[
                { value: "500+", label: "Products" },
                { value: "50+", label: "Verified Sellers" },
                { value: "10K+", label: "Happy Customers" },
                { value: "100%", label: "Clean Energy" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solar panel illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-20">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <rect x="50" y="50" width="130" height="130" rx="8" fill="none" stroke="#22c55e" strokeWidth="2"/>
            <rect x="220" y="50" width="130" height="130" rx="8" fill="none" stroke="#22c55e" strokeWidth="2"/>
            <rect x="50" y="220" width="130" height="130" rx="8" fill="none" stroke="#22c55e" strokeWidth="2"/>
            <rect x="220" y="220" width="130" height="130" rx="8" fill="none" stroke="#22c55e" strokeWidth="2"/>
            <line x1="115" y1="50" x2="115" y2="180" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
            <line x1="50" y1="115" x2="180" y2="115" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
            <line x1="285" y1="50" x2="285" y2="180" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
            <line x1="220" y1="115" x2="350" y2="115" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
            <line x1="115" y1="220" x2="115" y2="350" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
            <line x1="50" y1="285" x2="180" y2="285" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
            <line x1="285" y1="220" x2="285" y2="350" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
            <line x1="220" y1="285" x2="350" y2="285" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-6 lg:px-12 bg-white">
        <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-tight">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {[
            { icon: "☀️", label: "Solar Panels", path: "/categories" },
            { icon: "🔋", label: "Batteries", path: "/categories" },
            { icon: "⚡", label: "Inverters", path: "/categories" },
            { icon: "🚗", label: "EV Chargers", path: "/categories" },
            { icon: "🔧", label: "Accessories", path: "/categories" },
          ].map((cat) => (
            <Link key={cat.label} href={cat.path}
              className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-300 group">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <span className="font-semibold text-sm text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">Featured Products</h2>
          <HomeProductSection heading="" locale={locale} home />
        </div>
      </section>

      {/* WHY VOLTQ */}
      <section className="py-16 px-6 lg:px-12 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-12">Why Choose <span className="text-green-400">VoltQ?</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🏆", title: "Verified Vendors", desc: "All sellers are verified and trusted" },
              { icon: "💰", title: "Best Prices", desc: "Compare prices from multiple vendors" },
              { icon: "🛡️", title: "Secure Payments", desc: "100% safe and secure transactions" },
            ].map((item) => (
              <div key={item.title} className="p-8 border border-white/10 rounded-xl hover:border-green-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
