import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Problem from './pages/Problem'
import Solution from './pages/Solution'
import TheLoop from './pages/TheLoop'
import Architecture from './pages/Architecture'
import MendrScript from './pages/MendrScript'
import Safety from './pages/Safety'
import UseCases from './pages/UseCases'
import Competitive from './pages/Competitive'
import Stakeholders from './pages/Stakeholders'
import Deployment from './pages/Deployment'
import Roadmap from './pages/Roadmap'
import ROI from './pages/ROI'
import DeveloperExperience from './pages/DeveloperExperience'
import GetStarted from './pages/GetStarted'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

export type PageId =
  | 'home'
  | 'problem'
  | 'solution'
  | 'the-loop'
  | 'architecture'
  | 'mendrscript'
  | 'safety'
  | 'use-cases'
  | 'competitive'
  | 'stakeholders'
  | 'deployment'
  | 'roadmap'
  | 'roi'
  | 'developer-experience'
  | 'get-started'
  | 'sign-in'
  | 'sign-up'

export type NavigateFn = (p: PageId) => void

export default function App() {
  const [page, setPage] = useState<PageId>('home')

  const navigate: NavigateFn = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const pages: Record<PageId, React.ReactNode> = {
    home: <Home navigate={navigate} />,
    problem: <Problem navigate={navigate} />,
    solution: <Solution navigate={navigate} />,
    'the-loop': <TheLoop navigate={navigate} />,
    architecture: <Architecture navigate={navigate} />,
    mendrscript: <MendrScript navigate={navigate} />,
    safety: <Safety navigate={navigate} />,
    'use-cases': <UseCases navigate={navigate} />,
    competitive: <Competitive navigate={navigate} />,
    stakeholders: <Stakeholders navigate={navigate} />,
    deployment: <Deployment navigate={navigate} />,
    roadmap: <Roadmap navigate={navigate} />,
    roi: <ROI navigate={navigate} />,
    'developer-experience': <DeveloperExperience navigate={navigate} />,
    'get-started': <GetStarted navigate={navigate} />,
    'sign-in': <SignIn navigate={navigate} />,
    'sign-up': <SignUp navigate={navigate} />,
  }

  const isAuthPage = page === 'sign-in' || page === 'sign-up'

  return (
    <div className="min-h-full bg-canvas text-on-surface">
      <Navbar currentPage={page} navigate={navigate} />
      <main key={page} className="animate-fade-in">
        {pages[page]}
      </main>
      {!isAuthPage && <Footer navigate={navigate} />}
    </div>
  )
}
