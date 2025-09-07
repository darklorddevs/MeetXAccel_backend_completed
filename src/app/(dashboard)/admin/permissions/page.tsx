/**
 * Permissions List Page
 * 
 * Read-only view of all available permissions in the system.
 */

'use client'

import React, { useState } from 'react'
import { Key, Shield, Search } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { usePermissions as usePermissionsList } from '@/hooks/use-api'
import { usePermissions } from '@/hooks/use-auth'
import { useDebounce } from '@/hooks/use-debounce'
import { arrayUtils } from '@/lib/utils'

export default function PermissionsPage() {
  const { canViewAdmin } = usePermissions()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { data: permissions, isLoading } = usePermissionsList()

  // Redirect if no permission
  if (!canViewAdmin) {
    return (
      <AppLayout>
        <div className="p-6">
          <EmptyState
            title="Access Denied"
            description="You don't have permission to view permissions."
            icon={Shield}
          />
        </div>
      </AppLayout>
    )
  }

  // Filter permissions
  const filteredPermissions = React.useMemo(() => {
    if (!permissions) return []
    
    return permissions.filter(permission => {
      const matchesSearch = !debouncedSearch || 
        permission.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        permission.codename.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        permission.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      
      const matchesCategory = !categoryFilter || permission.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
  }, [permissions, debouncedSearch, categoryFilter])

  // Get unique categories
  const categories = React.useMemo(() => {
    if (!permissions) return []
    
    const uniqueCategories = arrayUtils.unique(
      permissions.map(p => p.category).filter(Boolean)
    )
    
    return uniqueCategories.map(category => ({
      value: category,
      label: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }))
  }, [permissions])

  const columns = [
    {
      key: 'name',
      label: 'Permission Name',
      render: (name: string, permission: any) => (
        <div>
          <p className="font-medium text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-600 font-mono">{permission.codename}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (category: string) => (
        <Badge variant="secondary">
          {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (description: string) => (
        <p className="text-sm text-neutral-700 max-w-md">{description}</p>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Permissions</h1>
          <p className="text-neutral-600 mt-1">
            All available permissions in the system
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              
              <Select
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories,
                ]}
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="Filter by category"
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions Table */}
        <Card>
          <CardHeader 
            title={`Permissions (${filteredPermissions.length})`}
            description="System permissions that can be assigned to roles"
          />
          <CardContent>
            {filteredPermissions.length === 0 && !isLoading ? (
              <EmptyState
                title="No permissions found"
                description="No permissions match your current filters."
                icon={Key}
              />
            ) : (
              <Table
                columns={columns}
                data={filteredPermissions}
                loading={isLoading}
                emptyMessage="No permissions found"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}