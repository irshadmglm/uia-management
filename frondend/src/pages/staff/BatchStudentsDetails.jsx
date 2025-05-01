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
    <StudentTable students={batchStudents} />
  )
}

export default BatchStudentsDetails