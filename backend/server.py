from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import PyPDF2
import re
from werkzeug.utils import secure_filename
import sqlite3

app = Flask(__name__)
CORS(app)  # Permitir requisições de diferentes origens (Cross-Origin)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Configuração do banco de dados SQLite
DB_FILE = "veiculos.db"

def init_db():
    """Inicializa o banco de dados e cria a tabela, se não existir"""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS veiculos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                placa TEXT,
                renavam TEXT,
                chassi TEXT,
                ano_fabricacao TEXT,
                modelo TEXT,
                proprietario TEXT
            )
        ''')
        conn.commit()

init_db()

def extract_crlv_data(pdf_path):
    """Extrai os dados do CRLV a partir do PDF"""
    try:
        with open(pdf_path, "rb") as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])

        # Expressões regulares para extração de dados
        placa = re.search(r"\b[A-Z]{3}-\d{4}\b", text)
        renavam = re.search(r"\b\d{9,11}\b", text)  # Renavam tem entre 9 e 11 dígitos
        chassi = re.search(r"\b[A-HJ-NPR-Z0-9]{17}\b", text)  # Padrão de 17 caracteres do chassi
        ano_fabricacao = re.search(r"\b(19|20)\d{2}\b", text)
        modelo = re.search(r"Modelo:\s*(.+)", text)
        proprietario = re.search(r"Proprietário:\s*(.+)", text)

        dados_extraidos = {
            "placa": placa.group(0) if placa else "Não encontrado",
            "renavam": renavam.group(0) if renavam else "Não encontrado",
            "chassi": chassi.group(0) if chassi else "Não encontrado",
            "ano_fabricacao": ano_fabricacao.group(0) if ano_fabricacao else "Não encontrado",
            "modelo": modelo.group(1) if modelo else "Não encontrado",
            "proprietario": proprietario.group(1) if proprietario else "Não encontrado",
        }

        return dados_extraidos

    except Exception as e:
        return {"error": f"Erro ao extrair dados: {str(e)}"}

@app.route("/upload", methods=["POST"])
def upload_pdf():
    """Recebe o arquivo PDF e extrai os dados do CRLV"""
    if "file" not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Nome de arquivo inválido"}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        # Extrair os dados do CRLV
        extracted_data = extract_crlv_data(file_path)

        return jsonify(extracted_data)

@app.route("/cadastrar-veiculo", methods=["POST"])
def cadastrar_veiculo():
    """Recebe os dados do veículo e salva no banco de dados"""
    data = request.json

    required_fields = ["placa", "renavam", "chassi", "ano_fabricacao", "modelo", "proprietario"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios ausentes"}), 400

    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO veiculos (placa, renavam, chassi, ano_fabricacao, modelo, proprietario)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (data["placa"], data["renavam"], data["chassi"], data["ano_fabricacao"], data["modelo"], data["proprietario"]))
            conn.commit()

        return jsonify({"message": "Veículo cadastrado com sucesso!"})

    except Exception as e:
        return jsonify({"error": f"Erro ao salvar no banco de dados: {str(e)}"}), 500

@app.route("/veiculos", methods=["GET"])
def listar_veiculos():
    """Retorna a lista de veículos cadastrados"""
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM veiculos")
            veiculos = cursor.fetchall()

        veiculos_list = [
            {
                "id": row[0],
                "placa": row[1],
                "renavam": row[2],
                "chassi": row[3],
                "ano_fabricacao": row[4],
                "modelo": row[5],
                "proprietario": row[6]
            }
            for row in veiculos
        ]

        return jsonify(veiculos_list)

    except Exception as e:
        return jsonify({"error": f"Erro ao buscar veículos: {str(e)}"}), 500

@app.route("/uploads/<filename>")
def get_file(filename):
    """Permite baixar os arquivos PDF enviados"""
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
    app.run(debug=True)
