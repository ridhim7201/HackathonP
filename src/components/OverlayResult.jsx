import './OverlayResult.css'

// Displays the captured signboard image with the OCR-detected text region
// highlighted, plus original + transliterated text side by side beneath —
// same "never replace, always compare" rule as the text screen.

export default function OverlayResult({ image, blocks, onRetake }) {
  return (
    <div className="overlay-result">
      <div className="overlay-result__image-wrap">
        <img src={image} alt="Captured signboard" className="overlay-result__image" />
        {blocks.map((block, i) => (
          block.boundingBox && (
            <div
              key={i}
              className="overlay-result__box"
              style={{
                left: `${block.boundingBox.x}px`,
                top: `${block.boundingBox.y}px`,
                width: `${block.boundingBox.width}px`,
                height: `${block.boundingBox.height}px`
              }}
            />
          )
        ))}
      </div>

      {blocks.map((block, i) => (
        <div className="overlay-result__block" key={i}>
          <div className="overlay-result__pair">
            <div className="overlay-result__original">
              <span className="overlay-result__label">Original</span>
              <p className="script-text">{block.text}</p>
            </div>
            <div className="overlay-result__transliterated">
              <span className="overlay-result__label">Transliterated</span>
              <p className="script-text">{block.transliterated || '…'}</p>
              {block.lossy && (
                <span className="overlay-result__lossy-tag">⚠ approximated</span>
              )}
            </div>
          </div>
          {block.confidence < 0.5 && (
            <p className="overlay-result__low-confidence">Low confidence — result may be inaccurate</p>
          )}
        </div>
      ))}

      <button type="button" className="overlay-result__retake" onClick={onRetake}>
        Retake photo
      </button>
    </div>
  )
}
