import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import SbTabs, { sbTabOption } from "./SbTabs"
import { useAppSelector } from "../../app/hooks"
import { Link, useSearchParams } from "react-router-dom"
import { CurrentDocContext, CurrentThemeContext } from "./Editor"
import Loading from "../../Loading"
import DocNavigation from "./sidebarMenus/DocNavigation"
import AppSwitch from "../../components/AppSwitch"
import AppButton from "../../components/AppButton"
import usePersist from "../../app/usePersist"

const LeftSidebar = () => {
  const { activeElementId } = useAppSelector((state) => state.documents)
  const [sbOptions, setSbOption] = useState<[sbTabOption, sbTabOption]>([
    "Doc",
    "Project",
  ])

  const { downloadToJSON } = usePersist()

  //READONLY MODE
  const [searchParams, setSearchParams] = useSearchParams()
  const { readonly } = useContext(CurrentDocContext)!

  const setReadOnly = () => setSearchParams({ readonly: "true" })
  const setEditMode = () => setSearchParams({})

  const toggleMode = () => {
    if (readonly) {
      setEditMode()
    } else {
      setReadOnly()
    }
  }

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
      <div className="sb-top">
        <article className="flex-col top-panel">
          {/* <p className="doc-title" style={{ color: main }} title={docTitle}>
            {docTitle}
          </p> */}
          <AppSwitch
            title="Edit mode"
            checked={!readonly}
            changeHandler={toggleMode}
          />
          <Link
            to="../.."
            className="back-btn"
            style={{ backgroundColor: main }}
          >
            {"<"} Main page
          </Link>
        </article>
        <DocNavigation />
        <p>Current element ID: {activeElementId}</p>
      </div>
      <div className="sb-btm">
        <div className="btn-container flex-col" style={{ gap: "4px" }}>
          {/* <AppButton title="Save to LS" onClick={saveCurrentDocState_LS} /> */}
          <AppButton title="Save as JSON" onClick={downloadToJSON} />
        </div>
      </div>
    </StyledLeftSb>
  )
}

export default LeftSidebar

const StyledLeftSb = styled.aside`
  position: fixed;
  top: 24px;
  bottom: 0;
  left: 0;
  flex-grow: 1;
  flex-basis: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 210px;
  min-width: 154px;

  .sb-inner {
  }

  .top-panel {
    margin-bottom: 12px;
  }

  .doc-title {
    font-size: var(--p-size);
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
