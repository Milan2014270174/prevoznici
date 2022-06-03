import "./home.css"

const Home = () => {
  return (
    <div className="home-page">
      <div
        className="hero d-flex justify-content-start align-items-center"
        style={{ backgroundImage: `url('images/hero.png')` }}
      >
        <h1 className="title">Dobrodošli na online prodaju karata</h1>
      </div>
      <div className="container py-5">
        <div className="search-wrapper">
          <div className="row col-12">
            <div className="col col-6 col-md-3">
              <label htmlFor="search">Pretraga</label>
              <input
                id="search"
                type="text"
                className="search"
                placeholder="Prevoznici"
              />
            </div>
            <div className="col col-6 col-md-3">
              <label htmlFor="polazak">Mesto polaska</label>
              <select name="polazak" id="polazak" placeholder="Mesto polaska">
                <option>-</option>
                <option>Beograd</option>
                <option>Niš</option>
                <option>Novi Sad</option>
              </select>
            </div>
            <div className="col col-6 col-md-3">
              <label htmlFor="dolazak">Mesto dolaska</label>
              <select name="dolazak" id="dolazak">
                <option>-</option>
                <option>Beograd</option>
                <option>Niš</option>
                <option>Novi Sad</option>
              </select>
            </div>
            <div className="col col-6 col-md-3">
              <label htmlFor="datum">Datum polaska</label>
              <input id="datum" type="date" className="date" />
            </div>
          </div>
        </div>
        <div className="item-list"></div>
      </div>
    </div>
  )
}

export default Home
