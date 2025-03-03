import os
import shutil

# Definição da estrutura organizada
estrutura = {
    "backend": ["server.py", "uploads"],
    "backend/static": ["styles.css", "js"],
    "backend/static/js": ["veiculos.js"],
    "backend/templates": ["veiculos.html"],
    "frontend": ["pages"],
    "frontend/pages": ["veiculos.html"],  # Se precisar de uma cópia para frontend puro
}

# Função para criar diretórios
def criar_diretorios():
    for pasta in estrutura.keys():
        os.makedirs(pasta, exist_ok=True)

# Função para mover arquivos existentes
def mover_arquivos():
    for pasta, arquivos in estrutura.items():
        for arquivo in arquivos:
            if os.path.exists(arquivo):
                destino = os.path.join(pasta, os.path.basename(arquivo))
                shutil.move(arquivo, destino)
                print(f"✅ Movido: {arquivo} ➡️ {destino}")

# Executar reorganização
if __name__ == "__main__":
    criar_diretorios()
    mover_arquivos()
    print("\n🚀 Estrutura reorganizada com sucesso!")
