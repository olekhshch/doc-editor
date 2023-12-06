import React, { useEffect } from "react"
import Loading from "../../Loading"
import { useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"

const ActiveDocRedirect = () => {
  const { activeDocumentId } = useAppSelector((state) => state.documents)
  const navigation = useNavigate()

  useEffect(() => {
    if (activeDocumentId) {
      navigation(`/docs/${activeDocumentId}`)
    }
  }, [activeDocumentId, navigation])

  return <Loading />
}

export default ActiveDocRedirect
