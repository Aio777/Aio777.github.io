# Aryan Lokesh - portfolio

Astro portfolio published at https://aryanlokesh.me/.

## CV

The readable CV at /cv/ and the one-page PDF use src/data/cv.json.
After changing this content, regenerate the PDF before deployment:

```sh
python -m pip install reportlab
python scripts/render-cv.py
npm run build
npm test
```

The PDF generator rejects a CV that exceeds one page. Render and inspect the PDF
after changes to check text wrapping and link placement. The generated PDF is
committed at public/cv/aryan-lokesh-cv.pdf.
