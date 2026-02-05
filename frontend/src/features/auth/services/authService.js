const API_URL = "http://localhost:8000"

export async function register(data) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erro ao criar conta")
    }

    return response.json()
}