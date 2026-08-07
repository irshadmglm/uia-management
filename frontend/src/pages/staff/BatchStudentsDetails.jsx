import React, { useEffect } from 'react'
import StudentTable from '../../components/StudentTable'
import { useStudentStore } from '../../store/studentStore'
import { useParams } from 'react-router-dom';


const BatchStudentsDetails = () => {
    const { batchId } = useParams();

const { getBatchStudents, batchStudents } = useStudentStore()
    useEffect(() => {
        getBatchStudents(batchId)
    }, [getBatchStudents])
    
  return (
   <>
   <div className="flex flex-col items-center text-gray-900 dark:text-white">
    
    <StudentTable students={batchStudents} />
    </div>
   </>
  )
}

export default BatchStudentsDetails