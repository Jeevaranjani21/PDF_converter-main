import fitz  # PyMuPDF
from io import BytesIO

def compress_pdf(uploaded_file, level="recommended"):
    """
    Simple, reliable compression using PyMuPDF.
    Note: true "image recompress" compression is advanced; this method cleans/optimizes PDF structure.
    """

    # Map levels to settings
    # Higher garbage/clean/deflate helps reduce size; extreme uses more cleanup.
    if level == "extreme":
        garbage = 4
        deflate = True
        clean = True
        linear = True
    elif level == "strong":
        garbage = 3
        deflate = True
        clean = True
        linear = False
    else:  # recommended
        garbage = 2
        deflate = True
        clean = True
        linear = False

    # Read uploaded file bytes
    pdf_bytes = uploaded_file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    out = BytesIO()
    doc.save(
        out,
        garbage=garbage,
        deflate=deflate,
        clean=clean,
        linear=linear,
    )
    doc.close()
    out.seek(0)

    return out, "compressed.pdf"
