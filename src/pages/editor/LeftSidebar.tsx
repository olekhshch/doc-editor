import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import SbTabs, { sbTabOption } from "./SbTabs"
import { useAppSelector } from "../../app/hooks"
import { Link } from "react-router-dom"
import { CurrentDocContext, CurrentThemeContext } from "./Editor"
import Loading from "../../Loading"
import DocNavigation from "./sidebarMenus/DocNavigation"

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

  //theme
  const { main } = useContext(CurrentThemeContext)

  if (!docInfo) {
    return <Loading />
  }

  return (
    <StyledLeftSb className="editor-sb">
      <div className="sb-inner">
        <article className="flex-col top-panel">
          <p className="doc-title" style={{ color: main }}>
            {docTitle}
          </p>
          <Link
            to="../.."
            className="back-btn"
            style={{ backgroundColor: main }}
          >
            {"<"} Main page
          </Link>
        </article>
        {/* <h3>Navigation: </h3> */}
        {/* <SbTabs
          options={sbOptions}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
        /> */}
        <DocNavigation />
        <p>Current element ID: {activeElementId}</p>
      </div>
    </StyledLeftSb>
  )
}

export default LeftSidebar

const StyledLeftSb = styled.aside`
  top: 0;
  bottom: 0;
  flex-grow: 1;
  flex-basis: 300px;
  min-width: 154px;

  .sb-inner {
    position: fixed;
    top: 32px;
  }

  .top-panel {
    margin-bottom: 12px;
  }

  .doc-title {
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
    border: none;
    color: var(--white);
    font-size: var(--h3-size);
    font-weight: bold;
    text-align: left;
    text-decoration: none;
  }
`
