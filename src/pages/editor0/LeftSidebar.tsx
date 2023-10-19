import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import SbTabs, { sbTabOption } from "./SbTabs"
import { useAppSelector } from "../../app/hooks"
import { Link } from "react-router-dom"
import { CurrentDocContext } from "./Editor"
import Loading from "../../Loading"

const LeftSidebar = () => {
  const { activeElementId } = useAppSelector((state) => state.documents)
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
      <div className="sb-inner">
        <article className="flex-col top-panel">
          <p className="doc-title">{docTitle}</p>
          <Link to="../.." className="back-btn">
            {"<"} All projects
          </Link>
        </article>
        <p>Navigation: </p>
        <SbTabs
          options={sbOptions}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
        />
        <p>Current element ID: {activeElementId}</p>
      </div>
    </StyledLeftSb>
  )
}

export default LeftSidebar

const StyledLeftSb = styled.aside`
  top: 0;
  bottom: 0;
  border-right: 1px solid red;
  flex-grow: 1;
  flex-basis: 300px;
  min-width: 154px;

  .sb-inner {
    position: absolute;
  }

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
    font-size: var(--h3-size);
    font-weight: bold;
    text-align: left;
    text-decoration: none;
  }
`