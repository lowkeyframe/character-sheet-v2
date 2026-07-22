export function generateStudentCode() {
  const hex = Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  return `STU-${hex}`
}

export default function CodeGenerator({ onGenerate }) {
  return (
    <button type="button" className="btn-generate" onClick={() => onGenerate(generateStudentCode())}>
      Générer un code
    </button>
  )
}
