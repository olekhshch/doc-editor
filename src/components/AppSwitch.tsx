import React from "react"
import "./Switch.css"

type props = {
  title?: string
  checked: boolean
  changeHandler: (e: React.ChangeEvent) => void
}

const AppSwitch = ({ title, checked, changeHandler }: props) => {
  return (
    <div className="app-switch-wrapper">
      <span
        className="app-switch-title"
        style={{ color: checked ? "var(--main)" : "grey" }}
      >
        {title}
      </span>
      <label
        className="app-switch"
        style={{ background: checked ? "var(--gray)" : "grey" }}
      >
        <input type="checkbox" checked={checked} onChange={changeHandler} />{" "}
        <span className="app-slider" data-checked={checked} />
      </label>
    </div>
  )
}

export default AppSwitch
