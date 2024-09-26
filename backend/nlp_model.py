import spacy
import sys

# Cargar el modelo de español de SpaCy
nlp = spacy.load("es_core_news_md")

# Obtener el texto de los síntomas del argumento
sintomas = sys.argv[1]

# Procesar el texto
doc = nlp(sintomas)

# Hacer algún análisis (simplemente contando las palabras aquí como ejemplo)
resultado = len([token.text for token in doc])
print(resultado)
