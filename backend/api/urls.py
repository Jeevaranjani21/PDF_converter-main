from django.urls import path
from . import views

urlpatterns = [
    path("split/prepare/", views.split_prepare, name="split_prepare"),
    path("compress/", views.compress_pdf_view, name="compress_pdf"),
    path("merge/", views.merge_pdfs, name="merge_pdfs"),
    path("rotate/", views.rotate_pdf, name="rotate_pdf"),
    path("delete-pages/", views.delete_pages, name="delete_pages"),
    path("extract-pages/", views.extract_pages, name="extract_pages"),
    path("protect/", views.protect_pdf, name="protect_pdf"),
    path("unlock/", views.unlock_pdf, name="unlock_pdf"),
    path("flatten/", views.flatten_pdf, name="flatten_pdf"),
    path("pdf-to-word/", views.pdf_to_word, name="pdf_to_word"),
    path("pdf-to-image/", views.pdf_to_image, name="pdf_to_image"),
    path("image-to-pdf/", views.image_to_pdf, name="image_to_pdf"),
    path("auto-rename/", views.auto_rename_pdf, name="auto_rename_pdf"),
    path("reorder-pages/", views.reorder_pages, name="reorder_pages"),
    path("jobs/<str:job_id>/zip/", views.download_job_zip, name="download_job_zip"),
    path("jobs/<str:job_id>/file/<str:filename>/", views.download_job_file, name="download_job_file"),

    # View & Edit
    path("number-pages/", views.number_pages, name="number_pages"),
    path("crop/", views.crop_pdf, name="crop_pdf"),
    path("watermark/", views.watermark_pdf, name="watermark_pdf"),
    path("form-fill/", views.form_fill, name="form_fill"), 
    
    # Conversion
    path("pdf-to-excel/", views.pdf_to_excel, name="pdf_to_excel"),
    path("pdf-to-ppt/", views.pdf_to_ppt, name="pdf_to_ppt"),
    path("pdf-to-text/", views.pdf_to_text, name="pdf_to_text"),
    path("word-to-pdf/", views.word_to_pdf, name="word_to_pdf"),
    path("excel-to-pdf/", views.excel_to_pdf, name="excel_to_pdf"),
    path("ppt-to-pdf/", views.ppt_to_pdf, name="ppt_to_pdf"),
    path("text-to-pdf/", views.text_to_pdf, name="text_to_pdf"),
    path("ocr-pdf/", views.ocr_pdf, name="ocr_pdf"),
    path("sign-pdf/", views.sign_pdf, name="sign_pdf"),
]
