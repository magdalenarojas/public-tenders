'use client'

import { useState, useEffect, use } from 'react'
import { ArrowLeft, DollarSign, TrendingUp, Package, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TenderWithDetails {
  id: string
  client: string
  awardDate: string
  deliveryDate?: string
  deliveryAddress?: string
  contactPhone?: string
  contactEmail?: string
  margin?: number
  createdAt: string
  orders: Array<{
    id: string
    quantity: number
    price?: number
    observation?: string
    product: {
      id: string
      name: string
      sku: string
      salePrice: number
      costPrice: number
    }
  }>
  summary: {
    totalRevenue: number
    totalCost: number
    totalMargin: number
    productCount: number
  }
}

export default function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [tender, setTender] = useState<TenderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = use(params)

  const fetchTender = async () => {
    try {
      const response = await fetch(`/api/tenders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTender(data)
      } else {
        router.push('/tenders')
      }
    } catch (error) {
      console.error('Error fetching tender:', error)
      router.push('/tenders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTender()
  }, [id, fetchTender])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando licitación...</p>
        </div>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Licitación no encontrada</p>
          <Link href="/tenders" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Volver a licitaciones
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/tenders"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tender.client}</h1>
                <p className="text-gray-600">Licitación adjudicada el {formatDate(tender.awardDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Productos</p>
                <p className="text-2xl font-bold text-gray-900">{tender.summary.productCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(tender.summary.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Costos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(tender.summary.totalCost)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Margen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(tender.summary.totalMargin)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tender Information */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Información de la Licitación</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Adjudicación</p>
                  <p className="font-medium text-gray-900">{formatDate(tender.awardDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Total de Productos</p>
                  <p className="font-medium text-gray-900">{tender.summary.productCount} productos</p>
                </div>
              </div>
              {tender.deliveryDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Entrega</p>
                    <p className="font-medium text-gray-900">{formatDate(tender.deliveryDate)}</p>
                  </div>
                </div>
              )}
              {tender.margin && (
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Margen</p>
                    <p className="font-medium text-gray-900">{(tender.margin * 100).toFixed(1)}%</p>
                  </div>
                </div>
              )}
            </div>
            
            {tender.deliveryAddress && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Dirección de Entrega</p>
                <p className="font-medium text-gray-900">{tender.deliveryAddress}</p>
              </div>
            )}
            
            {(tender.contactPhone || tender.contactEmail) && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {tender.contactPhone && (
                  <div>
                    <p className="text-sm text-gray-600">Teléfono de Contacto</p>
                    <p className="font-medium text-gray-900">{tender.contactPhone}</p>
                  </div>
                )}
                {tender.contactEmail && (
                  <div>
                    <p className="text-sm text-gray-600">Email de Contacto</p>
                    <p className="font-medium text-gray-900">{tender.contactEmail}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Detail */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Productos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tender.orders.map((order) => {
                  const totalRevenue = order.product.salePrice * order.quantity
                  const totalCost = order.product.costPrice * order.quantity
                  const margin = totalRevenue - totalCost
                  const marginPercentage = ((margin / totalRevenue) * 100).toFixed(1)
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(order.product.salePrice)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(order.product.costPrice)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(totalRevenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-green-600">{formatCurrency(margin)}</div>
                          <div className="text-gray-500">({marginPercentage}%)</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.observation || '-'}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    TOTALES:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(tender.summary.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {formatCurrency(tender.summary.totalMargin)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
