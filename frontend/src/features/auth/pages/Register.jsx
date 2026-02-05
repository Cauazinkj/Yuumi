import AuthForm from "../components/AuthForm"
import { register } from "../services/authService"

function Register() {
    async function handleRegister(data) {
        try {
            const user = await register(data)
            console.log("Usuario criado: ", user)
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <AuthForm
            title="Criar conta"
            submitText="Cadastrar"
            fields={[
                { name: "name", label: "Nome", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "password", label: "Senha", type: "password"}
            ]}
            onSubmit={handleRegister}
        />
    )
}

export default Register