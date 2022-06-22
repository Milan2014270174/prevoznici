import React, { useState, useEffect } from "react"
import "./prevoznici.css"
import axiosClient from "../../axios/axiosClient"
import Accordion from "../../components/Accordion/Accordion"
import { useAuthState } from "../../context/authentication"
import { User } from "../../reducers/authentication"
import NewCompanyModal from "../../components/modals/NewCompanyModal/NewCompanyModal"

type CompanyType = {
  company_id: number
  company_name: string
}

function sortArray(array: CompanyType[]) {
  return array.reverse()
}

const Prevoznici = () => {
  const [companies, setCompanies] = useState<CompanyType[]>([])

  const [success, setSuccess] = useState(false)

  const [newCompanyModal, setNewCompanyModal] = useState(false)

  const user: User | any = useAuthState().user

  function deleteCompany(id: number) {
    axiosClient
      .delete(`/admin/companies/delete/${id}`)
      .then((res) => {
        console.log(res.data)
        let message = res.data.msg
        setSuccess(message)
        setNewCompanyModal(false)
        setCompanies(companies.filter((company) => company.company_id !== id))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function addCompany(name: string) {
    axiosClient
      .post("/admin/companies/add", {
        company_name: name
      })
      .then((res) => {
        console.log(res.data)
        let newCompany = res.data.company
        let message = res.data.message
        setSuccess(message)
        setNewCompanyModal(false)
        setCompanies([newCompany, ...companies])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    axiosClient
      .get("/companies/all")
      .then((res) => {
        console.log(res.data)
        setCompanies(sortArray(res.data.companys))
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return (
    <div className="container py-5">
      <h1 className="page-title mb-3">Prevoznici</h1>
      <div className="item-list my-5">
        <p className="info-text">{success}</p>
        {companies.map((company: CompanyType, i) => {
          return (
            <Accordion
              key={company.company_id}
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
              submitModal={addCompany}
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
