import React from 'react'
import Card from '../components/Card'
import {LibraryBig, School,  UserPlus, Users2 } from 'lucide-react'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <Header page={"home"} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 w-full max-w-4xl p-4">
         <Card title="Admission Form" icon={UserPlus} route="/admissionForm" />
         <Card title="Attendens" icon={School} route="/attendance" />
         <Card title="Rgisterd Students" icon={Users2} route="/rgisterd-students" />
         <Card title="Library" icon={LibraryBig} route="/library" />
    </div>
  </div>

  )
}

export default Home