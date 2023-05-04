let APIbaseURL = "http://127.0.0.1:8000/api";

if (process.env.NODE_ENV === "development") {
  APIbaseURL = APIbaseURL;
}

if (process.env.NODE_ENV === "production") {
  APIbaseURL = urlChoice("prod");
}

function urlChoice(choice) {
  if (choice === "prod") {
    return "https://phonebookbackend-nine.vercel.app/api";
  }

  if (choice === "dev") {
    return APIbaseURL;
  }
}

module.exports = APIbaseURL;
