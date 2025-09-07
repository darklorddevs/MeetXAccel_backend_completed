/**
 * Custom Question Builder Component
 * 
 * Dynamic form builder for creating custom questions for event types.
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Plus, 
  Trash2, 
  Edit, 
  GripVertical,
  Type,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Circle,
  Mail,
  Phone,
  Hash,
  Calendar,
  Clock,
  Link,
  Square
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Form, FormField, FormGrid, FormActions } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { customQuestionSchema, type CustomQuestionData } from '@/lib/validation'
import { QUESTION_TYPES } from '@/lib/constants'

interface CustomQuestionBuilderProps {
  questions: any[]
  onChange: (questions: any[]) => void
  disabled?: boolean
}

export const CustomQuestionBuilder: React.FC<CustomQuestionBuilderProps> = ({
  questions,
  onChange,
  disabled = false,
}) => {
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [editingIndex, setEditingIndex] = useState<number>(-1)

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setEditingIndex(-1)
    setShowQuestionModal(true)
  }

  const handleEditQuestion = (question: any, index: number) => {
    setEditingQuestion(question)
    setEditingIndex(index)
    setShowQuestionModal(true)
  }

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    onChange(newQuestions)
  }

  const handleSaveQuestion = (questionData: any) => {
    if (editingIndex >= 0) {
      // Edit existing question
      const newQuestions = [...questions]
      newQuestions[editingIndex] = { ...questionData, order: editingIndex }
      onChange(newQuestions)
    } else {
      // Add new question
      const newQuestion = { ...questionData, order: questions.length }
      onChange([...questions, newQuestion])
    }
    setShowQuestionModal(false)
  }

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions]
    const [movedQuestion] = newQuestions.splice(fromIndex, 1)
    newQuestions.splice(toIndex, 0, movedQuestion)
    
    // Update order values
    const reorderedQuestions = newQuestions.map((q, index) => ({ ...q, order: index }))
    onChange(reorderedQuestions)
  }

  const getQuestionTypeIcon = (type: string) => {
    const questionType = QUESTION_TYPES.find(qt => qt.value === type)
    const IconComponent = questionType?.icon
    
    if (IconComponent) {
      switch (IconComponent) {
        case 'Type': return <Type className="h-4 w-4" />
        case 'AlignLeft': return <AlignLeft className="h-4 w-4" />
        case 'ChevronDown': return <ChevronDown className="h-4 w-4" />
        case 'CheckSquare': return <CheckSquare className="h-4 w-4" />
        case 'Square': return <Square className="h-4 w-4" />
        case 'Circle': return <Circle className="h-4 w-4" />
        case 'Mail': return <Mail className="h-4 w-4" />
        case 'Phone': return <Phone className="h-4 w-4" />
        case 'Hash': return <Hash className="h-4 w-4" />
        case 'Calendar': return <Calendar className="h-4 w-4" />
        case 'Clock': return <Clock className="h-4 w-4" />
        case 'Link': return <Link className="h-4 w-4" />
        default: return <Type className="h-4 w-4" />
      }
    }
    
    return <Type className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <EmptyState
          title="No custom questions"
          description="Add custom questions to collect additional information from invitees."
          icon={Type}
          action={!disabled ? {
            label: 'Add Question',
            onClick: handleAddQuestion,
            icon: Plus,
          } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <Card key={index} variant="secondary">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {!disabled && (
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveQuestion(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="h-6 w-6"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveQuestion(index, Math.min(questions.length - 1, index + 1))}
                        disabled={index === questions.length - 1}
                        className="h-6 w-6"
                      >
                        ↓
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {getQuestionTypeIcon(question.question_type)}
                    <Badge variant="outline" size="sm">
                      {QUESTION_TYPES.find(qt => qt.value === question.question_type)?.label}
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {question.question_text}
                    </p>
                    {question.is_required && (
                      <Badge variant="error" size="sm">Required</Badge>
                    )}
                  </div>

                  {!disabled && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestion(question, index)}
                        leftIcon={<Edit className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(index)}
                        leftIcon={<Trash2 className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!disabled && (
        <Button
          variant="outline"
          onClick={handleAddQuestion}
          leftIcon={<Plus className="h-4 w-4" />}
          className="w-full"
        >
          Add Custom Question
        </Button>
      )}

      {/* Question Editor Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        size="lg"
      >
        <QuestionForm
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => setShowQuestionModal(false)}
        />
      </Modal>
    </div>
  )
}

// Question Form Component
interface QuestionFormProps {
  question?: any
  onSave: (question: any) => void
  onCancel: () => void
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSave,
  onCancel,
}) => {
  const [options, setOptions] = useState<string[]>(question?.options || [''])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomQuestionData>({
    resolver: zodResolver(customQuestionSchema),
    defaultValues: {
      question_text: question?.question_text || '',
      question_type: question?.question_type || 'text',
      is_required: question?.is_required || false,
      options: question?.options || [],
      validation_rules: question?.validation_rules || {},
    },
  })

  const questionType = watch('question_type')
  const needsOptions = ['select', 'multiselect', 'radio'].includes(questionType)

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    setValue('options', newOptions.filter(opt => opt.trim()))
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    setValue('options', newOptions.filter(opt => opt.trim()))
  }

  const onSubmit = (data: CustomQuestionData) => {
    const questionData = {
      ...data,
      options: needsOptions ? options.filter(opt => opt.trim()) : [],
    }
    onSave(questionData)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <FormField>
          <Input
            {...register('question_text')}
            label="Question Text"
            placeholder="What's your company name?"
            error={errors.question_text?.message}
            autoFocus
          />
        </FormField>

        <FormField>
          <Select
            options={QUESTION_TYPES}
            value={questionType}
            onChange={(value) => setValue('question_type', value as any)}
            label="Question Type"
            error={errors.question_type?.message}
          />
        </FormField>

        <FormField>
          <Switch
            checked={watch('is_required')}
            onChange={(checked) => setValue('is_required', checked)}
            label="Required Question"
            description="Invitees must answer this question to book"
          />
        </FormField>

        {/* Options for select/radio questions */}
        {needsOptions && (
          <FormField>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Option
              </Button>
            </div>
            {errors.options && (
              <p className="text-sm text-error-500 mt-1">{errors.options.message}</p>
            )}
          </FormField>
        )}

        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {question ? 'Update Question' : 'Add Question'}
          </Button>
        </FormActions>
      </div>
    </Form>
  )
}