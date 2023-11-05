import React, { useContext, useMemo } from "react"
import styled from "styled-components"
import AddComponentsMenu from "./sidebarMenus/AddComponentsMenu"
import DocNavigation from "./sidebarMenus/DocNavigation"
import StylingMenu from "./sidebarMenus/StylingMenu"
import { CurrentThemeContext } from "./Editor"
export type sbTabOption = "Doc" | "Project" | "Add..." | "Style..."

type props = {
  options: [sbTabOption, sbTabOption]
  activeIdx: 0 | 1
  setActiveIdx: (newIdx: 0 | 1) => void
}

const SbTabs = ({ options, activeIdx, setActiveIdx }: props) => {
  const [firstOption, secondOption] = options

  const handleClick = (newActiveIdx: 0 | 1) => {
    if (newActiveIdx !== activeIdx) {
      setActiveIdx(newActiveIdx)
    }
  }

  //Syling
  const { main } = useContext(CurrentThemeContext)

  const SbMenu = useMemo(() => {
    const activeOption = options[activeIdx]
    switch (activeOption) {
      case "Add...":
        return <AddComponentsMenu />
      case "Doc":
        return <DocNavigation />
      case "Style...":
        return <StylingMenu />
      default:
        return <span>Sb Menu</span>
    }
  }, [activeIdx, options])

  return (
    <StyledTabs $main={main}>
      <div className="options flex">
        <button
          className={
            activeIdx === 0 ? "sb-options-btn active-btn" : "sb-options-btn"
          }
          onClick={() => handleClick(0)}
        >
          {firstOption}
        </button>
        <button
          className={
            activeIdx === 1 ? "sb-options-btn active-btn" : "sb-options-btn"
          }
          onClick={() => handleClick(1)}
        >
          {secondOption}
        </button>
      </div>
      {SbMenu}
    </StyledTabs>
  )
}

export default SbTabs

type styledProps = {
  $main: string
}

const StyledTabs = styled.section<styledProps>`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.$main};

  .options {
    margin-bottom: 12px;
    display: flex;
    border-bottom: 2px solid ${(props) => props.$main};
    min-height: calc(1.2 * var(--h4-size));
  }

  .sb-options-btn {
    min-width: 80px;
    width: 120px;
    flex-grow: 1;
    background: none;
    border: none;
    font-size: var(--h4-size);
    color: ${(props) => props.$main};
  }

  .active-btn {
    font-weight: bold;
  }
`
