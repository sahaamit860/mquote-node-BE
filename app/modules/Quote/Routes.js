module.exports = (app, express) => {
  const router = express.Router();

  router.get("/quote", (req, res) => {
    res.send("Quote api working");
  });
  router.get("/fot", (req, res) => {
    res.send("fot api working");
  });

  app.use(process.env.baseApiUrl, router);
};
