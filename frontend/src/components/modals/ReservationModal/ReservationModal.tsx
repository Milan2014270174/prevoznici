import React, { ReactNode } from "react"

interface ReservationModalProps {
  title: string
  body: ReactNode
  closeModal: () => any
}

const ReservationModal = ({ title, closeModal }: ReservationModalProps) => {
  return (
    <div
      className="modal fade show"
      id="exampleModal"
      style={{ display: "block" }}
      aria-labelledby="exampleModalLabel"
      aria-hidden="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => closeModal()}
            ></button>
          </div>

          <div className="modal-body">Reserve</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => closeModal()}
            >
              Otkaži
            </button>

            <button type="button" className="btn btn-primary">
              Rezerviši
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationModal
