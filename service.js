const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { endpoints, pollingInterval } = require("./config");

const gateway = new ApolloGateway({
  serviceList: endpoints,
  experimental_pollInterval: pollingInterval,
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        if ("x-orga" in context){
          request.http.headers.set("x-orga", context["x-orga"]);
        }
        if ("x-forwarded-access-token" in context){
          request.http.headers.set("x-forwarded-access-token", context["x-forwarded-access-token"]);
        }
      }
    });
  }
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
    context: ({ req }) => {
      return {
        "x-forwarded-access-token": req.headers["x-forwarded-access-token"] || null,
        "x-orga": req.headers["x-orga"] || null,
      };
    }
  });

  server.listen(8090).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();