/**
 * Table Component
 * 
 * A flexible table component with sorting, pagination, and loading states.
 */

import React from 'react'
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Skeleton } from './loading'

export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  className?: string
  render?: (value: any, row: T, index: number) => React.ReactNode
}

interface TableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  className?: string
  rowClassName?: (row: T, index: number) => string
  onRowClick?: (row: T, index: number) => void
}

export function Table<T = any>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  sortBy,
  sortDirection,
  onSort,
  className,
  rowClassName,
  onRowClick,
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) return null
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (column.render) {
      const index = data.indexOf(row)
      return column.render(row[column.key as keyof T], row, index)
    }
    
    return row[column.key as keyof T]
  }

  if (loading) {
    return (
      <div className={cn('overflow-hidden rounded-lg border border-primary-300', className)}>
        {/* Header skeleton */}
        <div className="bg-primary-100 border-b border-primary-300 px-6 py-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
            {columns.map((column, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
        </div>
        
        {/* Rows skeleton */}
        <div className="divide-y divide-primary-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
                {columns.map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-primary-300 bg-neutral-50', className)}>
      {/* Table Header */}
      <div className="bg-primary-100 border-b border-primary-300">
        <div className="grid gap-4 px-6 py-3" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
          {columns.map((column) => (
            <div
              key={String(column.key)}
              className={cn(
                'flex items-center text-sm font-medium text-neutral-700',
                column.sortable && 'cursor-pointer hover:text-neutral-900',
                column.className
              )}
              onClick={() => column.sortable && handleSort(String(column.key))}
            >
              <span>{column.label}</span>
              {column.sortable && (
                <span className="ml-1 text-neutral-500">
                  {getSortIcon(String(column.key))}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-primary-200">
        {data.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-neutral-500">{emptyMessage}</p>
          </div>
        ) : (
          data.map((row, index) => (
            <div
              key={index}
              className={cn(
                'grid gap-4 px-6 py-4 hover:bg-primary-50 transition-colors',
                onRowClick && 'cursor-pointer',
                rowClassName?.(row, index)
              )}
              style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}
              onClick={() => onRowClick?.(row, index)}
            >
              {columns.map((column) => (
                <div
                  key={String(column.key)}
                  className={cn('text-sm text-neutral-700 flex items-center', column.className)}
                >
                  {getCellValue(row, column)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className,
}) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="text-sm text-neutral-600">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        
        {showPageNumbers && (
          <div className="flex items-center space-x-1">
            {getPageNumbers().map(page => (
              <Button
                key={page}
                variant={page === currentPage ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}