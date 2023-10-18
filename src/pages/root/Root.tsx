import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "./Header"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { IconContext } from "react-icons"
import { TbTriangleInvertedFilled } from "react-icons/tb"
import Project from "./Project"
import {
  sortBy,
  sortBy as sortingOptions,
} from "../../features/projects/sorting"
import { setSortBy } from "../../features/projects/projectsSlice"
import { sortingOption } from "../../features/projects/initialState"
import DnDProjectPlaceholder from "./DnDProjectPlaceholder"
import WindowContext, {
  RootWindow,
  WindowContextInterface,
} from "./popUps/WindowsContext"
import PopUpWindow from "./popUps/PopUpWindow"
import MainTools from "./MainTools"

const Root = () => {
  const { projects, sortBy } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()

  const [projectsSorted, setProjectsSorted] = useState(projects)
  const [isSortingMenuOpen, setIsSortingMenuOpen] = useState(false)

  const toggleSortingMenu = () => setIsSortingMenuOpen(!isSortingMenuOpen)

  useEffect(() => {
    const sortProjects = () => {
      const projectsCopy = [...projects]
      if (sortBy === "DATE_NEWEST") {
        return projectsCopy.sort((a, b) => b.createdOn - a.createdOn)
      }
      if (sortBy === "ALPHABET") {
        return projectsCopy.sort((a, b) => (a.title > b.title ? 1 : -1))
      }
      return projectsCopy
    }

    const resortedprojects = sortProjects()
    if (resortedprojects) {
      setProjectsSorted(resortedprojects)
    } else {
      setProjectsSorted(projects)
    }
  }, [projects, sortBy])

  const SortingMenu = () => {
    const sortingEntries = Object.entries(sortingOptions)

    const changeSorting = (newSorting: sortingOption) => {
      toggleSortingMenu()
      dispatch(setSortBy(newSorting))
    }
    return (
      <ul className="menu flex-col">
        {sortingEntries.map(([key, value]) => {
          return (
            <li key={key} onClick={() => changeSorting(key as sortingOption)}>
              {value}
            </li>
          )
        })}
      </ul>
    )
  }

  const [isWindowOpen, setIsWindowOpen] = useState(false)
  const [openwindowType, setOpenWindowType] =
    useState<RootWindow>("create-project")

  const [popUpCoordinates, setPopUpCoordinates] = useState({
    top: 100,
    left: 100,
  })
  const [renameDocTitle, setRenameDocTitle] = useState("")
  const [renameDocId, setRenameDocId] = useState<number | null>(null)

  const windowContextValue: WindowContextInterface = {
    isOpen: isWindowOpen,
    setIsopen: setIsWindowOpen,
    windowType: openwindowType,
    setWindowType: setOpenWindowType,
    windowCoordinates: popUpCoordinates,
    setWindowCoordinates: setPopUpCoordinates,
    renameDocTitle,
    setRenameDocTitle,
    renameDocId,
    setRenameDocId,
  }

  return (
    <>
      <WindowContext.Provider value={windowContextValue}>
        <StyledBg>
          <Header />
          <main className="flex-col">
            <MainTools />
            <section className="tools-panel">
              <p>
                Sort by:{" "}
                <button className="text-btn" onClick={toggleSortingMenu}>
                  {sortingOptions[sortBy]}{" "}
                  <IconContext.Provider value={{ size: "12" }}>
                    <span>
                      <TbTriangleInvertedFilled />
                    </span>
                  </IconContext.Provider>
                </button>
              </p>
              {isSortingMenuOpen && <SortingMenu />}
            </section>
            {projectsSorted.map((project, index) => {
              return (
                <div key={project._id}>
                  <DnDProjectPlaceholder placementIndex={index} />
                  <Project project={project} />
                </div>
              )
            })}
          </main>
          {isWindowOpen && <PopUpWindow />}
        </StyledBg>
      </WindowContext.Provider>
    </>
  )
}

export default Root

const StyledBg = styled.div`
  /* position: fixed; */
  width: 100vw;
  overflow-x: hidden;
  min-height: 100vh;
  background: radial-gradient(
    circle,
    var(--main-lighter),
    var(--main),
    var(--black) 80%
  );
  background-attachment: fixed;
  color: var(--white);

  main {
    margin: 90px auto 20px;
    max-width: 80vw;
    gap: 12px;
  }

  .page-content {
    position: fixed;
    top: 0;
    z-index: 100;
  }

  .tools-panel {
    margin-bottom: 64px;
  }

  .tools-panel .text-btn {
    text-align: left;
    border: none;
    border-bottom: 1px solid var(--white);
    background: none;
    font-size: var(--p-size);
    color: var(--white);
  }

  .menu {
    width: 130px;
    position: absolute;
    color: var(--black);
    background-color: var(--white);
  }

  .menu li {
    padding-left: 8px;
    list-style: none;
    user-select: none;
    cursor: pointer;
  }

  .menu li:hover {
    color: var(--white);
    background-color: var(--main);
    font-weight: bold;
  }
`
