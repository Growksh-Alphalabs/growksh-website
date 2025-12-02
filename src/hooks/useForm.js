import { useState } from 'react'

export default function useForm(initial = {}) {
  const [values, setValues] = useState(initial)
  function onChange(e) {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
  }
  return { values, onChange, setValues }
}
