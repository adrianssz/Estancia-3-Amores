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


      <div className="category-options">

        <label>
          <input
            type="checkbox"
            checked={filtros.hortalicas}
            onChange={() =>
              alternarFiltro('hortalicas')
            }
          />

          Hortaliças
        </label>


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
            checked={filtros.emCrescimento}
            onChange={() =>
              alternarFiltro('emCrescimento')
            }
          />

          Em crescimento
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

    </div>

  )

}


export default CategoryFilter