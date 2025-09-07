/**
 * Workflow Selector Component
 * 
 * Component for selecting workflows to associate with event types.
 */

'use client'

import React from 'react'
import { Workflow, Plus, X } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'

interface WorkflowSelectorProps {
  workflows: any[]
  selectedWorkflows: {
    confirmation: string | null
    reminder: string | null
    cancellation: string | null
  }
  onChange: (workflows: any) => void
  disabled?: boolean
}

export const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({
  workflows,
  selectedWorkflows,
  onChange,
  disabled = false,
}) => {
  const workflowOptions = workflows.map(workflow => ({
    value: workflow.id,
    label: workflow.name,
    description: workflow.description,
  }))

  const handleWorkflowChange = (type: string, workflowId: string | null) => {
    onChange({
      ...selectedWorkflows,
      [type]: workflowId,
    })
  }

  const getWorkflowTrigger = (type: string) => {
    switch (type) {
      case 'confirmation':
        return 'booking_created'
      case 'reminder':
        return 'before_meeting'
      case 'cancellation':
        return 'booking_cancelled'
      default:
        return ''
    }
  }

  const getAvailableWorkflows = (type: string) => {
    const trigger = getWorkflowTrigger(type)
    return workflows.filter(workflow => workflow.trigger === trigger)
  }

  if (workflows.length === 0) {
    return (
      <EmptyState
        title="No workflows available"
        description="Create workflows first to connect them to your event types."
        icon={Workflow}
        action={{
          label: 'Create Workflow',
          href: '/workflows/create',
          icon: Plus,
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Workflow */}
      <Card variant="secondary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-900">Confirmation Workflow</h4>
              <p className="text-xs text-neutral-600">Triggered when a booking is created</p>
            </div>
            <Badge variant="success" size="sm">booking_created</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Select
                options={[
                  { value: '', label: 'No workflow' },
                  ...getAvailableWorkflows('confirmation').map(w => ({
                    value: w.id,
                    label: w.name,
                    description: w.description,
                  })),
                ]}
                value={selectedWorkflows.confirmation || ''}
                onChange={(value) => handleWorkflowChange('confirmation', value || null)}
                placeholder="Select confirmation workflow"
                disabled={disabled}
              />
            </div>
            
            {selectedWorkflows.confirmation && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleWorkflowChange('confirmation', null)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reminder Workflow */}
      <Card variant="secondary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-900">Reminder Workflow</h4>
              <p className="text-xs text-neutral-600">Triggered before meetings start</p>
            </div>
            <Badge variant="info" size="sm">before_meeting</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Select
                options={[
                  { value: '', label: 'No workflow' },
                  ...getAvailableWorkflows('reminder').map(w => ({
                    value: w.id,
                    label: w.name,
                    description: w.description,
                  })),
                ]}
                value={selectedWorkflows.reminder || ''}
                onChange={(value) => handleWorkflowChange('reminder', value || null)}
                placeholder="Select reminder workflow"
                disabled={disabled}
              />
            </div>
            
            {selectedWorkflows.reminder && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleWorkflowChange('reminder', null)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Workflow */}
      <Card variant="secondary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-900">Cancellation Workflow</h4>
              <p className="text-xs text-neutral-600">Triggered when a booking is cancelled</p>
            </div>
            <Badge variant="warning" size="sm">booking_cancelled</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Select
                options={[
                  { value: '', label: 'No workflow' },
                  ...getAvailableWorkflows('cancellation').map(w => ({
                    value: w.id,
                    label: w.name,
                    description: w.description,
                  })),
                ]}
                value={selectedWorkflows.cancellation || ''}
                onChange={(value) => handleWorkflowChange('cancellation', value || null)}
                placeholder="Select cancellation workflow"
                disabled={disabled}
              />
            </div>
            
            {selectedWorkflows.cancellation && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleWorkflowChange('cancellation', null)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {!disabled && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => window.open('/workflows/create', '_blank')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create New Workflow
          </Button>
        </div>
      )}
    </div>
  )
}