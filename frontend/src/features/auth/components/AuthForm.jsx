import { Link } from "react-router-dom"

function validate() {
    const newErrors = {}

    if ("email" in formData && !formData.email.includes("@")) {
        newErrors.email = "Email invalido"
    }

    if ("password" in formData) {
        const password = formData.password

        if (password.length < 8 || password.length > 32) {
            newErrors.password = "Senha deve ter entre 8 a 32 caracteres"
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = "Senha deve conter letra maiuscula"
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = "Senha deve conter letra minuscula"
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = "Senha deve conter numero"
        } else if (!/[!@#$%^&*()\-_=+\[\]{};:,.<>/?|\\]/.test(password)) {
            newErrors.password = "Senha deve conter caractere especial"
        }
    }

    if ("name" in formData && !formData.name.trim()) {
        newErrors.name = "Nome é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0

}