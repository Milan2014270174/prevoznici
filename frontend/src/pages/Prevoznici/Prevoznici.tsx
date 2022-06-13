import React, { useState, useEffect } from "react"
import "./prevoznici.css"
import axiosClient from "../../axios/axiosClient"
import Accordion from "../../components/Accordion/Accordion"
import { useAuthState } from "../../context/authentication"
import { User } from "../../reducers/authentication"
import NewCompanyModal from "../../components/modals/NewCompanyModal/NewCompanyModal"

type Company = {
  company_id: number
  company_name: string
}

const Prevoznici = () => {
  const [companies, setCompanies] = useState([])

  const [newCompanyModal, setNewCompanyModal] = useState(false)

  const user: User | any = useAuthState().user

  function deleteCompany(id: number) {
    console.log("delete", id)
  }

  useEffect(() => {
    axiosClient
      .get("/companies/all")
      .then((res) => {
        console.log(res.data)
        setCompanies(res.data.companys)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return (
    <div className="container py-5">
      <h1 className="page-title">Prevoznici</h1>
      <div className="item-list my-5">
        {companies.map((company: Company, i) => {
          return (
            <Accordion
              key={i}
              id={company.company_id}
              onCollapse={() => false}
              header={
                <div>
                  <h4 className="header-title">{company.company_name}</h4>
                </div>
              }
              body={
                Object.keys(user).length > 0 && user.role_id === 1 ? (
                  <div className="row">
                    <div className="col-6">
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteCompany(company.company_id)}
                      >
                        Izbriši <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )
              }
            />
          )
        })}
      </div>
      {Object.keys(user).length > 0 && user.role_id === 1 ? (
        <>
          <div
            className="add-new-button btn-primary"
            onClick={() => setNewCompanyModal(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </div>
          {newCompanyModal ? (
            <NewCompanyModal
              title={"Dodaj novog prevoznika"}
              closeModal={() => setNewCompanyModal(false)}
            ></NewCompanyModal>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  )
}

export default Prevoznici
