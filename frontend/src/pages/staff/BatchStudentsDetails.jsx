import React, { useEffect } from 'react'
import StudentTable from '../../components/StudentTable'
import { useStudentStore } from '../../store/studentStore'
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

const BatchStudentsDetails = () => {
    const { batchId } = useParams();

const { getBatchStudents, batchStudents } = useStudentStore()
    useEffect(() => {
        getBatchStudents(batchId)
    }, [getBatchStudents])
    
  return (
   <>
   <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <Header />
    <StudentTable students={batchStudents} />
    </div>
   </>
  )
}

export default BatchStudentsDetails