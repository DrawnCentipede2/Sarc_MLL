import React, { useState, useEffect } from 'react';
    import './App.css';

    function App() {
      const [primaryText, setPrimaryText] = useState('');
      const [result, setResult] = useState('');
      const [metrics, setMetrics] = useState({
        sarcasm: Math.floor(Math.random() * 100),
        humor: Math.floor(Math.random() * 100),
        politeness: Math.floor(Math.random() * 100),
        sassiness: Math.floor(Math.random() * 100),
      });
      const [isAnalyzing, setIsAnalyzing] = useState(false);
      const [error, setError] = useState('');
      const [favorites, setFavorites] = useState([]);
      const [rating, setRating] = useState(0);
      const [showOnboarding, setShowOnboarding] = useState(true);

      useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      }, []);

      const analyzeText = () => {
        setIsAnalyzing(true);
        setError('');

        setTimeout(() => {
          try {
            // Simple logic for sarcasm and tone analysis
            const isSarcastic = primaryText.includes('!') || primaryText.includes('?');
            const humorLevel = (primaryText.match(/ha/gi) || []).length * 10;
            const politenessLevel = (primaryText.match(/please|thank/gi) || []).length * 10;
            const sassinessLevel = (primaryText.match(/duh|really/gi) || []).length * 10;

            const newMetrics = {
              sarcasm: isSarcastic ? 50 : 0,
              humor: humorLevel,
              politeness: politenessLevel,
              sassiness: sassinessLevel,
            };

            setMetrics(newMetrics);

            const highestMetric = Object.keys(newMetrics).reduce((a, b) => (newMetrics[a] > newMetrics[b] ? a : b));

            setResult(isSarcastic ? 'Oh, the sarcasm is strong with this one!' : 'Seems legit, no sarcasm detected.');
          } catch (err) {
            setError('Oops! Something went wrong. Maybe try being a bit nicer?');
          } finally {
            setIsAnalyzing(false);
          }
        }, 1000); // Simulate quick analysis time
      };

      const saveFavorite = () => {
        const newFavorite = { text: primaryText, result, metrics };
        setFavorites([...favorites, newFavorite]);
        localStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]));
      };

      const rateAnalysis = (rating) => {
        setRating(rating);
        // Implement rating logic here
      };

      const closeOnboarding = () => {
        setShowOnboarding(false);
      };

      return (
        <div className="container">
          {showOnboarding && (
            <div className="onboarding">
              <h2>Welcome to the Sarcasm & Tone Analyzer!</h2>
              <p>Paste your text, get instant feedback, and have a laugh!</p>
              <p>Save your favorites and rate our predictions.</p>
              <button className="close-button" onClick={closeOnboarding}>Got it!</button>
            </div>
          )}
          <div className="header">Sarcasm & Tone Analyzer</div>
          <textarea
            className="input-area primary"
            placeholder="Paste the text you want to decode... (Optional: Include context)"
            value={primaryText}
            onChange={(e) => setPrimaryText(e.target.value)}
          />
          <button className="analyze-button" onClick={analyzeText} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Decode This!'}
          </button>
          {isAnalyzing && (
            <div className="loading-message">
              <div className="loading-indicator"></div>
              <div className="loading-text">Decoding sarcasm... Hang tight!</div>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          {!isAnalyzing && result && (
            <>
              <div className="result">{result}</div>
              <div className="metrics">
                {Object.keys(metrics).map((metric) => (
                  <div key={metric} className="metric">
                    <div className={`progress-circle ${metric}`}>
                      <div className="progress" style={{ transform: `rotate(${metrics[metric] * 3.6}deg)` }}></div>
                      <div className="percentage">{metrics[metric]}%</div>
                    </div>
                    <div className="metric-label">{metric.charAt(0).toUpperCase() + metric.slice(1)}</div>
                  </div>
                ))}
              </div>
              <div className="response-section">
                <button className="save-button" onClick={saveFavorite}>
                  Save Favorite
                </button>
                <div className="rating-section">
                  <label>Rate the accuracy:</label>
                  <select value={rating} onChange={(e) => rateAnalysis(e.target.value)}>
                    <option value="1">1 - Terrible</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Okay</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    export default App;
