import React, { useEffect, useState } from "react"
import "./accordion.css"

interface AccordionProps {
  header: React.ReactNode
  body: React.ReactNode
  customClass: string
  id: number
  isCollapsed: boolean
  onCollapse: (params: number) => any
}

const Accordion = ({
  header,
  customClass,
  isCollapsed,
  body,
  onCollapse,
  id
}: AccordionProps) => {
  const [collapsed, setCollapsed] = useState(isCollapsed ? isCollapsed : false)

  function handleCollapse() {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    if (collapsed === true) {
      onCollapse(id)
    }
  }, [collapsed])

  return (
    <div
      className={`accordion-item ${collapsed ? "show" : ""} ${
        customClass ? customClass : ""
      }`}
    >
      <h2 className="accordion-header" id="headingOne">
        <button
          className={`accordion-button ${collapsed ? "show" : "collapsed"} ${
            body === "" ? "no-icon" : ""
          }`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded={collapsed ? "false" : `true`}
          aria-controls="collapseOne"
          onClick={() => (body === "" ? null : handleCollapse())}
        >
          {header}
        </button>
      </h2>
      <div
        id="collapseOne"
        className={`accordion-collapse collapse ${collapsed ? "show" : ""}`}
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">{body}</div>
      </div>
    </div>
  )
}

export default Accordion
