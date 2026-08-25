import '../styles/CategoryFilter.css'


function CategoryFilter({
  filtros,
  alternarFiltro
}) {

  return (

    <div className="category-filter">

      <span className="category-title">
        Categoria
      </span>


      <div className="category-groups">

        <div className="category-group">

          <label>
            <input
              type="checkbox"
              checked={filtros.graos}
              onChange={() =>
                alternarFiltro('graos')
              }
            />

            Grãos
          </label>


          <label>
            <input
              type="checkbox"
              checked={filtros.legumes}
              onChange={() =>
                alternarFiltro('legumes')
              }
            />

            Legumes
          </label>


          <label>
            <input
              type="checkbox"
              checked={filtros.verduras}
              onChange={() =>
                alternarFiltro('verduras')
              }
            />

            Verduras
          </label>


          <label>
            <input
              type="checkbox"
              checked={filtros.frutas}
              onChange={() =>
                alternarFiltro('frutas')
              }
            />

            Frutas
          </label>

        </div>


        <div className="category-group">

          <label>
            <input
              type="checkbox"
              checked={filtros.colhidas}
              onChange={() =>
                alternarFiltro('colhidas')
              }
            />

            Colhidas
          </label>


          <label>
            <input
              type="checkbox"
              checked={filtros.emCrescimento}
              onChange={() =>
                alternarFiltro('emCrescimento')
              }
            />

            Em crescimento
          </label>

        </div>

      </div>

    </div>

  )

}


export default CategoryFilter