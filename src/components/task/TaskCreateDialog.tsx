import { useMemo, useState } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import { useI18n } from '@/i18n'
import { useAppSelector } from '@/store/hooks'
import TaskForm from './TaskForm'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function TaskCreateDialog({ isOpen, onClose }: Props) {
  const { t } = useI18n()
  const allProjects = useAppSelector((state) => state.project.projects)
  const projects = useMemo(() => allProjects.filter((project) => !project.isArchived), [allProjects])
  const [projectId, setProjectId] = useState('')
  const activeProjectId = projects.some((project) => project.id === projectId) ? projectId : (projects[0]?.id ?? '')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Add task')} width="lg">
      {activeProjectId ? (
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">{t('Project')}</span>
            <Select value={activeProjectId} onChange={(event) => setProjectId(event.target.value)}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>
            <span className="mt-1.5 block text-xs" style={{ color: 'rgb(var(--muted))' }}>
              {t('Choose the project where this task belongs.')}
            </span>
          </label>
          <TaskForm key={activeProjectId} projectId={activeProjectId} onClose={onClose} />
        </div>
      ) : (
        <EmptyState title={t('No active projects')} description={t('Create a project before adding tasks.')} />
      )}
    </Modal>
  )
}
