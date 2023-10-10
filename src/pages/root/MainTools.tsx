import React from "react"
import { IconContext } from "react-icons"
import { TbTriangleInvertedFilled } from "react-icons/tb"
import { useAppSelector } from "../../app/hooks"
import { sortBy as sortingOptions } from "../../features/projects/sorting"

const MainTools = () => {
  const { sortBy } = useAppSelector((state) => state.projects)
  return (
    <section className="tools-panel">
      <p>View as: </p>
      <p>
        Sort by:{" "}
        <button className="text-btn">
          {sortingOptions[sortBy]}
          {""}
          <IconContext.Provider value={{ size: "12" }}>
            <span>
              <TbTriangleInvertedFilled />
            </span>
          </IconContext.Provider>
        </button>
      </p>
    </section>
  )
}

export default MainTools
