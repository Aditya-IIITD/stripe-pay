const { app, output } = require("@azure/functions");
const crypto = require("crypto");

const sendToSql = output.sql({
  commandText: "dbo.ToDo",
  connectionStringSetting:
    "Server=tcp:mysqlserver886.database.windows.net,1433;Initial Catalog=mysampledb;Persist Security Info=False;User ID=azureuser;Password=azUre@886;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
});

app.http("Redirect", {
  methods: ["GET", "POST"],
  extraOutputs: [sendToSql],
  handler: async (request, context) => {
    try {
      context.log(`Http function processed request for url "${request.url}"`);

      const name = request.query.get("name") || (await request.text());

      if (!name) {
        return { status: 404, body: "Missing required data" };
      }

      // Stringified array of objects to be inserted into the database
      const data = JSON.stringify([
        {
          // create a random ID
          Id: crypto.randomUUID(),
          title: name,
          completed: false,
          url: "",
        },
      ]);

      // Output to Database
      context.extraOutputs.set(sendToSql, data);

      const responseMessage = name
        ? "Hello, " +
          name +
          ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

      // Return to HTTP client
      return { body: responseMessage };
    } catch (error) {
      context.log(`Error: ${error}`);
      return { status: 500, body: "Internal Server Error" };
    }
  },
});
