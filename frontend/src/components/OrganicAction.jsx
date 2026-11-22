import { FiArrowUpRight } from 'react-icons/fi'

// Adaptação do Organic Button da Cult UI para o React/JS e o CSS único
// deste projeto. As curvas SVG seguem o componente MIT original:
// github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/organic-button.tsx
function OrganicAction({ children, className = '', ...props }) {
  return (
    <button className={`organic-action ${className}`} {...props}>
      <svg className="organic-cap" viewBox="0 0 10 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 40V0H6C2.686 0 0 2.686 0 6V34C0 37.314 2.686 40 6 40H10Z" />
      </svg>
      <span className="organic-label">{children}</span>
      <svg className="organic-slope" viewBox="0 0 18 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10.899 0H0V40H2C4.406 40 6.56 38.508 7.405 36.255L17.453 9.458C19.169 4.882 15.786 0 10.899 0Z" />
      </svg>
      <svg className="organic-slope organic-slope-up" viewBox="0 0 18 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M7.101 40H18V0H16C13.594 0 11.44 1.492 10.596 3.745L.547 30.542C-1.169 35.118 2.214 40 7.101 40Z" />
      </svg>
      <span className="organic-icon"><FiArrowUpRight aria-hidden="true" /></span>
      <svg className="organic-cap" viewBox="0 0 10 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40V0H4C7.314 0 10 2.686 10 6V34C10 37.314 7.314 40 4 40H0Z" />
      </svg>
    </button>
  )
}

export default OrganicAction
