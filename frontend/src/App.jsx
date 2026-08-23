import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setMessage("");
  };

  const identifySong = async () => {
    if (!file) {
      setMessage("Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setLoading(true);
      setMessage("");
      setResult(null);

      const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/identify`,
  formData
);
      if (response.data.success) {
        setResult(response.data.song);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while identifying the song."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <section className="container">
        <div className="brand">
          <div className="logo">🎵</div>
          <h1>SongSense <span>AI</span></h1>
        </div>

        <p className="subtitle">
          Upload a song clip and let AI identify the song instantly.
        </p>

        <div className="upload-card">
          <div className="music-icon">🎧</div>

          <h2>Identify Your Song</h2>

          <p className="upload-text">
            Upload an audio clip to discover the song title, artist and album.
          </p>

          <label className="browse-button">
            📁 Browse Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <div className="selected-file">
              <span>🎵</span>
              <div>
                <small>Selected audio</small>
                <strong>{file.name}</strong>
              </div>
            </div>
          )}

          <button
            className="identify-button"
            onClick={identifySong}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Identifying...
              </>
            ) : (
              <>🔍 Identify Song</>
            )}
          </button>

          {message && (
            <div className="message">
              ⚠️ {message}
            </div>
          )}
        </div>

        {result && (
          <div className="result-card">
            <div className="success-icon">✓</div>

            <p className="found-label">SONG FOUND</p>

            <h2>{result.title}</h2>

            <p className="artist">
              {result.artist}
            </p>

            <div className="song-details">
              <div>
                <span>💿 Album</span>
                <strong>{result.album || "Unknown"}</strong>
              </div>

              {result.releaseDate && (
                <div>
                  <span>📅 Release Date</span>
                  <strong>{result.releaseDate}</strong>
                </div>
              )}

              {result.timecode && (
                <div>
                  <span>⏱️ Timecode</span>
                  <strong>{result.timecode}</strong>
                </div>
              )}
            </div>

            {result.songLink && (
              <a
                className="listen-button"
                href={result.songLink}
                target="_blank"
                rel="noreferrer"
              >
                🎧 Listen to Song
              </a>
            )}
            <footer className="footer">
  <div className="footer-content">
    <h3>🎵 SongSense AI</h3>

    <p>
      Built with ❤️ by <strong>Praveen</strong>
    </p>

    <div className="social-links">
      <a
        href="https://www.linkedin.com/in/gurupraveen-ramachandrayapalle-568005390?utm_source=share_via&utm_content=profile&utm_medium=member_android"
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>

      <a
        href="https://www.instagram.com/praveenrg11?igsi=MXBsb2d3bXFwcXdheQ=="
        target="_blank"
        rel="noreferrer"
      >
        Instagram
      </a>

      <a
        href="https://www.facebook.com/share/1EvSFUz3Kc/"
        target="_blank"
        rel="noreferrer"
      >
        Facebook
      </a>

      <a
        href="https://github.com/Rgpraveen11"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </div>

    <p className="copyright">
      © 2026 SongSense AI. All rights reserved.
    </p>
  </div>
</footer>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;