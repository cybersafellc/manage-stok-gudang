/* ================= CELL ================= */
function drawCell(doc, text, x, y, width, height, options = {}) {
  const padding = 5

  doc.rect(x, y, width, height).stroke()

  doc.text(text ?? "-", x + padding, y + padding, {
    width: width - padding * 2,
    ...options
  })
}

/* ================= AUTO ROW HEIGHT ================= */
function getRowHeight(doc, texts, widths) {
  const padding = 5
  const minHeight = 24

  doc.font("Helvetica").fontSize(9)

  const heights = texts.map((text, i) =>
    doc.heightOfString(text ?? "-", {
      width: widths[i] - padding * 2
    }) + padding * 2
  )

  return Math.max(minHeight, ...heights)
}

export { getRowHeight, drawCell };
