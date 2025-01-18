from playwright.sync_api import sync_playwright

def run_tests():
    with sync_playwright() as p:
        # Lanzar el navegador
        browser = p.chromium.launch(headless=False)  # Cambiar a True si no necesitas ver las pruebas
        page = browser.new_page()

        # URL de las páginas de prueba
        login_url = "http://localhost:3000/login"
        register_url = "http://localhost:3000/register"

        # Pruebas de la página de registro
        print("=== PRUEBAS DE REGISTRO ===")
        page.goto(register_url)

        # Verificar que la página de registro cargue correctamente
        assert "Registro" in page.title()
        print("Título de la página verificado")

        # Completar el formulario de registro
        page.fill("input[name='newUsername']", "testuser")
        page.fill("input[name='newPassword']", "testpassword")
        page.click("button[type='submit']")

        # Simulación: Verificar que redirige al login o muestra mensaje de éxito (ajustar según la lógica)
        assert page.url == login_url or "Registro exitoso" in page.text_content("body")
        print("Formulario de registro enviado correctamente")

        # Pruebas de la página de login
        print("\n=== PRUEBAS DE LOGIN ===")
        page.goto(login_url)

        # Verificar que la página de login cargue correctamente
        assert "Iniciar Sesión" in page.title()
        print("Título de la página verificado")

        # Intentar login con credenciales inválidas
        page.fill("input[name='username']", "wronguser")
        page.fill("input[name='password']", "wrongpassword")
        page.click("button[type='submit']")

        # Verificar que muestra error
        assert "Usuario o contraseña incorrectos" in page.text_content("body")  # Ajustar mensaje según tu app
        print("Validación de credenciales inválidas exitosa")

        # Intentar login con credenciales válidas
        page.fill("input[name='username']", "testuser")
        page.fill("input[name='password']", "testpassword")
        page.click("button[type='submit']")

        # Verificar que redirige o muestra el contenido del dashboard
        assert "Bienvenido" in page.text_content("body") or page.url != login_url  # Ajustar lógica según tu app
        print("Inicio de sesión exitoso con credenciales válidas")

        # Cerrar el navegador
        browser.close()

# Ejecutar las pruebas
if __name__ == "__main__":
    run_tests()
