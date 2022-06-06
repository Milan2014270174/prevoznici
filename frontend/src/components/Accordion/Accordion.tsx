import React, { useState } from "react"
import "./accordion.css"

interface AccordionProps {
  header: React.ReactNode
  body: React.ReactNode
}

const Accordion = ({ header, body }: AccordionProps) => {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className={`accordion-button ${collapsed ? "collapsed" : ""}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded={collapsed ? "false" : `true`}
          aria-controls="collapseOne"
          onClick={() => setCollapsed(!collapsed)}
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
