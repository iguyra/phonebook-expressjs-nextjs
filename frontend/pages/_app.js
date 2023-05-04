import axios from "axios";
import "../sass/main.scss";
import "bootstrap/dist/css/bootstrap.min.css";
axios.defaults.withCredentials = true;

function App(props) {
  const { Component, pageProps } = props;

  return (
    <main>
      <Component {...pageProps} />;
    </main>
  );
}

export default App;
