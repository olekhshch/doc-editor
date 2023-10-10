import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import SbTabs, { sbTabOption } from "./SbTabs"
import { useAppSelector } from "../../app/hooks"
import { Link } from "react-router-dom"
import { CurrentDocContext } from "./Editor"
import Loading from "../../Loading"

const LeftSidebar = () => {
  const [sbOptions, setSbOption] = useState<[sbTabOption, sbTabOption]>([
    "Doc",
    "Project",
  ])

  const [docTitle, setDocTitle] = useState("")
  const [activeIdx, setActiveIdx] = useState<0 | 1>(0)

  const docInfo = useContext(CurrentDocContext)

  useEffect(() => {
    if (docInfo) {
      const { title, _id } = docInfo
      setDocTitle(title)
    }
  }, [docInfo])

  if (!docInfo) {
    return <Loading />
  }

  return (
    <StyledLeftSb className="editor-sb">
      <article className="flex-col top-panel">
        <p className="doc-title">{docTitle}</p>
        <Link to="../.." className="back-btn">
          {"<"} Back
        </Link>
      </article>
      <p>Navigation: </p>
      <SbTabs
        options={sbOptions}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
      />
    </StyledLeftSb>
  )
}

export default LeftSidebar

const StyledLeftSb = styled.aside`
  background-color: #f3f0fa;

  .top-panel {
    margin-bottom: 12px;
  }

  .doc-title {
    color: var(--main);
    font-size: var(--p-size);
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }

  article {
    gap: 4px;
  }

  .back-btn {
    padding: 4px 8px;
    width: max-content;
    background-color: var(--main);
    border: none;
    color: var(--white);
    font-size: var(--h2-size);
    font-weight: bold;
    text-align: left;
    text-decoration: none;
  }
`
