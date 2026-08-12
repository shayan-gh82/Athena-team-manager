import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import ManagerRoute from '@/components/shared/ManagerRoute'
import AppShell from '@/components/layout/AppShell'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { ProjectCreatePage, ProjectEditPage, TaskCreatePage, TaskEditPage } from '@/pages/ProjectFormPage'

const LoginPage=lazy(()=>import('@/pages/LoginPage'))
const RegisterPage=lazy(()=>import('@/pages/RegisterPage'))
const DashboardPage=lazy(()=>import('@/pages/DashboardPage'))
const ProjectsPage=lazy(()=>import('@/pages/ProjectsPage'))
const ProjectDetailPage=lazy(()=>import('@/pages/ProjectDetailPage'))
const BoardPage=lazy(()=>import('@/pages/BoardPage'))
const TaskListPage=lazy(()=>import('@/pages/TaskListPage'))
const CalendarPage=lazy(()=>import('@/pages/CalendarPage'))
const TimelinePage=lazy(()=>import('@/pages/TimelinePage'))
const ProjectDashboardPage=lazy(()=>import('@/pages/ProjectDashboardPage'))
const MyTasksPage=lazy(()=>import('@/pages/MyTasksPage'))
const TeamPage=lazy(()=>import('@/pages/TeamPage'))
const ActivityPage=lazy(()=>import('@/pages/ActivityPage'))
const AutomationsPage=lazy(()=>import('@/pages/AutomationsPage'))
const ArchivePage=lazy(()=>import('@/pages/ArchivePage'))
const SettingsPage=lazy(()=>import('@/pages/SettingsPage'))
const NotFoundPage=lazy(()=>import('@/pages/NotFoundPage'))

function HomeRedirect(){const userId=useAppSelector((s)=>s.auth.currentUserId);return <Navigate to={userId?'/dashboard':'/login'} replace/>}

export default function App(){
  return <Suspense fallback={<PageSkeleton/>}><Routes>
    <Route path="/" element={<HomeRedirect/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route element={<ProtectedRoute/>}>
      <Route element={<AppShell/>}>
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/projects" element={<ProjectsPage/>}/>
        <Route path="/projects/new" element={<ProjectCreatePage/>}/>
        <Route path="/projects/:projectId/edit" element={<ProjectEditPage/>}/>
        <Route path="/projects/:projectId/tasks/new" element={<TaskCreatePage/>}/>
        <Route path="/projects/:projectId/tasks/:taskId/edit" element={<TaskEditPage/>}/>
        <Route path="/projects/:projectId" element={<ProjectDetailPage/>}>
          <Route index element={<Navigate to="board" replace/>}/>
          <Route path="board" element={<BoardPage/>}/>
          <Route path="list" element={<TaskListPage/>}/>
          <Route path="calendar" element={<CalendarPage/>}/>
          <Route path="timeline" element={<TimelinePage/>}/>
          <Route path="dashboard" element={<ProjectDashboardPage/>}/>
        </Route>
        <Route path="/my-tasks" element={<MyTasksPage/>}/>
        <Route path="/team" element={<TeamPage/>}/>
        <Route path="/activity" element={<ActivityPage/>}/>
        <Route element={<ManagerRoute/>}>
          <Route path="/automations" element={<AutomationsPage/>}/>
          <Route path="/archive" element={<ArchivePage/>}/>
        </Route>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage/>}/>
  </Routes></Suspense>
}
