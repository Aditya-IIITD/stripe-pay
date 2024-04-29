import style from "../styles/UrlAnalysis.module.css";
function UrlAnalysis({ analysis, setAnalysis }) {
  const handleReturn = () => {
    setAnalysis(null);
  };
  return (
    <div className={`${style.urlanalysis}`}>
      <div className={`${style.topcontainer}`}>
        <img
          alt="go back"
          src="https://cdn-icons-png.flaticon.com/128/2099/2099238.png"
          className={`${style.img}`}
          onClick={handleReturn}
        />
        <h2>Url Analysis</h2>
      </div>
      <p>
        <h5>Shortened Url: </h5>
        <span>{analysis.short}</span>
      </p>
    </div>
  );
}

export default UrlAnalysis;
