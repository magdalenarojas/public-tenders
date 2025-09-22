'use client'

import { useState, useEffect } from 'react'
import { Plus, Eye, Trash2, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface TenderWithSummary {
  id: string
  client: string
  awardDate: string
  createdAt: string
  orders: Array<{
    id: string
    quantity: number
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

export default function TendersPage() {
  const [tenders, setTenders] = useState<TenderWithSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTenders()
  }, [])

  const fetchTenders = async () => {
    try {
      const response = await fetch('/api/tenders')
      const data = await response.json()
      setTenders(data)
    } catch (error) {
      console.error('Error fetching tenders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta licitación?')) return

    try {
      const response = await fetch(`/api/tenders/${id}`, { method: 'DELETE' })
      
      if (response.ok) {
        await fetchTenders()
      } else {
        const result = await response.json()
        alert(result.error)
      }
    } catch {
      alert('Error al eliminar la licitación')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando licitaciones...</p>
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
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Licitaciones</h1>
                <p className="text-gray-600">Administra las licitaciones adjudicadas</p>
              </div>
            </div>
            <Link
              href="/tenders/new"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Licitación</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tenders.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No hay licitaciones registradas</p>
            <Link
              href="/tenders/new"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Primera Licitación</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tenders.map((tender) => (
              <div key={tender.id} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tender.client}</h3>
                      <p className="text-sm text-gray-600">
                        Adjudicada el {formatDate(tender.awardDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/tenders/${tender.id}`}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tender.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Productos</p>
                      <p className="text-lg font-semibold text-gray-900">{tender.summary.productCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Ingresos</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(tender.summary.totalRevenue)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Costos</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(tender.summary.totalCost)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Margen</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(tender.summary.totalMargin)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {tender.summary.productCount} producto{tender.summary.productCount !== 1 ? 's' : ''} incluido{tender.summary.productCount !== 1 ? 's' : ''}
                      </p>
                      <Link
                        href={`/tenders/${tender.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ver detalles completos →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
